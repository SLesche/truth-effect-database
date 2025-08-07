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
  filter(filter == "selected") %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = paste0(groupdescription, phase),
    within_identifier = 1,
    between_identifier = group,
    response = trating,
    rt = trating.rt/1000,
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
  filter(!subject %in% c(49, 60, 127, 43, 138, 179, 17, 
                         177, 26, 75, 36, 7, 96, 24, 67, 2,
                         165, 81, 121, 56, 87, 110, 83, 8, 38, 187, 161)) %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = paste0(groupdescription),
    within_identifier = 1,
    between_identifier = group,
    response = trating,
    rt = responsetime/1000,
    trial = trial,
    repeated = ifelse(repetition == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))
