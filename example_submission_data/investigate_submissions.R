# This script is written to investigate new and existing submissions for error
# Key investigation targets include:
# Missing values in Study Table, Response and Repeated
# Duplicated information on Study Level and raw data level
# Incorrect values in accuracy, proportion_true, repeated and response
# Missing Statement Information


# Establish Connection
library(acdcquery)
library(tidyverse)

db_path = "update_truth_hiwi.db"
conn <- acdcquery::connect_to_db(db_path)

# Visual Inspection of tables
arguments_overall <- list() %>% 
  add_argument(
    conn,
    "study_id",
    "greater",
    "0"
  )

study_overview <- query_db(
  conn,
  arguments,
  c("default", "authors", "conducted", "publication_id"),
  "study_table"
)

publication_overview <- query_db(
  conn, 
  arguments,
  c("default"),
  "publication_table"
) %>% distinct()

statementset_overview <- query_db(
  conn, 
  arguments,
  c("default", "study_id", "publication_id"),
  "statementset_table"
) %>% distinct()

statement_overview <- query_db(
  conn, 
  arguments,
  c("default", "statementset_id", "study_id", "publication_id"),
  "statement_table"
) %>% distinct()
  
  
  
result <- query_db(conn,
                   arguments,
                   target_vars = c("default", "study_id", "publication_id", "presentation_id", "phase"),
                   target_table = "observation_table")

result %>% 
  count(is.na(repeated), study_id, phase)

db_path = "update_truth_hiwi.db"
