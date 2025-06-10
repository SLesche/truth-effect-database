library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/full range.csv"))

clean_data <- data %>% 
  select(Subject, Condition, matches("^[AB][IC]T_\\d+")) %>% 
  pivot_longer(
    cols = -c(Subject, Condition),
    names_to = "type",
    values_to = "rating"
  ) %>%
  mutate(
    rating_type = str_extract(type, "^[A-Z]{3}"),
    number = str_extract(type, "\\d+")
  ) %>%
  mutate(
    set = str_extract(type, "^[AB]"),
    accuracy = ifelse(str_detect(rating_type, "C"), 1, 0)
  ) %>% 
  mutate(
    repeated = case_when(
      Condition == 1 & set == "A" ~ 1,
      Condition == 1 & set == "B" ~ 0,
      Condition == 2 & set == "A" ~ 0,
      Condition == 2 & set == "B" ~ 1,
    )
  ) %>% 
  mutate(
    subject = Subject,
    presentation_identifier = 1,
    statement_identifier = type,
    trial = NA,
    rt = NA,
    number = as.numeric(number),
    within_identifier = 1,
    response = rating
  )

statement_data <- clean_data %>% 
  distinct(statement_identifier, accuracy) %>% 
  mutate(
    statement_text = NA,
    statement_accuracy = accuracy
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data.csv"))

clean_data <- clean_data %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data.csv"))
