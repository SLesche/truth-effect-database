library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- readxl::read_excel(paste0(script_dir, "./data/summed_data_both_sessions_10_2025.xlsx")) 

# statement_data <- data %>% 
#   distinct(statements) %>% 
#   mutate(
#     statement_identifier = row_number(),
#     statement_text = statements,
#     statement_accuracy = NA
#   )
statement_data <- read.csv(paste0(script_dir, "/../stump2024illusory/data/statement_data_1.csv"))

# write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data %>% select(-X)) %>% 
  mutate(
    procedure_identifier = session,
    within_identifier = 1,
    between_identifier = 1,
    subject = id,
    repeated = statement_type,
    response = responses,
    rt = rts,
    trial = NA,
    confidence = confidence
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, confidence, trial) %>% 
  filter(!is.na(subject))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))
