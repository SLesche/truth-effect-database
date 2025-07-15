library(tidyverse)
files_to_source = list.files("./submission_functions", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files_to_source, source)

path <- "example_submission_data/prep_submissions/"
db_path = "ted.db"
create_truth_db(db_path)

conn <- acdcquery::connect_to_db(db_path)

valid_files <- list.files(path, pattern = "^submission_.*\\.json$", full.names = TRUE, recursive = TRUE)

for (isubmission in seq_along(valid_files)){
  raw_obj <- extract_from_submission_json(valid_files[isubmission])
  # # 
  # inspect_publication_data(raw_obj)
  # inspect_study_data(raw_obj)
  # inspect_statementset_data(raw_obj)
  # inspect_condition_data(raw_obj)
  # inspect_raw_data(raw_obj)
  
  submission_obj <- prep_submission_data(conn, raw_obj)
  
  # inspect_publication_data(submission_obj)
  # inspect_study_data(submission_obj)
  # inspect_statementset_data(submission_obj)
  # inspect_condition_data(submission_obj)
  # inspect_raw_data(submission_obj)
  # 
  # inspect_study_data(submission_obj)
  # inspect_raw_data(submission_obj)[[1]] %>% count(certainty)
  
  if (inspect_publication_data(submission_obj)$publication_code == "nadarevic_2018_foreign"){
    # In this data, proportion_true was wrongfully entered with accuracy values
    submission_obj$statementset_info[[1]]$statementset_data <- submission_obj$statementset_info[[1]]$statementset_data %>% 
      mutate(
        proportion_true = ifelse(statement_accuracy == 0, 1 - proportion_true, proportion_true)
      )
    
    submission_obj$statementset_info[[2]]$statementset_data <- submission_obj$statementset_info[[2]]$statementset_data %>% 
      mutate(
        proportion_true = ifelse(statement_accuracy == 0, 1 - proportion_true, proportion_true)
      )
  }
  
  add_submission_to_db(conn, submission_obj)
}

# devtools::install_github("SLesche/acdc-query")
# files_to_source = list.files("../acdc/acdc-query/R", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
# sapply(files_to_source, source)
library(acdcquery)
library(DBI)
library(RSQLite)

library(tidyverse)

arguments <- list() %>% 
  add_argument(
    conn,
    "publication_id",
    "greater",
    "0"
  )

result <- query_db(
  conn,
  arguments,
  "default",
  "study_table"
) %>% distinct()

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
                   target_vars = c("default", "study_id", "publication_id", "statement_text", "statementset_publication", "procedure_id", "phase"),
                   target_table = "observation_table")

length(unique(result$study_id))
length(unique(result$subject))
nrow(result)

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
