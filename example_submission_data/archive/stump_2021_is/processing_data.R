library(dplyr)

data <- read.csv("example_submission_data/stump_2021_is/data/TruthData_Experiment2.csv")

clean_data <- data %>% 
  mutate(
    subject = id,
    presentation_identifier = session,
    between_identifier = condition,
    repeated = fluency,
    response = responses,
    rt = rts / 1000,
    certainty = confidence,
    statement_identifier = ItemID,
  ) %>% 
  group_by(
    subject, presentation_identifier
  ) %>% 
  mutate(
    trial = row_number()
  ) %>% 
  select(
    subject, presentation_identifier, trial, between_identifier, statement_identifier,
    repeated, rt, response, certainty
  ) %>% 
  ungroup()

write.csv(clean_data, "example_submission_data/stump_2021_is/data/clean_data_exp2.csv")
