library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/Data Experiment 1.csv"), encoding = "Latin-1")

statement_data <- data %>% 
  select(statement,
         status) %>% 
  distinct() %>% 
  filter(!is.na(status)) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = statement,
    statement_accuracy = ifelse(status, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  filter(phase > 1) %>% 
  left_join(statement_data) %>% 
  mutate(
    presentation_identifier = paste0(groupdescription, phase),
    within_identifier = 1,
    between_identifier = group,
    response = trating,
    rt = trating.rt,
    trial = trial,
    repeated = ifelse(repetition == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

## Exp 2 ----

data <- data.table::fread(paste0(script_dir, "./data/Data Experiment 2.csv"), encoding = "Latin-1")

statement_data <- data %>% 
  select(statement,
         status) %>% 
  distinct() %>% 
  filter(!is.na(status)) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = statement,
    statement_accuracy = ifelse(status, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))

clean_data <- data %>% 
  filter(phase > 1) %>% 
  left_join(statement_data) %>% 
  mutate(
    presentation_identifier = paste0(groupdescription, phase),
    within_identifier = 1,
    between_identifier = group,
    response = trating,
    rt = trating.rt,
    trial = trial,
    repeated = ifelse(repetition == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))