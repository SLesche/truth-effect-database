library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/data_analyses_tbr_highly_implausible.csv")) 

statement_data <- data %>% 
  distinct(statement_test) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = statement_test,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = 1,
    subject = url.srid,
    within_identifier = 1,
    repeated = ifelse(repetition == "new", 0, 1),
    response = slider_truth_response,
    rt = NA,
    trial = count_test_trial,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))
