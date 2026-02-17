library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- readxl::read_excel(paste0(script_dir, "./data/summed_data_both_sessions_10_2025.xlsx")) 

old_statement_data <- read.csv(paste0(script_dir, "./../stump2022feeling/data/statement_data_1.csv"))

clean_statement_data <- old_statement_data %>% 
  mutate(statement_text = str_remove_all(statement_text, "\"")) %>% 
  mutate(statement_text = str_replace(statement_text, "40.000", "40000")) %>% 
  mutate(statement_text = str_replace(statement_text, "In den USA wird", "In USA wird"))

clean_data <- data %>% 
  mutate(statement_text = str_remove_all(statements, "'")) %>% 
  left_join(clean_statement_data) %>% 
  mutate(
    procedure_identifier = session,
    within_identifier = 1,
    between_identifier = 1,
    subject = id,
    repeated = statement_type,
    response = responses,
    rt = rts,
    trial = NA,
    certainty = confidence
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, certainty, trial) %>%
  filter(!is.na(subject))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))
