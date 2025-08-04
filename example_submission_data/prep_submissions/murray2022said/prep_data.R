library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- readxl::read_excel(paste0(script_dir, "./data/Trump ITE clean LMER reduced.xlsx")) 

statement_data <- data %>% 
  distinct(item) %>% 
  mutate(
    statement_identifier = item,
    statement_text = NA,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = 1,
    subject = WorkerID,
    repeated = Repeated,
    response = truthRating,
    rt = NA,
    trial = NA,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(subject))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))
