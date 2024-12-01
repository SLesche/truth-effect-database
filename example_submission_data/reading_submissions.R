files_to_source = list.files("./submission_functions", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files_to_source, source)

path <- "example_submission_data/"
db_path = "truth_db_test3.db"
create_truth_db(db_path)

files <- list.files(paste0(path, "complete_data/"), pattern = ".json$", full.names = TRUE)

conn <- acdcquery::connect_to_db(db_path)
for (isubmission in seq_along(files)){
  submission_obj <- extract_from_submission_json(files[isubmission])
  
  prepped_obj <- prep_submission_data(submission_obj, db_path)
  
  add_submission_to_db(conn, prepped_obj, db_path)
  
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

db_overview = generate_db_overview_table(db_path)

target_cols <- db_overview %>% 
  filter(table %in% c("observation_table", "within_table", "between_table", "repetition_table", "statement_table", "statementset_table", "study_table", "publication_table")) %>% 
  pull(column_name) %>% 
  unique()

result <- query_db(conn,
                   arguments,
                   target_vars = c("response", "repeated", "subject", "rt"),
                   target_table = "observation_table")
test <- query_db(
  conn,
  arguments,
  target_vars = "default",
  target_table = "study_table"
)

sum(test$n_participants)

result %>% distinct() %>% View()
