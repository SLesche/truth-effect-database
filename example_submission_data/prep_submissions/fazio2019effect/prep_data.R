library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/IT_kid_final.csv"))

# For cond == 1, first half of statements was repeated
# For cond == 2
clean_data <- data %>% 
  select(subject, agegroup, cond, matches("[SCT]\\d+")) %>% 
  pivot_longer(
    cols = -c(subject, agegroup, cond),
    names_to = "type",
    values_to = "rating"
  ) %>%
  mutate(
    rating_type = str_extract(type, "^[SCT]"),
    number = str_extract(type, "\\d+")
  ) %>%
  pivot_wider(
    id_cols = c(subject, agegroup, cond, number),
    names_from = rating_type,
    values_from = rating
  ) %>% 
  mutate(
    repeated = ifelse(as.numeric(number) > 24, 1, 0)
  ) %>% 
  mutate(
    procedure_identifier = 1,
    statement_identifier = NA,
    trial = NA,
    rt = NA,
    number = as.numeric(number),
    # repeated = ifelse(C == 1, 0, 1),
    within_identifier = 1,
    between_identifier = agegroup,
    response = `T`,
    certainty = S,
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
