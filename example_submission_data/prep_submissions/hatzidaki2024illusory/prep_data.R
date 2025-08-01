library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data_gen <- data.table::fread(paste0(script_dir, "./data/MainTask_Padova_Athens_DataSets_Final_CSV.csv")) 

data <- data_gen %>% filter(Experiment == "Padova")

statement_data <- data %>% 
  distinct(Item) %>% 
  mutate(
    statement_identifier = paste0(Item),
    statement_text = NA,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = paste0(ifelse(LanguageTest == "English", "same", "different")),
    subject = Participant,
    repeated = ifelse(Presentation == "Repeated", 1, 0),
    response = Rating,
    rt = RT/1000,
    trial = Trial_Nr,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))


## Exp2 ----
data <- data_gen %>% filter(Experiment == "Athens")

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = paste0(ifelse(LanguageTest == "English", "same", "different")),
    subject = Participant,
    repeated = ifelse(Presentation == "Repeated", 1, 0),
    response = Rating,
    rt = RT/1000,
    trial = Trial_Nr,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))
