files_to_source = list.files("../acdc/acdc-query/R", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files_to_source, source)

library(tidyverse)
library(DBI)
library(RSQLite)
db_path = "truth_db_test2.db"

conn <- connect_to_db(db_path)

arguments <- list() %>% 
  add_argument(
    conn,
    "repetition_type",
    "equal",
    "semantic"
  ) %>% 
  add_argument(
    conn,
    "phase",
    "equal", 
    "test"
  )

target_vars = "default"

target_table = "publication_table"

argument_relation = "and"

result <- query_db(
  conn,
  arguments,
  c("study_id", "default", "statement_text"),
  "observation_table"
)

full_data = dbReadTable(conn, "observation_table")
