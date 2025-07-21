library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- data.table::fread(paste0(script_dir, "./data/Data_Experiment_2.csv"), encoding = "Latin-1")

data <- data %>% 
  mutate(Statement = str_remove_all(Statement, "\r")) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\n"))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\\."))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\\?"))) %>%  
  mutate(Statement = trimws(str_remove_all(Statement, "KIlde"))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, " Gullsmed Roald Martinussen")))

statement_data <-  data %>% 
  distinct(Statement) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = Statement,
    statement_accuracy = NA,
    proportion_true = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_2.csv"))


clean_data <- data %>% 
  filter(Phase == "TruthPhase") %>% 
  left_join(., statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = paste0(Source, Picture),
    between_identifier = 1,
    response = TruthRating,
    subject = Subject,
    trial = row_number(),
    repeated = ifelse(Repetition == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))


## Exp 3-----
data <- data.table::fread(paste0(script_dir, "./data/Data_Experiment_3.csv"), encoding = "Latin-1")

data <- data %>% 
  mutate(Statement = str_remove_all(Statement, "\r")) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\n"))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\\."))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\\?"))) %>%  
  mutate(Statement = trimws(str_remove_all(Statement, "KIlde"))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, " Gullsmed Roald Martinussen")))

statement_data <-  data %>% 
  distinct(Statement) %>% 
  mutate(
    statement_identifier = row_number(),
    statement_text = Statement,
    statement_accuracy = NA,
    proportion_true = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_3.csv"))


clean_data <- data %>% 
  filter(Phase == "TruthPhase") %>% 
  left_join(., statement_data) %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = paste0(Source, Picture),
    between_identifier = 1,
    response = TruthRating,
    rt = TruthRating.RT / 1000,
    subject = Subject,
    trial = row_number(),
    repeated = ifelse(Repetition == "Yes", 1, 0)
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial, rt)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))

## Exp 4-----
data <- data.table::fread(paste0(script_dir, "./data/Data_Experiment_4.csv"), encoding = "Latin-1")

data <- data %>% 
  mutate(Statement = str_remove_all(Statement, "\r")) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\n"))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\\."))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, "\\?"))) %>%  
  mutate(Statement = trimws(str_remove_all(Statement, "KIlde"))) %>% 
  mutate(Statement = trimws(str_remove_all(Statement, " Gullsmed Roald Martinussen")))

statement_data <- data %>% 
  distinct(Statement, PairNo) %>% 
  group_by(PairNo) %>% 
  mutate(num = ifelse(row_number() %% 2, "first", "second") )%>% 
  ungroup() %>% 
  pivot_wider(id_cols = PairNo, values_from = Statement, names_from = num) %>% 
  mutate(
    statement_identifier = PairNo,
    statement_text = paste0(first, "/", second),
    statement_accuracy = NA,
    proportion_true = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_4.csv"))


clean_data <- data %>% 
  filter(Phase == "TruthPhase") %>% 
  left_join(., statement_data, by = "PairNo") %>% 
  mutate(
    procedure_identifier = 1,
    within_identifier = Source,
    between_identifier = 1,
    response = TruthRating,
    rt = TruthRating.RT,
    subject = Subject,
    trial = Trial,
    repeated = case_when(
      Repetition == "Verbatim" ~ 1,
      Repetition == "No" ~ 0,
      Repetition == "Incoherent" ~ NA
    )
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, trial, rt)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_4.csv"))
