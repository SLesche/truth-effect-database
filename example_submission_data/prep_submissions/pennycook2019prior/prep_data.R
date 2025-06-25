library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/Pennycook et al._FakeNews_E1.csv"))

clean_data <- data %>% 
  select(Condition, ends_with("_2")) %>% 
  select(-PANAS_2) %>% 
  mutate(subject = row_number()) %>% 
  pivot_longer(
    cols = -c(Condition, subject),
    names_to = "item",
    values_to = "response"
  ) %>% 
  mutate(
    within_identifier = str_extract(item, "^[A-Za-z]+")
  ) %>% 
  mutate(
    statement_identifier = item,
    statement_text = NA,
    statement_accuracy = case_when(
      within_identifier == "True" ~ 1,
      within_identifier == "False" ~ 0,
      within_identifier == "Imp" ~ 0,
      within_identifier == "Plau" ~ 1
    ),
    statement_number = as.numeric(str_extract(item, "\\d"))
  ) %>% 
  mutate(
    presentation_identifier = 1,
    trial = NA,
    between_identifier = 1,
    repeated = case_when(
      Condition == 1 & within_identifier %in% c("Imp", "Plau") & statement_number < 3 ~ 1,
      Condition == 1 & within_identifier %in% c("Imp", "Plau") & statement_number > 2 ~ 0,
      Condition == 1 & within_identifier %in% c("True", "False") & statement_number < 6 ~ 1,
      Condition == 1 & within_identifier %in% c("True", "False") & statement_number > 5 ~ 0,
      Condition == 2 & within_identifier %in% c("Imp", "Plau") & statement_number < 3 ~ 0,
      Condition == 2 & within_identifier %in% c("Imp", "Plau") & statement_number > 2 ~ 1,
      Condition == 2 & within_identifier %in% c("True", "False") & statement_number < 6 ~ 0,
      Condition == 2 & within_identifier %in% c("True", "False") & statement_number > 5 ~ 1,
    )
  ) %>% 
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

statement_data <- clean_data %>% 
  select(contains("statement")) %>% 
  distinct()

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

## Exp2----
data <- data.table::fread(paste0(script_dir, "./data/Pennycook et al._FakeNews_E2.csv"))

clean_data <- data %>% 
  select(Warning, Counterbalance, ends_with("_2")) %>% 
  mutate(subject = row_number()) %>% 
  pivot_longer(
    cols = -c(Counterbalance, subject, Warning),
    names_to = "item",
    values_to = "response"
  ) %>% 
  mutate(
    statement_identifier = str_extract(item, "^[A-Z][a-z]+\\d+"),
    statement_text = NA,
    statement_accuracy = case_when(
      str_extract(item, "^[A-Z][a-z]+") == "Real" ~ 1,
      str_extract(item, "^[A-Z][a-z]+") == "Fake" ~ 0,
    ),
    statement_number = as.numeric(str_extract(item, "\\d+")),
    type = ifelse(str_detect(item, "RT"), "rt", "rating")
  ) %>% 
  filter(type != "rt") %>% 
  mutate(
    presentation_identifier = Warning,
    trial = NA,
    between_identifier = 1,
    repeated = case_when(
      Counterbalance == 1 & statement_number < 7 ~ 1,
      Counterbalance == 1 & statement_number > 6 ~ 0,
      Counterbalance == 2 & statement_number < 7 ~ 0,
      Counterbalance == 2 & statement_number > 6 ~ 1,
    )
  ) %>% 
  # filter(!is.na(response)) %>% 
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, trial)


write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))

statement_data <- clean_data %>% 
  select(contains("statement")) %>% 
  distinct()

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))


## Exp3----
session1_data <- data.table::fread(paste0(script_dir, "./data/Pennycook et al._FakeNews_E3 Session1.csv"))
session2_data <- data.table::fread(paste0(script_dir, "./data/Pennycook et al._FakeNews_E3 Session2.csv"))

clean_session1_data <-  session1_data %>% 
  select(Warning, Condition, matches("(Real|Fake)\\d+_2$")) %>% 
  mutate(subject = row_number()) %>% 
  pivot_longer(
    cols = -c(Condition, subject, Warning),
    names_to = "item",
    values_to = "response"
  ) %>% 
  mutate(
    statement_identifier = str_extract(item, "^[A-Z][a-z]+\\d+"),
    statement_text = NA,
    statement_accuracy = case_when(
      str_extract(item, "^[A-Z][a-z]+") == "Real" ~ 1,
      str_extract(item, "^[A-Z][a-z]+") == "Fake" ~ 0,
    ),
    statement_number = as.numeric(str_extract(item, "\\d+")),
  ) %>% 
  mutate(
    presentation_identifier = paste0(Warning, "_session_", 1),
    trial = NA,
    between_identifier = 1,
    repeated = case_when(
      Condition %in% c(1, 2, 7, 8) & statement_number %in% c(1:4) ~ 1,
      Condition %in% c(3, 4, 9, 10) & statement_number %in% c(5:8) ~ 1,
      Condition %in% c(5, 6, 11, 12) & statement_number %in% c(9:12) ~ 1,
      Condition %in% c(3, 5, 9, 11) & statement_number %in% c(1:4) ~ 0,
      Condition %in% c(1, 6, 7, 12) & statement_number %in% c(5:8) ~ 0,
      Condition %in% c(2, 4, 8, 10) & statement_number %in% c(9:12) ~ 0,
      TRUE ~ NA
    )
  ) %>% 
  filter(!is.na(repeated)) %>%
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, trial)

clean_session2_data <- session2_data %>%
  filter(!is.na(Condition)) %>% 
  select(Warning, Condition, matches("(Real|Fake)\\d+_2$")) %>% 
  mutate(subject = row_number()) %>% 
  pivot_longer(
    cols = -c(Condition, subject, Warning),
    names_to = "item",
    values_to = "response"
  ) %>% 
  mutate(
    statement_identifier = str_extract(item, "^[A-Z][a-z]+\\d+"),
    statement_text = NA,
    statement_accuracy = case_when(
      str_extract(item, "^[A-Z][a-z]+") == "Real" ~ 1,
      str_extract(item, "^[A-Z][a-z]+") == "Fake" ~ 0,
    ),
    statement_number = as.numeric(str_extract(item, "\\d+")),
  ) %>% 
  mutate(
    presentation_identifier = paste0(Warning, "_session_", 2),
    trial = NA,
    between_identifier = 1,
    repeated = case_when(
      Condition %in% c(1, 2, 7, 8) & statement_number %in% c(1:4) ~ 1,
      Condition %in% c(3, 4, 9, 10) & statement_number %in% c(5:8) ~ 1,
      Condition %in% c(5, 6, 11, 12) & statement_number %in% c(9:12) ~ 1,
      Condition %in% c(3, 5, 9, 11) & statement_number %in% c(1:4) ~ 1,
      Condition %in% c(1, 6, 7, 12) & statement_number %in% c(5:8) ~ 1,
      Condition %in% c(2, 4, 8, 10) & statement_number %in% c(9:12) ~ 1,
      TRUE ~ 0
    )
  ) %>% 
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, trial)

clean_data <- rbind(clean_session1_data, clean_session2_data)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))

statement_data <- clean_data %>% 
  select(contains("statement")) %>% 
  distinct()

write.csv(statement_data, paste0(script_dir, "./data/statement_data_3.csv"))


## Exp4----
# Not real EXP