library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/Lorenzonietal_data.csv")) 
statements <- data.table::fread(paste0(script_dir, "./data/sentences.csv")) 

statement_data <- statements %>% 
  mutate(
    statement_identifier = Item,
    statement_text = paste0(`Italian sentence`, "/", `English translation`),
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  filter(Task == "truth-judgment") %>% 
  left_join(statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = Accent,
    between_identifier = 1,
    subject = Participant,
    repeated = ifelse(Repetition == "Repeated", 1, 0),
    response = ifelse(Rating == "NaN", NA, Rating),
    rt = NA,
    trial = Order,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))
