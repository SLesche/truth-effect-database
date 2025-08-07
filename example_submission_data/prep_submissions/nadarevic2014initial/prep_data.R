library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/nada2014_exp1.csv")) 

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

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = runningtrial,
    within_identifier = 1,
    between_identifier = 1,
    response = trating,
    rt = trating.rt / 1000,
    repeated = case_when(
      phase == 1 ~ 0,
      phase == 2 & repeated_phase2 == "Yes" ~ 1,
      phase == 2 & repeated_phase2 == "No" ~ 0,
      phase == 3 & repeated_phase3 == "Yes" ~ 1,
      phase == 3 & repeated_phase3 == "No" ~ 0,
    )
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))


## Exp2 ----

data <- data.table::fread(paste0(script_dir, "./data/nada2014_exp2.csv")) 

clean_data <- data %>% 
  left_join(statement_data) %>% 
  filter(runningtrial == "TruthRating") %>%
  filter(phase == 2) %>% 
  mutate(
    procedure_identifier = group_description,
    within_identifier = 1,
    between_identifier = 1,
    response = trating,
    rt = trating.rt / 1000,
    repeated = ifelse(repetition == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))
