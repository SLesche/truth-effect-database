library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/TEHT01.csv")) 

statement_data <- data %>% 
  filter(Task == "TRating", is.na(Filter)) %>%
  select(Statement,
         Status) %>% 
  distinct() %>% 
  filter(!is.na(Status)) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = Statement,
    statement_accuracy = ifelse(Status, 1, 0),
    Statement = str_replace_all(Statement, "[^a-zA-Z]", "")
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  mutate(
    Statement = str_replace_all(Statement, "[^a-zA-Z]", "")
  ) %>% 
  filter(Task == "TRating", is.na(Filter)) %>% 
  left_join(statement_data) %>% 
  janitor::clean_names() %>% 
  mutate(
    presentation_identifier = old_ratio,
    within_identifier = 1,
    between_identifier = 1,
    response = t_rating,
    rt = t_rating_rt / 1000,
    repeated = ifelse(repetition == "yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))


## Exp2 ----

data <- data.table::fread(paste0(script_dir, "./data/TEHT02.csv")) 

clean_data <- data %>% 
  mutate(
    Statement = str_replace_all(Statement, "[^a-zA-Z]", "")
  ) %>% 
  mutate(
    Statement = str_replace(Statement, "Lngengrade", "Lngenkreise")
  ) %>% 
  filter(Task == "TRating", is.na(Filter)) %>% 
  left_join(statement_data) %>% 
  janitor::clean_names() %>% 
  mutate(
    presentation_identifier = 1,
    within_identifier = 1,
    between_identifier = 1,
    response = t_rating,
    rt = t_rating_rt / 1000,
    repeated = ifelse(repetition == "yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))

## Exp3 ----

data <- data.table::fread(paste0(script_dir, "./data/TEHT03.csv")) 

statement_data <- data %>% 
  filter(!is.na(TJudgment), is.na(Filter), StatementType == "Target") %>% 
  select(Statement,
         Status) %>% 
  distinct() %>% 
  filter(!is.na(Status)) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = Statement,
    statement_accuracy = ifelse(Status, 1, 0),
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_3.csv"))

clean_data <- data %>% 
  filter(!is.na(TJudgment), is.na(Filter), StatementType == "Target") %>% 
  filter(ExternalHelp == "no", Compliance == "yes") %>% 
  left_join(statement_data) %>% 
  mutate(
    presentation_identifier = 1,
    subject = Subject,
    within_identifier = 1,
    between_identifier = 1,
    response = ifelse(TJudgment == 1, 1, 0),
    rt = NA,
    trial = NA,
    repeated = ifelse(Repetition == "repeated", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))

