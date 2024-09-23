# Library
library(dplyr)
library(purrr)
library(tidyr)

maximum_normalize <- function(vector){
  min_value = min(vector, na.rm = TRUE)
  vector = vector - min_value
  
  max_value = max(vector, na.rm = TRUE)
  
  normalized_vec = vector / max_value
  
  return(normalized_vec)
}

path <- "example_submission_data/jalbert_2020_only/raw_data/"
# Reading data
data_exp_1 <- read.csv(paste0(path, "Experiment-1-all-participants-data.csv"))
data_exp_2 <- read.csv(paste0(path, "Experiment-2-all-participants-data.csv"))
data_exp_3 <- read.csv(paste0(path, "Experiment-3-all-participants-data.csv"))

data_exp_1_clean <- data_exp_1 %>% 
  filter(participants_to_exclude == 1) %>% 
  select(sona_ID, warning_or_no_warning, Truth_Effect_CB, matches("^A\\d+(_[TF])$")) %>% 
  mutate(
    percent_missing = rowSums(is.na(select(., matches("^A\\d+(_[TF])$")))) / 
      length(grep("^A\\d+(_[TF])$", names(.))) * 100
  ) %>% 
  filter(percent_missing < 99) %>% 
  mutate(subject = row_number()) %>% 
  select(-percent_missing, -sona_ID) %>% 
  pivot_longer(
    cols = matches("^A\\d+(_[TF])$"), 
    names_to = "measurement", 
    values_to = "truth_rating"
  ) %>% 
  separate(
    measurement,
    c("statement", "accuracy")
  ) %>% 
  mutate(
    statement_identifier = as.numeric(stringr::str_extract(statement, "\\d+$"))
  ) %>% 
  mutate(
    repeated = ifelse((Truth_Effect_CB == 1 & statement_identifier < 37) | (Truth_Effect_CB == 2 & statement_identifier > 36), 1, 0),
    accuracy = ifelse(accuracy == "T", 1, 0),
    truth_rating = 7 - truth_rating
  ) %>% 
  mutate(
    truth_rating = maximum_normalize(truth_rating)
  ) %>% 
  mutate(
    session = paste0("warning_", warning_or_no_warning),
    within_identifier = 1,
    between_identifier = 1
  ) %>% 
  group_by(subject) %>% 
  mutate(trial = row_number()) %>% 
  ungroup() %>% 
  mutate(
    rt = 99,
    certainty = 99,
    response = truth_rating
  ) %>% 
  select(
    subject,
    session,
    within_identifier,
    between_identifier,
    trial,
    statement_identifier,
    rt,
    response,
    repeated,
    certainty
  )

# Data 2 -----
data_exp_2_clean <- data_exp_2 %>% 
  filter(participants_to_exclude == 0) %>% 
  select(V1, warning_condition, Truth_Effect_CB, matches("^A\\d+(_[TF])$")) %>% 
  mutate(
    percent_missing = rowSums(is.na(select(., matches("^A\\d+(_[TF])$")))) / 
      length(grep("^A\\d+(_[TF])$", names(.))) * 100
  ) %>% 
  filter(percent_missing < 99) %>% 
  mutate(subject = row_number()) %>% 
  select(-percent_missing, -V1) %>% 
  pivot_longer(
    cols = matches("^A\\d+(_[TF])$"), 
    names_to = "measurement", 
    values_to = "truth_rating"
  ) %>% 
  separate(
    measurement,
    c("statement", "accuracy")
  ) %>% 
  mutate(
    statement_identifier = as.numeric(stringr::str_extract(statement, "\\d+$"))
  ) %>% 
  mutate(
    repeated = ifelse((Truth_Effect_CB == 1 & statement_identifier < 37) | (Truth_Effect_CB == 2 & statement_identifier > 36), 1, 0),
    accuracy = ifelse(accuracy == "T", 1, 0),
    truth_rating = 7 - truth_rating
  ) %>% 
  mutate(
    truth_rating = maximum_normalize(truth_rating)
  ) %>% 
  mutate(
    session = paste0("warning_", warning_condition),
    within_identifier = 1,
    between_identifier = 1
  ) %>% 
  group_by(subject) %>% 
  mutate(trial = row_number()) %>% 
  ungroup() %>% 
  mutate(
    rt = 99,
    certainty = 99,
    response = truth_rating
  ) %>% 
  select(
    subject,
    trial,
    session,
    statement_identifier,
    within_identifier,
    rt,
    response,
    repeated,
    certainty
  )

# Data 3 ---------
data_exp_3_clean <- data_exp_3 %>% 
  filter(participants_to_exclude == 0) %>% 
  select(V1, warning, some_or_half_warning, Truth_Effect_CB, matches("^A\\d+(_[TF])$")) %>% 
  mutate(
    percent_missing = rowSums(is.na(select(., matches("^A\\d+(_[TF])$")))) / 
      length(grep("^A\\d+(_[TF])$", names(.))) * 100
  ) %>% 
  filter(percent_missing < 99) %>% 
  mutate(subject = row_number()) %>% 
  select(-percent_missing, -V1) %>% 
  pivot_longer(
    cols = matches("^A\\d+(_[TF])$"), 
    names_to = "measurement", 
    values_to = "truth_rating"
  ) %>% 
  separate(
    measurement,
    c("statement", "accuracy")
  ) %>% 
  mutate(
    statement_identifier = as.numeric(stringr::str_extract(statement, "\\d+$"))
  ) %>% 
  mutate(
    repeated = ifelse((Truth_Effect_CB == 1 & statement_identifier < 37) | (Truth_Effect_CB == 2 & statement_identifier > 36), 1, 0),
    accuracy = ifelse(accuracy == "T", 1, 0),
    truth_rating = 7 - truth_rating
  ) %>% 
  mutate(
    truth_rating = maximum_normalize(truth_rating)
  ) %>% 
  mutate(
    session = paste0(some_or_half_warning, "_", warning),
    between_identifier = 1,
    within_identifier = 1,
  ) %>% 
  group_by(subject) %>% 
  mutate(trial = row_number()) %>% 
  ungroup() %>% 
  mutate(
    rt = 99,
    certainty = 99,
    response = truth_rating
  ) %>% 
  select(
    subject,
    trial,
    session,
    between_identifier,
    within_identifier,
    statement_identifier,
    rt,
    response,
    repeated,
    certainty
  )

write.csv(data_exp_1_clean, file = "example_submission_data/jalbert_2020_only/submission_data/raw_data_1.csv")
write.csv(data_exp_2_clean, file = "example_submission_data/jalbert_2020_only/submission_data/raw_data_2.csv")
write.csv(data_exp_3_clean, file = "example_submission_data/jalbert_2020_only/submission_data/raw_data_3.csv")
