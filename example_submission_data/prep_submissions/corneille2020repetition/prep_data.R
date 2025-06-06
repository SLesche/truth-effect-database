library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/data_extendexp1.csv"))

statement_data <- data %>% 
  select(enonce,
         enonce_verite) %>% 
  distinct() %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = enonce,
    statement_accuracy = ifelse(enonce_verite == "t", 1, 0)
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data.csv"))

clean_data <- data %>% 
  left_join(statement_data) %>% 
  mutate(
    subject = ppt,
    presentation_identifier = 1,
    trial = NA,
    within_identifier = 1,
    between_identifier = case_when(
      manip_attention == "nd" & manip_cred == "nc" ~ "noatt_nocred",
      manip_attention == "d" & manip_cred == "nc" ~ "att_nocred",
      manip_attention == "nd" & manip_cred == "c" ~ "noatt_cred",
      manip_attention == "d" & manip_cred == "c" ~ "att_cred",
      
    ),
    rt = truth_time / 1000,
    response = ifelse(truth_rating == "m", 1, 0),
    repeated = ifelse(enonce_repetition == "r", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), rt, response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data.csv"))
