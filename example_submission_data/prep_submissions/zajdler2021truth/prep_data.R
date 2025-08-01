library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/raw_data.csv")) 

statement_data <- data %>% 
  distinct(item, TS) %>% 
  mutate(
    statement_identifier = item,
    statement_text = NA,
    statement_accuracy = ifelse(TS, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = 1,
    subject = CASE,
    repeated = ifelse(repetition, 1, 0),
    response = Y,
    rt = RT/1000,
    trial = NA,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(subject))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))
