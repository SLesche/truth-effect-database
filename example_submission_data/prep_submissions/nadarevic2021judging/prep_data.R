library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/Data Experiment 1.csv"), encoding = "Latin-1")

statement_data <- data %>% 
  select(Statement,
         Status) %>% 
  distinct() %>% 
  filter(!is.na(Status)) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = Statement,
    statement_accuracy = ifelse(Status, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    presentation_identifier = paste0(GroupDescription, Phase),
    within_identifier = 1,
    between_identifier = 1,
    response = ifelse(TruthJudgment, 1, 0),
    rt = TruthJudgment.RT/1000,
    trial = Trial,
    repeated = ifelse(Repetition == "Yes", 1, 0)
  ) %>% 
  select(subject = Subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

## Exp 2 ----

data <- data.table::fread(paste0(script_dir, "./data/Data Experiment 2.csv"), encoding = "Latin-1")

statement_data <- data %>% 
  select(Statement,
         Status) %>% 
  distinct() %>% 
  filter(!is.na(Status)) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = Statement,
    statement_accuracy = ifelse(Status, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    presentation_identifier = paste0(GroupDescription, Phase),
    within_identifier = Difficulty,
    between_identifier = 1,
    response = ifelse(TruthJudgment, 1, 0),
    rt = TruthJudgment.RT/1000,
    trial = Trial,
    repeated = ifelse(Repetition == "Yes", 1, 0)
  ) %>% 
  select(subject = Subject, ends_with("identifier"), response, repeated, rt, trial) %>% 
  filter(!is.na(statement_identifier))


write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))

## Exp 3 ----

data <- data.table::fread(paste0(script_dir, "./data/Data Experiment 3.csv"), encoding = "Latin-1")

statement_data <- data %>% 
  filter(Phase %in% c("Test1", "Test2"), Repetition %in% c("yes", "no")) %>% 
  mutate(
    Statement = paste0(Statement1, "/", Statement2)
  ) %>% 
  select(Statement,
         Status) %>% 
  distinct() %>% 
  filter(!is.na(Status)) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = Statement,
    statement_accuracy = ifelse(Status, 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_3.csv"))

clean_data <- data %>% 
  mutate(
    Statement = paste0(Statement1, "/", Statement2)
  ) %>%
  left_join(statement_data) %>% 
  filter(Phase %in% c("Test1", "Test2"), Repetition %in% c("yes", "no")) %>% 
  mutate(
    presentation_identifier = paste0(GroupDescription, Phase),
    within_identifier = Difficulty,
    between_identifier = 1,
    response = ifelse(TruthJudgment, 1, 0),
    rt = TruthJudgment.RT/1000,
    trial = Trial,
    repeated = ifelse(Repetition == "yes", 1, 0)
  ) %>% 
  select(subject = Subject, ends_with("identifier"), response, repeated, rt, trial)


write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))
