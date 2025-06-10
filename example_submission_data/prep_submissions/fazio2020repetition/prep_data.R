library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/sortedby_norms_osf.csv")) 

test_data <- data %>% 
  select(Subject, Cond, num_correct, starts_with("repeated"))

clean_data <- data %>% 
  select(Subject, Cond, Age, matches("^[tQ]\\d+")) %>% 
  pivot_longer(
    cols = -c(Subject, Cond, Age),
    names_to = "type",
    values_to = "rating"
  ) %>%
  mutate(
    rating_type = str_extract(type, "^[tQ]"),
    number = str_extract(type, "\\d+")
  ) %>%
  pivot_wider(
    id_cols = c(Subject, Cond, Age, number),
    names_from = rating_type,
    values_from = rating
  ) %>% 
  mutate(
    subject = Subject,
    presentation_identifier = 1,
    statement_identifier = number,
    trial = NA,
    rt = NA,
    number = as.numeric(number),
    within_identifier = 1,
    response = t
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
