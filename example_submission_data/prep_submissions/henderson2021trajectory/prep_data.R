library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/ANON_ratings.csv")) 

phases <- data.table::fread(paste0(script_dir, "./data/ANON_phases.csv")) 
cats <- data.table::fread(paste0(script_dir, "./data/ANON_categories.csv")) 

statement_data <- data %>% 
  distinct(stim_id) %>% 
  mutate(
    statement_identifier = paste0(stim_id),
    statement_text = NA,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  left_join(phases) %>% 
  filter(keep == TRUE) %>% 
  left_join(cats) %>% 
  mutate(
    procedure_identifier = phase_id,
    within_identifier = 1,
    between_identifier = 1,
    subject = ID,
    repeated = ifelse(!is.na(category), 1, 0),
    response = trating,
    rt = NA,
    trial = NA,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))