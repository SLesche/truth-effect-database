library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- readxl::read_excel(paste0(script_dir, "./data/specificity_EXP1.xlsx")) 

# statement_data <- data %>% 
#   select(statement,
#          status) %>% 
#   distinct() %>% 
#   filter(!is.na(status)) %>% 
#   mutate(
#     statement_identifier = row_number(),
#     statement_text = statement,
#     statement_accuracy = ifelse(status, 1, 0)
#   )
# 
# write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))
contrast <- data %>% 
  filter(JUDGMENT == "truth") %>% 
  select(CASE, IV03_01, IV03_02) %>% 
  mutate(
    number_pre = str_remove(str_remove(str_replace_all(IV03_01, "pre", ","), "^,"), "instr2$"),
    number_post = str_remove(str_remove(str_replace_all(IV03_02, "post", ","), "^,"), "instrdemo$")
  ) %>% 
  mutate(
    number_total = number_post
  ) %>% 
  select(CASE, number_total) %>%
  separate_rows(
    number_total,
    sep = ","
  ) %>% 
  select(subject = CASE, number_total)
  
# Demo data
data %>% 
  filter(JUDGMENT == "truth") %>%
  summarize(mean_age = mean(SD02_01), n = n(), percent_female = sum(SD01 == 2) / n())

clean_data <- data %>% 
  select(CASE, JUDGMENT, starts_with("FR")) %>% 
  filter(JUDGMENT == "truth") %>% 
  pivot_longer(
    cols = -c(CASE, JUDGMENT),
    names_to = "item",
    values_to = "response"
  ) %>% 
  mutate(
    item_nr = as.numeric(str_extract(item, "\\d{2}"))
  ) %>% 
  mutate(
    subject = CASE,
    statement_identifier = NA,
    procedure_identifier = 1,
    within_identifier = 1,
    between_identifier = 1,
    repeated = ifelse(item_nr > 28, 0, 1),
    trial = NA
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial) 

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

## Pilot ----

data <- readxl::read_excel(paste0(script_dir, "./data/specificity_pilot.xlsx")) 

# statement_data <- data %>% 
#   select(statement,
#          status) %>% 
#   distinct() %>% 
#   filter(!is.na(status)) %>% 
#   mutate(
#     statement_identifier = row_number(),
#     statement_text = statement,
#     statement_accuracy = ifelse(status, 1, 0)
#   )
# 
# write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))
data %>% 
  filter(IV02_01 == "truth") %>%
  summarize(mean_age = mean(SD02_01), n = n(), percent_female = sum(SD01 == 2) / n())

clean_data <- data %>% 
  select(CASE, IV02_01, starts_with("FR")) %>% 
  filter(IV02_01 == "truth") %>% 
  pivot_longer(
    cols = -c(CASE, IV02_01),
    names_to = "item",
    values_to = "response"
  ) %>% 
  mutate(
    item_nr = as.numeric(str_extract(item, "\\d{2}"))
  ) %>% 
  mutate(
    subject = CASE,
    procedure_identifier = 1,
    statement_identifier = NA,
    within_identifier = 1,
    between_identifier = 1,
    repeated = ifelse(item_nr > 28, 0, 1),
    trial = NA
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial) 

write.csv(clean_data, paste0(script_dir, "./data/clean_data_0.csv"))

## Exp2 ----
data <- readxl::read_excel(paste0(script_dir, "./data/specificity_EXP2.xlsx")) 

# statement_data <- data %>% 
#   select(statement,
#          status) %>% 
#   distinct() %>% 
#   filter(!is.na(status)) %>% 
#   mutate(
#     statement_identifier = row_number(),
#     statement_text = statement,
#     statement_accuracy = ifelse(status, 1, 0)
#   )
# 
# write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))


clean_data <- data %>% 
  select(CASE, starts_with("FR")) %>% 
  pivot_longer(
    cols = -c(CASE),
    names_to = "item",
    values_to = "response"
  ) %>% 
  mutate(
    item_nr = as.numeric(str_extract(item, "\\d{2}"))
  ) %>% 
  mutate(
    subject = CASE,
    procedure_identifier = 1,
    statement_identifier = NA,
    within_identifier = 1,
    between_identifier = 1,
    repeated = ifelse(item_nr > 28, 0, 1),
    trial = NA
  ) %>% 
  filter(!is.na(response)) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial) 

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))
