# Library
library(dplyr)
library(purrr)

# Reading data
data_exp_1 <- read.csv("raw_data/jalbert_2020_only/Experiment-1-all-participants-data.csv")
data_exp_2 <- read.csv("raw_data/jalbert_2020_only/Experiment-2-all-participants-data.csv")
data_exp_3 <- read.csv("raw_data/jalbert_2020_only/Experiment-3-all-participants-data.csv")

# Reading info


# Processing data
data_exp_1_exclude <-  c(15288, 20059, 20042, 21555, 21101, 20961, 21267,
                         21200, 19618, 20865, 18935, 21512, 21538,
                         19013, 20675, 20759, 21076, 21668,
                         21347, 21705,
                         19437) # See script 
data_exp_1 %>% 
  filter(!sona_ID %in% data_exp_1_exclude) %>% 
  select(sona_ID, Truth_Effect_CB, matches("^A\\d+(_[TF])$"))
  mutate(percent_missing = rowSums())
  mutate()
