library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/3. Data Experiment 1.csv"), encoding = "Latin-1")

statement_data <- readxl::read_excel(paste0(script_dir, "./data/1. Statements Experiment 1.xlsx"))
colnames(statement_data) = c("item_nr", "set", "english_text", "hungarian_text", "status", "difficulty", "accuracy")

statement_data <- statement_data %>% 
  mutate(item_nr = ifelse(english_text == "The Yonghe Temple is in Shanghai.", 30, item_nr)) %>% 
  mutate(
    statement_identifier = paste0(item_nr, set),
    statement_text = paste0(english_text, "/", hungarian_text),
    statement_accuracy = ifelse(status, 1, 0),
    proportion_true = ifelse(status, accuracy / 100, 1 - accuracy / 100)
  ) %>% 
  mutate(
    first_10_english = substr(sapply(str_extract_all(english_text, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 10),
    first_10_hungarian = substr(sapply(str_extract_all(hungarian_text, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 10)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data_english <- data %>% 
  filter(condition == "English") %>% 
  mutate(
    first_10 = substr(sapply(str_extract_all(statement, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 10),
  ) %>% 
  left_join(
    statement_data %>% select(first_10_english, contains("statement"), proportion_true),
    by = join_by("first_10" == "first_10_english")
  )

clean_data_hungarian <- data %>% 
  filter(condition == "Hungarian") %>% 
  mutate(
    first_10 = substr(sapply(str_extract_all(statement, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 10),
  ) %>%   
  left_join(
    statement_data %>% select(first_10_hungarian, contains("statement"), proportion_true),
    by = join_by("first_10" == "first_10_hungarian")
  )

clean_data <- rbind(clean_data_english, clean_data_hungarian) 

clean_data <- clean_data %>% 
  filter(filter == "selected", phase == "TruthRating", nativelanguage == "Hungarian") %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = difficulty,
    between_identifier = condition,
    response = truthrating,
    trial = trial,
    repeated = ifelse(repetition == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

## Exp 2 ----
data <- data.table::fread(paste0(script_dir, "./data/4. Data Experiment 2.csv"), encoding = "Latin-1")

statement_data <- readxl::read_excel(paste0(script_dir, "./data/1. Statements Experiment 2.xlsx"))
colnames(statement_data) = c("item_nr", "set", "german_text", "english_text", "status", "difficulty", "accuracy")

statement_data <- statement_data %>% 
  mutate(
    statement_identifier = paste0(item_nr, set),
    statement_text = paste0(english_text, "/", german_text),
    statement_accuracy = ifelse(status == "True", 1, 0),
    proportion_true = ifelse(status == "True", accuracy, 1 - accuracy)
  ) %>% 
  mutate(
    first_10_english = substr(sapply(str_extract_all(english_text, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 15),
    first_10_german = substr(sapply(str_extract_all(german_text, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 15)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))

clean_data_english <- data %>% 
  filter(condition == "English") %>% 
  mutate(
    first_10 = substr(sapply(str_extract_all(statement, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 15),
  ) %>% 
  left_join(
    statement_data %>% select(first_10_english, contains("statement"), proportion_true),
    by = join_by("first_10" == "first_10_english")
  )

clean_data_german <- data %>% 
  filter(condition == "German") %>% 
  mutate(
    first_10 = substr(sapply(str_extract_all(statement, "[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]"), paste, collapse = ""), 1, 15),
  ) %>%   
  left_join(
    statement_data %>% select(first_10_german, contains("statement"), proportion_true),
    by = join_by("first_10" == "first_10_german")
  )

clean_data <- rbind(clean_data_english, clean_data_german) 

clean_data <- clean_data %>% 
  filter(filter == "selected", set != "Controlitem", phase %in% c("TruthJudgment1", "TruthJudgment2")) %>% 
  mutate(
    procedure_identifier = phase,
    within_identifier = difficulty,
    between_identifier = condition,
    response = ifelse(truthjudgment, 1, 0),
    rt = truthjudgment.rt/1000,
    trial = trial,
    repeated = ifelse(repetition == "yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, rt, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))
