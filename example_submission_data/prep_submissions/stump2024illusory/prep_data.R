library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/data_confidence_2023.csv")) 

statement_data <- data %>% 
  distinct(statements) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = statements,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = session,
    within_identifier = 1,
    between_identifier = 1,
    subject = id,
    repeated = statement_type,
    response = responses,
    rt = NA,
    trial = NA,
    certainty = confidence
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, certainty, trial) %>% 
  filter(!is.na(subject))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))
