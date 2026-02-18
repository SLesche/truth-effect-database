files_to_source = list.files("../../Amsterdam/inhibitiondb/R", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files_to_source, source)

library(tidyverse)
library(DBI)
library(RSQLite)
db_path = "../truth-db-paper/markdown/data/ted.db"
db_path2 = "./ted.db"
check_ted(db_path2)

update_ted(
  db_path2,

)

conn <- connect_to_db(db_path2)

arguments <- list() %>% 
  add_argument(
    conn,
    "publication_id", 
    "greater", 
    0
  ) %>% 
  add_argument(
    conn,
    "repetition_type",
    "equal",
    "exact"
  ) %>% 
  add_argument(
    conn,
    "phase",
    "equal", 
    "test"
  ) %>% 
  add_argument(
    conn,
    "statement_accuracy",
    "equal",
    1
  ) %>% 
  add_argument(
    conn, 
    "n_participants",
    "greater",
    50
  )

target_vars = c("default", "statement_accuracy", "n_participants")

target_table = "statmentset_table"

argument_relation = "and"

result <- query_db(
  conn,
  arguments,
  target_vars,
  target_table
)

full_data = dbReadTable(conn, "observation_table")
