library(tidyverse)
library(readxl)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- read_excel(paste0(script_dir, "./data/Experiment 1.xlsx"), sheet = "Raw")

statement_data <- read_excel(paste0(script_dir, "./data/Experiment 1.xlsx"), sheet = "Items")

statement_data <- statement_data %>% 
  janitor::clean_names() %>% 
  mutate(
    statement_identifier = paste0(tolower(set), number),
    statement_text = item,
    statement_accuracy = ifelse(t_f == "T", 1, 0)
  ) %>% 
  select(starts_with("statement"))

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))


clean_data <- data %>% 
  janitor::clean_names() %>% 
  select(p, counterbalance, initial_rating, starts_with("final_truth")) %>% 
  pivot_longer(
    cols = -c(p,counterbalance, initial_rating),
    names_prefix = "final_truth_",
    names_to = "rating_type",
    values_to = "value"
  ) %>% 
  mutate(
    rating_type = str_remove(rating_type, "^truth_rating_")
  ) %>% 
  separate(
    rating_type,
    into = c("type", "item"),
    sep = "_"
  ) %>% 
  pivot_wider(
    id_cols = c(p, counterbalance, initial_rating, item),
    names_from = "type",
    values_from = "value"
  )

clean_data <- clean_data %>% 
  mutate(set = toupper(str_extract(item, "^[a-z]"))) %>% 
  mutate(
    repeated = case_when(
      counterbalance == 1 & set == "A" ~ 1,
      counterbalance == 1 & set == "B" ~ 0,
      counterbalance == 1 & set == "C" ~ 1,
      counterbalance == 1 & set == "D" ~ 0,
      counterbalance == 2 & set == "A" ~ 0,
      counterbalance == 2 & set == "B" ~ 1,
      counterbalance == 2 & set == "C" ~ 1,
      counterbalance == 2 & set == "D" ~ 0,
      counterbalance == 3 & set == "A" ~ 1,
      counterbalance == 3 & set == "B" ~ 0,
      counterbalance == 3 & set == "C" ~ 1,
      counterbalance == 3 & set == "D" ~ 0,
      counterbalance == 4 & set == "A" ~ 0,
      counterbalance == 4 & set == "B" ~ 1,
      counterbalance == 4 & set == "C" ~ 1,
      counterbalance == 4 & set == "D" ~ 0,
    )
  ) %>% 
  mutate(
    statement_identifier = item,
    subject = p,
    trial = NA,
    procedure_identifier = 1,
    between_identifier = initial_rating,
    within_identifier = 1,
    response = rating,
    rt = rt
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial)


write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

### Exp 2----
data <- read_excel(paste0(script_dir, "./data/Experiment 2.xlsx"), sheet = "Raw")

statement_data <- read_excel(paste0(script_dir, "./data/Experiment 2.xlsx"), sheet = "Items")

statement_data <- statement_data %>% 
  janitor::clean_names() %>% 
  mutate(
    statement_identifier = paste0(tolower(set), number),
    statement_text = item,
    statement_accuracy = ifelse(t_f == "T", 1, 0),
    knowledge = estimated_knowledge
  ) %>% 
  select(starts_with("statement"), knowledge) %>% 
  mutate(item = statement_identifier)

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))


clean_data <- data %>% 
  janitor::clean_names() %>% 
  select(p, counterbalance, initial_rating, starts_with("final_truth")) %>% 
  pivot_longer(
    cols = -c(p,counterbalance, initial_rating),
    names_prefix = "final_truth_",
    names_to = "rating_type",
    values_to = "value"
  ) %>% 
  mutate(
    rating_type = str_remove(rating_type, "^truth_rating_")
  ) %>% 
  separate(
    rating_type,
    into = c("type", "item"),
    sep = "_"
  ) %>% 
  pivot_wider(
    id_cols = c(p, counterbalance, initial_rating, item),
    names_from = "type",
    values_from = "value"
  )

clean_data <- clean_data %>% 
  mutate(set = toupper(str_extract(item, "^[a-z]"))) %>% 
  mutate(
    repeated = case_when(
      counterbalance == 1 & set == "A" ~ 1,
      counterbalance == 1 & set == "B" ~ 0,
      counterbalance == 1 & set == "C" ~ 1,
      counterbalance == 1 & set == "D" ~ 0,
      counterbalance == 2 & set == "A" ~ 0,
      counterbalance == 2 & set == "B" ~ 1,
      counterbalance == 2 & set == "C" ~ 1,
      counterbalance == 2 & set == "D" ~ 0,
      counterbalance == 3 & set == "A" ~ 1,
      counterbalance == 3 & set == "B" ~ 0,
      counterbalance == 3 & set == "C" ~ 1,
      counterbalance == 3 & set == "D" ~ 0,
      counterbalance == 4 & set == "A" ~ 0,
      counterbalance == 4 & set == "B" ~ 1,
      counterbalance == 4 & set == "C" ~ 1,
      counterbalance == 4 & set == "D" ~ 0,
    )
  ) %>% 
  left_join(statement_data) %>% 
  mutate(
    statement_identifier = item,
    subject = p,
    trial = NA,
    procedure_identifier = 1,
    between_identifier = initial_rating,
    within_identifier = knowledge,
    response = rating,
    rt = rt
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial)


write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))


### Exp 3----
data <- read_excel(paste0(script_dir, "./data/Experiment 3.xlsx"), sheet = "Raw")

statement_data <- read_excel(paste0(script_dir, "./data/Experiment 2.xlsx"), sheet = "Items")

statement_data <- statement_data %>% 
  janitor::clean_names() %>% 
  mutate(
    statement_identifier = paste0(tolower(set), number),
    statement_text = item,
    statement_accuracy = ifelse(t_f == "T", 1, 0),
    knowledge = estimated_knowledge
  ) %>% 
  select(starts_with("statement"), knowledge) %>% 
  mutate(item = statement_identifier)

# write.csv(statement_data, paste0(script_dir, "./data/statement_data_3.csv"))


clean_data <- data %>% 
  janitor::clean_names() %>% 
  select(p, counterbalance, initial_rating, starts_with("final_truth")) %>% 
  pivot_longer(
    cols = -c(p,counterbalance, initial_rating),
    names_prefix = "final_truth_",
    names_to = "rating_type",
    values_to = "value"
  ) %>% 
  mutate(
    rating_type = str_remove(rating_type, "^truth_rating_")
  ) %>% 
  separate(
    rating_type,
    into = c("type", "item"),
    sep = "_"
  ) %>% 
  pivot_wider(
    id_cols = c(p, counterbalance, initial_rating, item),
    names_from = "type",
    values_from = "value"
  )

clean_data <- clean_data %>% 
  mutate(set = toupper(str_extract(item, "^[a-z]"))) %>% 
  mutate(
    repeated = case_when(
      counterbalance == 1 & set == "A" ~ 1,
      counterbalance == 1 & set == "B" ~ 0,
      counterbalance == 1 & set == "C" ~ 1,
      counterbalance == 1 & set == "D" ~ 0,
      counterbalance == 2 & set == "A" ~ 0,
      counterbalance == 2 & set == "B" ~ 1,
      counterbalance == 2 & set == "C" ~ 1,
      counterbalance == 2 & set == "D" ~ 0,
      counterbalance == 3 & set == "A" ~ 1,
      counterbalance == 3 & set == "B" ~ 0,
      counterbalance == 3 & set == "C" ~ 1,
      counterbalance == 3 & set == "D" ~ 0,
      counterbalance == 4 & set == "A" ~ 0,
      counterbalance == 4 & set == "B" ~ 1,
      counterbalance == 4 & set == "C" ~ 1,
      counterbalance == 4 & set == "D" ~ 0,
    )
  ) %>% 
  left_join(statement_data) %>% 
  mutate(
    statement_identifier = item,
    subject = p,
    trial = NA,
    procedure_identifier = 1,
    between_identifier = initial_rating,
    within_identifier = knowledge,
    response = rating,
    rt = rt
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial)


write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))


### Exp 4----
data <- read_excel(paste0(script_dir, "./data/Experiment 4.xlsx"), sheet = "Raw")

statement_data <- read_excel(paste0(script_dir, "./data/Experiment 2.xlsx"), sheet = "Items")

statement_data <- statement_data %>% 
  janitor::clean_names() %>% 
  mutate(
    statement_identifier = paste0(tolower(set), number),
    statement_text = item,
    statement_accuracy = ifelse(t_f == "T", 1, 0),
    knowledge = estimated_knowledge
  ) %>% 
  select(starts_with("statement"), knowledge) %>% 
  mutate(item = statement_identifier)

# write.csv(statement_data, paste0(script_dir, "./data/statement_data_3.csv"))


clean_data <- data %>% 
  janitor::clean_names() %>% 
  select(p, counterbalance, initial_rating, starts_with("final_truth")) %>% 
  pivot_longer(
    cols = -c(p,counterbalance, initial_rating),
    names_prefix = "final_truth_",
    names_to = "rating_type",
    values_to = "value"
  ) %>% 
  mutate(
    rating_type = str_remove(rating_type, "^truth_rating_")
  ) %>% 
  separate(
    rating_type,
    into = c("type", "item"),
    sep = "_"
  ) %>% 
  pivot_wider(
    id_cols = c(p, counterbalance, initial_rating, item),
    names_from = "type",
    values_from = "value"
  )

clean_data <- clean_data %>% 
  mutate(set = toupper(str_extract(item, "^[a-z]"))) %>% 
  mutate(
    repeated = case_when(
      counterbalance == 1 & set == "A" ~ 1,
      counterbalance == 1 & set == "B" ~ 0,
      counterbalance == 1 & set == "C" ~ 1,
      counterbalance == 1 & set == "D" ~ 0,
      counterbalance == 2 & set == "A" ~ 0,
      counterbalance == 2 & set == "B" ~ 1,
      counterbalance == 2 & set == "C" ~ 1,
      counterbalance == 2 & set == "D" ~ 0,
      counterbalance == 3 & set == "A" ~ 1,
      counterbalance == 3 & set == "B" ~ 0,
      counterbalance == 3 & set == "C" ~ 1,
      counterbalance == 3 & set == "D" ~ 0,
      counterbalance == 4 & set == "A" ~ 0,
      counterbalance == 4 & set == "B" ~ 1,
      counterbalance == 4 & set == "C" ~ 1,
      counterbalance == 4 & set == "D" ~ 0,
    )
  ) %>% 
  left_join(statement_data) %>% 
  mutate(
    statement_identifier = item,
    subject = p,
    trial = NA,
    procedure_identifier = 1,
    between_identifier = initial_rating,
    within_identifier = knowledge,
    response = rating,
    rt = rt
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial)


write.csv(clean_data, paste0(script_dir, "./data/clean_data_4.csv"))
