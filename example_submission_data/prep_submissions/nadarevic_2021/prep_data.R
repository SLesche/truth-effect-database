library(tidyverse)
library(readxl)

raw_statements <- read_excel("./example_submission_data/prep_submissions/nadarevic_2021/statements_raw_exp3.xlsx")

raw_data <- read.csv("./example_submission_data/prep_submissions/nadarevic_2021/data_raw_exp3.csv", fileEncoding = "latin1")

clean_statements <- raw_statements %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = paste0(trimws(`Statement 1 (Exposure Phase)`), "/", trimws(`Statement 2 (Testphase)`)),
    statement_accuracy = ifelse(Status == "true", 1, 0),
    proportion_true = `"true" Responses`
  ) %>% 
  mutate(
    statement_text = tolower(str_remove_all(statement_text, "\""))
  ) %>% 
  select(
    statement_identifier,
    statement_text,
    statement_accuracy,
    proportion_true
  ) %>% 
  filter(statement_identifier <= 72)

clean_data <- raw_data %>% 
  filter(Phase %in% c("Test1", "Test2")) %>% 
  mutate(within_identifier = ifelse(Difficulty == "easy", 1, 2)) %>% 
  filter(ItemType == "Testitem") %>%
  mutate(presentation_identifier = case_when(
    Phase == "Exposure" ~ 1,
    GroupDescription == "NoPressure" & str_detect(Phase, "Test") ~ 2,
    GroupDescription == "TimePressure" & str_detect(Phase, "Test") ~ 3,
  )) %>% 
  group_by(Subject) %>% 
  mutate(
    trial = dense_rank(Trial)
  ) %>% 
  ungroup() %>% 
  mutate(
    repeated = case_when(
      Repetition == "yes" ~ 1,
      Repetition == "no" ~ 0,
      Repetition == "contra" ~ -1
    ),
    response = TruthJudgment,
    rt = TruthJudgment.RT / 1000,
    subject = Subject
  ) %>% 
  mutate(
    Statement1 = ifelse(is.na(Statement1), "---", Statement1)
  ) %>% 
  mutate(statement_text = tolower(paste0(trimws(Statement1), "/", trimws(Statement2)))) %>% 
  left_join(clean_statements) %>% 
  select(
    subject, presentation_identifier,
    trial, within_identifier,
    rt, response, repeated,
    statement_identifier
  ) %>%
  ungroup()
  
write.csv(clean_statements, "./example_submission_data/prep_submissions/nadarevic_2021/clean_statements_exp3.csv")
write.csv(clean_data, "./example_submission_data/prep_submissions/nadarevic_2021/clean_data_exp3.csv")


# ----

raw_statements <- read_excel("./example_submission_data/prep_submissions/nadarevic_2021/statements_raw_exp2.xlsx")

raw_data <- read.csv("./example_submission_data/prep_submissions/nadarevic_2021/data_raw_exp2.csv", fileEncoding = "latin1")

clean_statements <- raw_statements %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = trimws(Statement),
    statement_accuracy = ifelse(Status == "true", 1, 0),
    proportion_true = `"true" Responses`
  ) %>% 
  mutate(
    statement_text = tolower(str_remove_all(statement_text, "\""))
  ) %>%
  select(
    statement_identifier,
    statement_text,
    statement_accuracy,
    proportion_true
  ) 

clean_data <- raw_data %>% 
  filter(Phase %in% c("Test")) %>% 
  mutate(within_identifier = ifelse(Difficulty == "easy", 1, 2)) %>% 
  # filter(ItemType == "Testitem") %>%
  mutate(presentation_identifier = case_when(
    Phase == "Exposure" ~ 1,
    GroupDescription == "NoPressure" & str_detect(Phase, "Test") ~ 2,
    GroupDescription == "TimePressure" & str_detect(Phase, "Test") ~ 3,
  )) %>% 
  group_by(Subject) %>% 
  mutate(
    trial = dense_rank(Trial)
  ) %>% 
  ungroup() %>% 
  mutate(
    repeated = case_when(
      Repetition == "yes" ~ 1,
      Repetition == "no" ~ 0,
      Repetition == "contra" ~ -1
    ),
    response = TruthJudgment,
    rt = TruthJudgment.RT / 1000,
    subject = Subject
  ) %>% 
  # mutate(
  #   Statement1 = ifelse(is.na(Statement1), "---", Statement1)
  # ) %>% 
  mutate(statement_text = tolower(trimws(Statement))) %>% 
  left_join(clean_statements) %>% 
  select(
    subject, presentation_identifier,
    trial, within_identifier,
    rt, response, repeated,
    statement_identifier
  ) %>%
  ungroup()

write.csv(clean_statements, "./example_submission_data/prep_submissions/nadarevic_2021/clean_statements_exp2.csv")
write.csv(clean_data, "./example_submission_data/prep_submissions/nadarevic_2021/clean_data_exp2.csv")
