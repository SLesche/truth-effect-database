library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/data_E1.csv"))

clean_data <- data %>% 
  select(Condition, ends_with("_BR")) %>% 
  mutate(subject = row_number()) %>% 
  pivot_longer(
    cols = -c(Condition, subject),
    names_to = "type",
    values_to = "rating"
  ) %>% 
  mutate(
    repeated = ifelse(Condition == "NE", 0, 1)
  ) %>% 
  mutate(
    procedure_identifier = 1,
    statement_identifier = type,
    trial = NA,
    rt = NA,
    within_identifier = ifelse(str_detect(type, "^M"), "myth", "fact"),
    between_identifier = Condition,
    response = rating,
  )

statement_data <- clean_data %>% 
  distinct(type) %>% 
  mutate(
    statement_identifier = type,
    statement_text = NA,
    statement_accuracy = ifelse(str_detect(type, "^M"), 0, 1)
  )
write.csv(statement_data, paste0(script_dir, "./data/statement_data.csv"))

clean_data <- clean_data %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

### Exp 2 ----
data <- data.table::fread(paste0(script_dir, "./data/data_E2.csv"))

clean_data <- data %>% 
  select(Condition, ends_with("_BR")) %>% 
  mutate(subject = row_number()) %>% 
  pivot_longer(
    cols = -c(Condition, subject),
    names_to = "type",
    values_to = "rating"
  ) %>% 
  mutate(
    repeated = ifelse(Condition == "NE", 0, 1)
  ) %>% 
  mutate(
    presentation_identifier = ifelse(str_detect(Condition, "D$"), "delayed", "immediate"),
    trial = NA,
    rt = NA,
    statement_identifier = type,
    within_identifier = ifelse(str_detect(type, "^M"), "myth", "fact"),
    between_identifier = str_remove(Condition, "D|I$"),
    response = rating,
  ) %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))

### Exp 3 ----
data <- data.table::fread(paste0(script_dir, "./data/data_E3.csv"))

clean_data <- data %>% 
  select(Cond, ends_with("_BR")) %>% 
  mutate(subject = row_number()) %>% 
  pivot_longer(
    cols = -c(Cond, subject),
    names_to = "type",
    values_to = "rating"
  ) %>% 
  mutate(
    repeated = ifelse(Cond == "NE", 0, 1)
  ) %>% 
  mutate(
    presentation_identifier = 1,
    trial = NA,
    rt = NA,
    within_identifier = ifelse(str_detect(type, "^M"), "myth", "fact"),
    between_identifier = Cond,
    response = rating,
    statement_identifier = type,
  ) %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))


