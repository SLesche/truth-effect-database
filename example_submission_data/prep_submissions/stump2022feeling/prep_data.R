library(tidyverse)
library(haven)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- haven::read_sav(paste0(script_dir, "./data/TruthData_Experiment1.sav")) 

statement_data <- data %>%
  distinct(ItemID, statement, StatementType) %>%
  mutate(
    statement_identifier = ItemID,
    statement_text = statement,
    statement_accuracy = StatementType
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = Session,
    within_identifier = Valence,
    between_identifier = 1,
    subject = Subject,
    repeated = Fluency,
    response = TruthRating,
    rt = TruthRating.RT / 1000,
    trial = NA,
    certainty = Confidence.RESP
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, certainty, trial) %>% 
  filter(!is.na(subject)) %>% 
  filter(!subject %in% c(13, 70, 101, 118, 119, 36, 51, 57, 59, 6, 85, 89))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

## Data 2 ----
data2 <- data.table::fread(paste0(script_dir, "./data/TruthData_Experiment2.csv")) 

statement_data <- data2 %>%
  distinct(ItemID, factual_truth) %>%
  mutate(
    statement_identifier = ItemID,
    statement_text = NA,
    statement_accuracy = factual_truth
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))

clean_data <- data2 %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = session,
    within_identifier = 1,
    between_identifier = condition,
    subject = id,
    repeated = fluency,
    response = responses,
    rt = rts / 1000,
    trial = NA,
    certainty = confidence
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, certainty, trial) %>% 
  filter(!is.na(subject)) %>% 
  filter(!subject %in% c(63, 22, 38, 7, 29, 45, 46, 48, 65, 77, 35))

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))
