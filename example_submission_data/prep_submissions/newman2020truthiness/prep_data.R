library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- readxl::read_excel(paste0(script_dir, "./data/Exp 4 Truth effect and NFC full score data table.xlsx")) 

statement_data <- readxl::read_excel(
  paste0(script_dir, "./data/Trivia Claim Used for Exp 3+4 Truth Effect - Supplemental Materials.xlsx"),
  sheet = "statements"
  ) %>% 
  janitor::clean_names() %>% 
  mutate(
    statement_identifier = label_in_spss_files,
    statement_category = category,
    statement_text = claim,
    statement_accuracy = ifelse(true_false == "T",1, 0),
    proportion_true = percent_of_people_who_said_true
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data.csv"))

clean_data <- data %>% 
  select(sona_ID, fluency_condition, Truth_Effect_CB, matches("^A\\d+(_[TF])$")) %>% 
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
  mutate(
    statement_identifier = measurement
  ) %>% 
  left_join(statement_data) %>% 
  mutate(
    repeated = ifelse((Truth_Effect_CB == "CB1" & readr::parse_number(statement_identifier) < 37) | (Truth_Effect_CB == "CB2" & readr::parse_number(statement_identifier) > 36), 1, 0),
    truth_rating = 7 - as.numeric(truth_rating),
  ) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = fluency_condition
  ) %>% 
  mutate(
    trial = NA,
    rt = NA,
    response = truth_rating
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data.csv"))
