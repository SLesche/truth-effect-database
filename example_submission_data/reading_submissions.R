files_to_source = list.files("./submission_functions", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files_to_source, source)

path <- "example_submission_data/"
db_path = "update_truth_hiwi.db"
create_truth_db(db_path)

hiwi_files <- list.files(paste0(path, "complete_data/hiwis_march/"), pattern = ".json$", full.names = TRUE)

conn <- acdcquery::connect_to_db(db_path)
for (isubmission in seq_along(hiwi_files)){
  submission_obj <- extract_from_submission_json(hiwi_files[isubmission])
  
  prepped_obj <- prep_submission_data(conn, submission_obj)
  
  add_submission_to_db(conn, prepped_obj)
}

library(acdcquery)
library(tidyverse)

arguments <- list() %>% 
  add_argument(
    conn,
    "study_id",
    "greater",
    "0"
  )

db_overview = generate_db_overview_table(conn)

target_cols <- db_overview %>% 
  filter(table %in% c("observation_table", "within_table", "between_table", "repetition_table", "study_table", "publication_table")) %>%
  filter(!str_detect(column_name, "statementset")) %>% 
  pull(column_name) %>% 
  unique() 

overview <- query_db(
  conn,
  arguments,
  c("default", "authors", "conducted"),
  "study_table"
)

result <- query_db(conn,
                   arguments,
                   target_vars = c("default", "study_id", "publication_id", "presentation_id", "phase"),
                   target_table = "observation_table")

result %>% 
  count(is.na(repeated), study_id, phase)

everything <- query_db(
  conn,
  arguments,
  target_cols
)

everything %>% count(publication_id, is.na(repeated))

t.test(response ~  repeated, result %>% filter(phase == "test"))

data <- result %>% 
  filter(!is.na(proportion_true))

lme4::lmer(response ~ repeated + proportion_true + (1| subject), data)
