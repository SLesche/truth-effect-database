files_to_source = list.files("./submission_functions", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files_to_source, source)

path <- "example_submission_data/"
db_path = "test5.db"
create_truth_db(db_path)

file <- paste0(path, "submission_test.json")

submission_obj <- extract_from_submission_json(file)

prepped_obj <- prep_submission_data(submission_obj, db_path)

submission_obj = prepped_obj


conn <- acdcquery::connect_to_db(db_path)
add_submission_to_db(conn, submission_obj, db_path)


library(acdcquery)
library(tidyverse)

arguments <- list() %>% 
  add_argument(
    conn,
    "proportion_true",
    "greater",
    "0.5"
  ) %>% 
  add_argument(
    conn,
    "subjective_certainty",
    "equal",
    "0"
  ) %>% 
  add_argument(
    conn,
    "repetition_time",
    "equal",
    "20"
  )

db_overview = generate_db_overview_table(db_path)

target_cols <- db_overview %>% 
  filter(table %in% c("observation_table", "within_table", "between_table", "repetition_table", "statement_table", "statementset_table", "study_table", "publication_table")) %>% 
  pull(column_name) %>% 
  unique()

result <- query_db(conn,
                   arguments,
                   target_vars = target_cols,
                   target_table = "observation_table")

result %>% distinct() %>% View()
