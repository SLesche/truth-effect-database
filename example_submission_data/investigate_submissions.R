# This script is written to investigate new and existing submissions for error
# Key investigation targets include:
# Missing values in Study Table, Response and Repeated
# Duplicated information on Study Level and raw data level
# Incorrect values in accuracy, proportion_true, repeated and response
# Missing Statement Information


# Establish Connection
library(acdcquery)
library(tidyverse)

db_path = "truth_11_04.db"
conn <- acdcquery::connect_to_db(db_path)

# Visual Inspection of tables
arguments <- list() %>% 
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
)
statement_overview <- query_db(
  conn, 
  arguments,
  c("default", "statementset_id", "study_id", "publication_id"),
  "statement_table"
)
  
  
measure_overview <- query_db(
  conn,
  arguments,
  c("default"),
  "measure_table"
)

# Inspect statements and raw data
statement_data <- query_db(
  conn,
  arguments,
  c("default", "study_id", "statementset_publication", "statement_text", "statement_accuracy", "proportion_true")
)

# Inspect Phase and NA data
phase_data <- query_db(
  conn, 
  arguments,
  c("default", "phase", "study_id", "publication_id"),
  "observation_table"
)

phase_data %>% 
  filter(str_detect(phase, "test")) %>% 
  # filter(is.na(repeated)) %>% 
  count(is.na(repeated), study_id)

phase_data %>% 
  filter(str_detect(phase, "test")) %>% 
  filter(is.na(response)) %>% 
  count(is.na(response), study_id)

inspect_repeated_nas <- phase_data %>% 
  filter(study_id == 12, phase == "test") %>% 
  filter(is.na(repeated))

# Inspect truth effect for oddities
phase_data %>% 
  filter(str_detect(phase, "test")) %>% 
  group_by(study_id, repeated) %>% 
  summarize(
    mean_true = mean(response, na.rm = TRUE)
  ) %>% 
  print(n = nrow(.))


query_db(
  conn,
  arguments %>% add_argument(conn, "study_id", "equal", "4")
) %>% 
  count(is.na(repeated))

result <- query_db(conn,
                   arguments,
                   target_vars = c("default", "study_id", "publication_id", "phase"),
                   target_table = "observation_table")

result %>% 
  count(is.na(repeated), study_id, phase)

db_path = "update_truth_hiwi.db"
