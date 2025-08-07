library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/Data PKTE.csv")) %>% 
  filter(runningtrial == "TruthJudgment")

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

write.csv(statement_data, paste0(script_dir, "./data/statement_data.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = 1,
    response = truthrating,
    rt = NA,
    trial = NA,
    repeated = ifelse(repeated == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))

write.csv(clean_data, paste0(script_dir, "./data/clean_data.csv"))
