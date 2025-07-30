library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- readxl::read_excel(paste0(script_dir, "./data/Lyetal_Experiment1 Data.xlsx"))

statement_data <- data %>% 
  select(statement,
         obj_truth) %>% 
  distinct() %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = statement,
    statement_accuracy = ifelse(obj_truth == "t", 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    subject = n_ppt,
    presentation_identifier = ifelse(cond_delay == 1, "nodelay", "delay"),
    trial = NA,
    within_identifier = 1,
    between_identifier = 1,
    response = ifelse(truth_response == "VRAI", 1, 0),
    repeated = ifelse(repetition == "rep", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data.csv"))
