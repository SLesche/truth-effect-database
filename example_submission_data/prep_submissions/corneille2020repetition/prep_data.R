library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/fabr_raw.csv"))

statement_data <- data %>% 
  select(statement_id,
         statements,
         truth) %>% 
  distinct() %>% 
  mutate(
    statement_identifier = statement_id,
    statement_text = statements,
    statement_accuracy = ifelse(truth, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    phase = ifelse(response == "", "exposure", "test")
  )

old_statements <- clean_data %>% 
  filter(phase == "exposure") %>% 
  distinct(componentResultId, statement_id) %>% 
  mutate(
    repeated = 1
  )

clean_data <- clean_data %>% 
  left_join(old_statements) %>% 
  mutate(
    subject = componentResultId,
    presentation_identifier = phase,
    trial = NA,
    within_identifier = 1,
    between_identifier = 1,
    rt = response_time / 1000,
    response = ifelse(response == "y", 1, 0),
    repeated = ifelse(repeated == 1, 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

#### Exp 2 ----

data <- data.table::fread(paste0(script_dir, "./data/data_fakeness.csv"))

statement_data <- data %>% 
  select(statement,
         truth) %>% 
  distinct() %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = statement,
    statement_accuracy = ifelse(truth, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    subject = ppt,
    procedure_identifier = 1,
    trial = pos_judgment_phase,
    within_identifier = 1,
    between_identifier = 1,
    rt = NA,
    response = ifelse(response == "resp_yes", 1, 0),
    repeated = ifelse(repetition == "repeated", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))


#### Exp 3 ----
data <- data.table::fread(paste0(script_dir, "./data/data_truth_vs_falsehood.csv"))

statement_data <- data %>% 
  select(statement,
         truth) %>% 
  distinct() %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = statement,
    statement_accuracy = ifelse(truth, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_3.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    subject = ppt,
    procedure_identifier = 1,
    trial = pos_judgment_phase,
    within_identifier = 1,
    between_identifier = instructions,
    rt = NA,
    response = ifelse(response == "resp_yes", 1, 0),
    repeated = ifelse(repetition == "repeated", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))
