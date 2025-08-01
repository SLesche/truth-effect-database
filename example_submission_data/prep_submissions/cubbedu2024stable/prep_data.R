library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/data_sessions1_2.csv")) 

statement_data <- data %>% 
  distinct(session, statement_number) %>% 
  mutate(
    statement_identifier = paste0(session, statement_number),
    statement_text = NA,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = session,
    within_identifier = 1,
    between_identifier = 1,
    subject = code,
    within_identifier = 1,
    repeated = ifelse(new_repeated == 1, 0, 1),
    response = judgment,
    rt = NA,
    trial = NA,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

### Exp2 ----
data <- readxl::read_excel(paste0(script_dir, "./data/study2_data_long_anonym.xlsx")) 

statement_data <- data %>% 
  distinct(session, statement_number) %>% 
  mutate(
    statement_identifier = paste0(session, statement_number),
    statement_text = NA,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = session,
    within_identifier = 1,
    between_identifier = 1,
    subject = code,
    within_identifier = 1,
    repeated = ifelse(new_repeated == 1, 0, 1),
    response = judgment,
    rt = NA,
    trial = NA,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))
