# Library
library(dplyr)
library(purrr)
library(tidyr)

maximum_normalize <- function(vector){
  min_value = min(vector, na.rm = TRUE)
  vector = vector - min_value

  max_value = max(vector, na.rm = TRUE)
  
  normalized_vec = vector / max_value
  
  return(normalized_vec)
}

# Reading data
data_exp_1 <- read.csv("raw_data/jalbert_2020_only/Experiment-1-all-participants-data.csv")
data_exp_2 <- read.csv("raw_data/jalbert_2020_only/Experiment-2-all-participants-data.csv")
data_exp_3 <- read.csv("raw_data/jalbert_2020_only/Experiment-3-all-participants-data.csv")

# Reading info -----
read_info_data <- function(file){
  info_data = list()
  
  # Read info sheets
  info_data$publication_table = readxl::read_excel(file, sheet = "publication")
  info_data$study_table = readxl::read_excel(file, sheet = "study")
  info_data$measure_table = readxl::read_excel(file, sheet = "measure")
  info_data$dataset_table = readxl::read_excel(file, sheet = "dataset")
  info_data$statements_table = readxl::read_excel(file, sheet = "statements")
  info_data$repetition_table = readxl::read_excel(file, sheet = "repetition")
  info_data$within_table = readxl::read_excel(file, sheet = "within")
  
  return(info_data)
}

info <- read_info_data("raw_data/jalbert_2020_only/info_data.xlsx")

# Data 1 -----
# Processing data
data_exp_1_clean <- data_exp_1 %>% 
  filter(participants_to_exclude == 1) %>% 
  select(sona_ID, warning_or_no_warning, Truth_Effect_CB, matches("^A\\d+(_[TF])$")) %>% 
  mutate(
  percent_missing = rowSums(is.na(select(., matches("^A\\d+(_[TF])$")))) / 
    length(grep("^A\\d+(_[TF])$", names(.))) * 100
  ) %>% 
  filter(percent_missing < 99) %>% 
  mutate(subject = row_number()) %>% 
  select(-percent_missing, -sona_ID) %>% 
  pivot_longer(
    cols = matches("^A\\d+(_[TF])$"), 
    names_to = "measurement", 
    values_to = "truth_rating"
  ) %>% 
  separate(
    measurement,
    c("statement", "accuracy")
  ) %>% 
  mutate(
    statement_num_in_data = as.numeric(stringr::str_extract(statement, "\\d+$"))
  ) %>% 
  mutate(
    repeated = ifelse((Truth_Effect_CB == 1 & statement_num_in_data < 37) | (Truth_Effect_CB == 2 & statement_num_in_data > 36), 1, 0),
    accuracy = ifelse(accuracy == "T", 1, 0),
    truth_rating = 7 - truth_rating
  ) %>% 
  mutate(
    truth_rating = maximum_normalize(truth_rating)
  ) %>% 
  mutate(
    dataset_num = ifelse(warning_or_no_warning == 0, 1, 2),
    repetition_num_in_data = 2,
    within_num_in_data = 1
  ) %>% 
  group_by(subject) %>% 
  mutate(trial = row_number()) %>% 
  ungroup() %>% 
  mutate(
    rt = 99,
    certainty = 99,
    response = truth_rating
  ) %>% 
  select(
    dataset_num,
    repetition_num_in_data,
    within_num_in_data,
    subject,
    trial,
    statement_num_in_data,
    rt,
    response,
    repeated,
    certainty
  )

# Data 2 -----
data_exp_2_clean <- data_exp_2 %>% 
  filter(participants_to_exclude == 0) %>% 
  select(V1, warning_condition, Truth_Effect_CB, matches("^A\\d+(_[TF])$")) %>% 
  mutate(
    percent_missing = rowSums(is.na(select(., matches("^A\\d+(_[TF])$")))) / 
      length(grep("^A\\d+(_[TF])$", names(.))) * 100
  ) %>% 
  filter(percent_missing < 99) %>% 
  mutate(subject = row_number()) %>% 
  select(-percent_missing, -V1) %>% 
  pivot_longer(
    cols = matches("^A\\d+(_[TF])$"), 
    names_to = "measurement", 
    values_to = "truth_rating"
  ) %>% 
  separate(
    measurement,
    c("statement", "accuracy")
  ) %>% 
  mutate(
    statement_num_in_data = as.numeric(stringr::str_extract(statement, "\\d+$"))
  ) %>% 
  mutate(
    repeated = ifelse((Truth_Effect_CB == 1 & statement_num_in_data < 37) | (Truth_Effect_CB == 2 & statement_num_in_data > 36), 1, 0),
    accuracy = ifelse(accuracy == "T", 1, 0),
    truth_rating = 7 - truth_rating
  ) %>% 
  mutate(
    truth_rating = maximum_normalize(truth_rating)
  ) %>% 
  mutate(
    dataset_num = case_when(
      warning_condition == 0 ~ 3,
      warning_condition == 1 ~ 4,
      warning_condition == 2 ~ 5
    ),
    repetition_num_in_data = 2,
    within_num_in_data = 1
  ) %>% 
  group_by(subject) %>% 
  mutate(trial = row_number()) %>% 
  ungroup() %>% 
  mutate(
    rt = 99,
    certainty = 99,
    response = truth_rating
  ) %>% 
  select(
    dataset_num,
    repetition_num_in_data,
    within_num_in_data,
    subject,
    trial,
    statement_num_in_data,
    rt,
    response,
    repeated,
    certainty
  )

# Data 3 ---------
data_exp_3_clean <- data_exp_3 %>% 
  filter(participants_to_exclude == 0) %>% 
  select(V1, warning, some_or_half_warning, Truth_Effect_CB, matches("^A\\d+(_[TF])$")) %>% 
  mutate(
    percent_missing = rowSums(is.na(select(., matches("^A\\d+(_[TF])$")))) / 
      length(grep("^A\\d+(_[TF])$", names(.))) * 100
  ) %>% 
  filter(percent_missing < 99) %>% 
  mutate(subject = row_number()) %>% 
  select(-percent_missing, -V1) %>% 
  pivot_longer(
    cols = matches("^A\\d+(_[TF])$"), 
    names_to = "measurement", 
    values_to = "truth_rating"
  ) %>% 
  separate(
    measurement,
    c("statement", "accuracy")
  ) %>% 
  mutate(
    statement_num_in_data = as.numeric(stringr::str_extract(statement, "\\d+$"))
  ) %>% 
  mutate(
    repeated = ifelse((Truth_Effect_CB == 1 & statement_num_in_data < 37) | (Truth_Effect_CB == 2 & statement_num_in_data > 36), 1, 0),
    accuracy = ifelse(accuracy == "T", 1, 0),
    truth_rating = 7 - truth_rating
  ) %>% 
  mutate(
    truth_rating = maximum_normalize(truth_rating)
  ) %>% 
  mutate(
    dataset_num = case_when(
      some_or_half_warning == 0 & warning == 0 ~ 6,
      some_or_half_warning == 0 & warning == 1 ~ 7,
      some_or_half_warning == 1 & warning == 0 ~ 8,
      some_or_half_warning == 1 & warning == 1 ~ 9
    ),
    repetition_num_in_data = 2,
    within_num_in_data = 1
  ) %>% 
  group_by(subject) %>% 
  mutate(trial = row_number()) %>% 
  ungroup() %>% 
  mutate(
    rt = 99,
    certainty = 99,
    response = truth_rating
  ) %>% 
  select(
    dataset_num,
    repetition_num_in_data,
    within_num_in_data,
    subject,
    trial,
    statement_num_in_data,
    rt,
    response,
    repeated,
    certainty
  )


# For datasets
# Within each dataset, start numbering the repetition, within, statement
# and then join this to the correct dataset_num and update the repetition based on that
replace_ids <- function(data, info){
  dataset_nums_used = unique(data$dataset_num)
  
  repetition_keys = info$repetition_table %>% 
    filter(dataset_num %in% dataset_nums_used) %>% 
    select(dataset_num, repetition_num) %>% 
    group_by(dataset_num) %>% 
    mutate(repetition_num_in_data = row_number()) %>% 
    ungroup()
  
  within_keys = info$within_table %>% 
    filter(dataset_num %in% dataset_nums_used) %>% 
    select(dataset_num, within_num) %>% 
    group_by(dataset_num) %>% 
    mutate(within_num_in_data = row_number()) %>% 
    ungroup()
  
  statements_keys = info$statements_table %>% 
    filter(
      statementset_num %in% (info$dataset_table %>%
                               filter(dataset_num %in% dataset_nums_used) %>%
                               pull(statementset_num) %>% 
                               unique()
                             )
      ) %>% 
    left_join(., info$dataset_table[, c("statementset_num", "dataset_num")]) %>% 
    group_by(dataset_num) %>% 
    mutate(statement_num_in_data = row_number()) %>% 
    ungroup() %>% 
    select(dataset_num, statement_num, statement_num_in_data)
  
  joined_data = data %>% 
    left_join(., repetition_keys) %>% 
    left_join(., within_keys) %>% 
    left_join(., statements_keys) %>% 
    select(-ends_with("in_data"))
  
  return(joined_data)
}

# Put all experimental data in list and prep it
data_list <- list(data_exp_1_clean, data_exp_2_clean, data_exp_3_clean)

for (i in seq_along(data_list)){
  data_list[[i]] = replace_ids(data_list[[i]], info)
}

add_list$data = data.table::rbindlist(data_list) %>% 
  mutate(subject = dense_rank(interaction(dataset_num, subject)))

saveRDS(add_list, file = "processed_data/jalbert2020only.rdata")
