library(jsonlite)
library(tidyverse)

path <- "example_submission_data/submissions/"

file <- read_json(paste0(path, "submission_test_jalbert.json"))

raw_data_1 <- file$publication_info$`0`$study_info$`0`$raw_data$data


raw_data_1_df <- data.table::rbindlist(raw_data_1)
