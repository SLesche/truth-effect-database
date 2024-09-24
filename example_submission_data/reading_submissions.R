library(jsonlite)
library(tidyverse)

path <- "example_submission_data/"

file <- read_json(paste0(path, "submission_test.json"))

raw_data_1 <- file$study_info$`0`$raw_data


raw_data_1_df <- data.table::rbindlist(raw_data_1)
