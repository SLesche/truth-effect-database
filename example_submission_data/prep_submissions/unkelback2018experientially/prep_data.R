library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

path <- paste0(script_dir, "./data/FT_Cue1_Full.txt")

lines <- readLines(path)

n <- length(lines) / 18  # Because each participant's data spans 17 lines

data_mat <- matrix(lines, ncol = 18, byrow = TRUE)

split_line <- function(line) {
  str_split(trimws(line), "\\s+")[[1]]
}

df_list <- lapply(1:nrow(data_mat), function(i) {
  row_lines <- data_mat[i, ]
  
  list(
    date      = split_line(row_lines[1])[1],
    time      = split_line(row_lines[1])[2],
    vpnr      = split_line(row_lines[1])[3],
    sex       = as.integer(split_line(row_lines[1])[4]),
    age       = as.integer(split_line(row_lines[1])[5]),
    lang      = as.integer(split_line(row_lines[1])[6]),
    
    Start_Break = row_lines[3],
    Stop_Break  = row_lines[4],
    
    T1_pos  = as.integer(split_line(row_lines[6])),
    T2_pos  = as.integer(split_line(row_lines[7])),
    d       = as.numeric(split_line(row_lines[8])),
    t       = as.numeric(split_line(row_lines[10])),
    
    S_T1_pos = as.integer(split_line(row_lines[12])),
    S_T2_pos = as.integer(split_line(row_lines[13])),
    S_d      = as.numeric(split_line(row_lines[14])),
    S_t      = as.numeric(split_line(row_lines[16])),
    
    class    = split_line(row_lines[17])
  )
})

# === 7. Combine into data frame ===
df <- tibble(
  date      = sapply(df_list, `[[`, "date"),
  time      = sapply(df_list, `[[`, "time"),
  vpnr      = sapply(df_list, `[[`, "vpnr"),
  sex       = sapply(df_list, `[[`, "sex"),
  age       = sapply(df_list, `[[`, "age"),
  lang      = sapply(df_list, `[[`, "lang"),
  Start_Break = sapply(df_list, `[[`, "Start_Break"),
  Stop_Break  = sapply(df_list, `[[`, "Stop_Break"),
  
  T1_pos    = I(lapply(df_list, `[[`, "T1_pos")),
  T2_pos    = I(lapply(df_list, `[[`, "T2_pos")),
  d         = I(lapply(df_list, `[[`, "d")),
  t         = I(lapply(df_list, `[[`, "t")),
  
  S_T1_pos  = I(lapply(df_list, `[[`, "S_T1_pos")),
  S_T2_pos  = I(lapply(df_list, `[[`, "S_T2_pos")),
  S_d       = I(lapply(df_list, `[[`, "S_d")),
  S_t       = I(lapply(df_list, `[[`, "S_t")),
  
  class     = I(lapply(df_list, `[[`, "class"))
)


clean_data <- df %>% 
  filter(lang != 3) %>% 
  distinct() %>% 
  select(subject = vpnr, d, t) %>% 
  unnest(c(d, t)) %>% 
  group_by(subject) %>% 
  mutate(statement_number = row_number()) %>% 
  ungroup() %>% 
  mutate(
    statement_accuracy = ifelse(statement_number < 61, 1, 0)
  ) %>% 
  mutate(
    within_identifier = case_when(
      statement_number %in% c(1:5, 31:35, 61:65, 91:95) ~ "true_50",
      statement_number %in% c(6:10, 36:40, 66:70, 96:100) ~ "true_60",
      statement_number %in% c(11:15, 41:45, 71:75, 101:105) ~ "true_70",
      statement_number %in% c(16:20, 46:50, 76:80, 106:110) ~ "false_50",
      statement_number %in% c(21:25, 51:55, 81:85, 111:115) ~ "false_60",
      statement_number %in% c(26:30, 56:60, 86:90, 116:120) ~ "false_70"
    ),
    repeated = case_when(
      statement_number %in% c(31:60, 91:120) ~ 0,
      statement_number %in% c(1:30, 61:90) ~ 1
    )
  ) %>% 
  mutate(
    statement_identifier = statement_number,
    statement_text = NA,
    trial = NA,
    rt = t / 1000,
    presentation_identifier = 1,
    response = d,
  ) %>% 
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1.csv"))

statement_data <- clean_data %>% 
  select(contains("statement")) %>% 
  distinct()

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

## Exp2 ----

path <- paste0(script_dir, "./data/FT_Cue1b_Full.txt")

lines <- readLines(path)

n <- length(lines) / 18  # Because each participant's data spans 17 lines

data_mat <- matrix(lines, ncol = 18, byrow = TRUE)

split_line <- function(line) {
  str_split(trimws(line), "\\s+")[[1]]
}

df_list <- lapply(1:nrow(data_mat), function(i) {
  row_lines <- data_mat[i, ]
  
  list(
    date      = split_line(row_lines[1])[1],
    time      = split_line(row_lines[1])[2],
    vpnr      = split_line(row_lines[1])[3],
    sex       = as.integer(split_line(row_lines[1])[4]),
    age       = as.integer(split_line(row_lines[1])[5]),
    lang      = as.integer(split_line(row_lines[1])[6]),
    
    Start_Break = row_lines[3],
    Stop_Break  = row_lines[4],
    
    T1_pos  = as.integer(split_line(row_lines[6])),
    T2_pos  = as.integer(split_line(row_lines[7])),
    d       = as.numeric(split_line(row_lines[8])),
    t       = as.numeric(split_line(row_lines[10])),
    
    S_T1_pos = as.integer(split_line(row_lines[12])),
    S_T2_pos = as.integer(split_line(row_lines[13])),
    S_d      = as.numeric(split_line(row_lines[14])),
    S_t      = as.numeric(split_line(row_lines[16])),
    
    class    = split_line(row_lines[17])
  )
})

# === 7. Combine into data frame ===
df <- tibble(
  date      = sapply(df_list, `[[`, "date"),
  time      = sapply(df_list, `[[`, "time"),
  vpnr      = sapply(df_list, `[[`, "vpnr"),
  sex       = sapply(df_list, `[[`, "sex"),
  age       = sapply(df_list, `[[`, "age"),
  lang      = sapply(df_list, `[[`, "lang"),
  Start_Break = sapply(df_list, `[[`, "Start_Break"),
  Stop_Break  = sapply(df_list, `[[`, "Stop_Break"),
  
  T1_pos    = I(lapply(df_list, `[[`, "T1_pos")),
  T2_pos    = I(lapply(df_list, `[[`, "T2_pos")),
  d         = I(lapply(df_list, `[[`, "d")),
  t         = I(lapply(df_list, `[[`, "t")),
  
  S_T1_pos  = I(lapply(df_list, `[[`, "S_T1_pos")),
  S_T2_pos  = I(lapply(df_list, `[[`, "S_T2_pos")),
  S_d       = I(lapply(df_list, `[[`, "S_d")),
  S_t       = I(lapply(df_list, `[[`, "S_t")),
  
  class     = I(lapply(df_list, `[[`, "class"))
)

clean_data <- df %>% 
  filter(vpnr != 999) %>% 
  distinct() %>% 
  select(subject = vpnr, d, t) %>% 
  unnest(c(d, t)) %>% 
  group_by(subject) %>% 
  mutate(statement_number = row_number()) %>% 
  ungroup() %>% 
  mutate(
    statement_accuracy = ifelse(statement_number < 61, 1, 0)
  ) %>% 
  mutate(
    within_identifier = case_when(
      statement_number %in% c(1:5, 31:35, 61:65, 91:95) ~ "true_50",
      statement_number %in% c(6:10, 36:40, 66:70, 96:100) ~ "true_60",
      statement_number %in% c(11:15, 41:45, 71:75, 101:105) ~ "true_70",
      statement_number %in% c(16:20, 46:50, 76:80, 106:110) ~ "false_50",
      statement_number %in% c(21:25, 51:55, 81:85, 111:115) ~ "false_60",
      statement_number %in% c(26:30, 56:60, 86:90, 116:120) ~ "false_70"
    ),
    repeated = case_when(
      statement_number %in% c(31:60, 91:120) ~ 0,
      statement_number %in% c(1:30, 61:90) ~ 1
    )
  ) %>% 
  mutate(
    statement_identifier = statement_number,
    statement_text = NA,
    trial = NA,
    rt = t / 1000,
    presentation_identifier = 1,
    response = d + 50,
  ) %>% 
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_2.csv"))


## Exp3 ----
# Set the correct file path
path <- paste0(script_dir, "./data/FT_Cue1c_Full.txt")

# Read all lines
lines <- readLines(path)

# Each participant spans 14 lines
n <- length(lines) / 14
data_mat <- matrix(lines, ncol = 14, byrow = TRUE)

# Helper: split a line into vector
split_line <- function(line) {
  str_split(trimws(line), "\\s+")[[1]]
}

# Parse each participant
df_list <- lapply(1:nrow(data_mat), function(i) {
  row_lines <- data_mat[i, ]
  
  list(
    date      = split_line(row_lines[1])[1],
    time      = split_line(row_lines[1])[2],
    vpnr      = split_line(row_lines[1])[3],
    age       = as.integer(split_line(row_lines[1])[4]),
    sex       = as.integer(split_line(row_lines[1])[5]),
    
    T1_pos    = as.integer(split_line(row_lines[2])),
    T2_pos    = as.integer(split_line(row_lines[3])),
    r         = as.numeric(split_line(row_lines[4])),
    d         = as.numeric(split_line(row_lines[5])),
    t         = as.numeric(split_line(row_lines[6])),
    
    S_T1_pos  = as.integer(split_line(row_lines[8])),
    S_T2_pos  = as.integer(split_line(row_lines[9])),
    S_r       = as.numeric(split_line(row_lines[10])),
    S_d       = as.numeric(split_line(row_lines[11])),
    S_t       = as.numeric(split_line(row_lines[12])),
    
    class     = split_line(row_lines[13])
  )
})

# Combine into a tibble
df <- tibble(
  date      = sapply(df_list, `[[`, "date"),
  time      = sapply(df_list, `[[`, "time"),
  vpnr      = sapply(df_list, `[[`, "vpnr"),
  age       = sapply(df_list, `[[`, "age"),
  sex       = sapply(df_list, `[[`, "sex"),
  
  T1_pos    = I(lapply(df_list, `[[`, "T1_pos")),
  T2_pos    = I(lapply(df_list, `[[`, "T2_pos")),
  r         = I(lapply(df_list, `[[`, "r")),
  d         = I(lapply(df_list, `[[`, "d")),
  t         = I(lapply(df_list, `[[`, "t")),
  
  S_T1_pos  = I(lapply(df_list, `[[`, "S_T1_pos")),
  S_T2_pos  = I(lapply(df_list, `[[`, "S_T2_pos")),
  S_r       = I(lapply(df_list, `[[`, "S_r")),
  S_d       = I(lapply(df_list, `[[`, "S_d")),
  S_t       = I(lapply(df_list, `[[`, "S_t")),
  
  class     = I(lapply(df_list, `[[`, "class"))
)

clean_data <- df %>% 
  distinct() %>% 
  select(subject = vpnr, r, t) %>% 
  unnest(c(r, t)) %>% 
  group_by(subject) %>% 
  mutate(statement_number = row_number()) %>% 
  ungroup() %>% 
  mutate(
    statement_accuracy = ifelse(statement_number < 61, 1, 0)
  ) %>% 
  mutate(
    within_identifier = case_when(
      statement_number %in% c(1:5, 31:35, 61:65, 91:95) ~ "false_70",
      statement_number %in% c(6:10, 36:40, 66:70, 96:100) ~ "false_80",
      statement_number %in% c(11:15, 41:45, 71:75, 101:105) ~ "false_90",
      statement_number %in% c(16:20, 46:50, 76:80, 106:110) ~ "true_70",
      statement_number %in% c(21:25, 51:55, 81:85, 111:115) ~ "true_80",
      statement_number %in% c(26:30, 56:60, 86:90, 116:120) ~ "true_90"
    ),
    repeated = case_when(
      statement_number %in% c(31:60, 91:120) ~ 0,
      statement_number %in% c(1:30, 61:90) ~ 1
    )
  ) %>% 
  mutate(
    statement_identifier = statement_number,
    statement_text = NA,
    trial = NA,
    rt = t / 1000,
    presentation_identifier = 1,
    response = r + 50,
  ) %>% 
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_3.csv"))



## Exp4 ----
# Set the correct file path
path <- paste0(script_dir, "./data/FT_Cue1d_Full.txt")

# Read all lines
lines <- readLines(path)

# Each participant spans 14 lines
n <- length(lines) / 14
data_mat <- matrix(lines, ncol = 14, byrow = TRUE)

# Helper: split a line into vector
split_line <- function(line) {
  str_split(trimws(line), "\\s+")[[1]]
}

# Parse each participant
df_list <- lapply(1:nrow(data_mat), function(i) {
  row_lines <- data_mat[i, ]
  
  list(
    date      = split_line(row_lines[1])[1],
    time      = split_line(row_lines[1])[2],
    vpnr      = split_line(row_lines[1])[3],
    age       = as.integer(split_line(row_lines[1])[4]),
    sex       = as.integer(split_line(row_lines[1])[5]),
    
    T1_pos    = as.integer(split_line(row_lines[2])),
    T2_pos    = as.integer(split_line(row_lines[3])),
    r         = as.numeric(split_line(row_lines[4])),
    d         = as.numeric(split_line(row_lines[5])),
    t         = as.numeric(split_line(row_lines[6])),
    
    S_T1_pos  = as.integer(split_line(row_lines[8])),
    S_T2_pos  = as.integer(split_line(row_lines[9])),
    S_r       = as.numeric(split_line(row_lines[10])),
    S_d       = as.numeric(split_line(row_lines[11])),
    S_t       = as.numeric(split_line(row_lines[12])),
    
    class     = split_line(row_lines[13])
  )
})

# Combine into a tibble
df <- tibble(
  date      = sapply(df_list, `[[`, "date"),
  time      = sapply(df_list, `[[`, "time"),
  vpnr      = sapply(df_list, `[[`, "vpnr"),
  age       = sapply(df_list, `[[`, "age"),
  sex       = sapply(df_list, `[[`, "sex"),
  
  T1_pos    = I(lapply(df_list, `[[`, "T1_pos")),
  T2_pos    = I(lapply(df_list, `[[`, "T2_pos")),
  r         = I(lapply(df_list, `[[`, "r")),
  d         = I(lapply(df_list, `[[`, "d")),
  t         = I(lapply(df_list, `[[`, "t")),
  
  S_T1_pos  = I(lapply(df_list, `[[`, "S_T1_pos")),
  S_T2_pos  = I(lapply(df_list, `[[`, "S_T2_pos")),
  S_r       = I(lapply(df_list, `[[`, "S_r")),
  S_d       = I(lapply(df_list, `[[`, "S_d")),
  S_t       = I(lapply(df_list, `[[`, "S_t")),
  
  class     = I(lapply(df_list, `[[`, "class"))
)

clean_data <- df %>% 
  filter(vpnr != 23) %>% 
  distinct() %>% 
  select(subject = vpnr, r, t) %>% 
  unnest(c(r, t)) %>% 
  group_by(subject) %>% 
  mutate(statement_number = row_number()) %>% 
  ungroup() %>% 
  mutate(
    statement_accuracy = ifelse(statement_number < 61, 1, 0)
  ) %>% 
  mutate(
    within_identifier = case_when(
      statement_number %in% c(1:5, 31:35, 61:65, 91:95) ~ "true_50",
      statement_number %in% c(6:10, 36:40, 66:70, 96:100) ~ "true_100",
      statement_number %in% c(11:15, 41:45, 71:75, 101:105) ~ "false_50",
      statement_number %in% c(16:20, 46:50, 76:80, 106:110) ~ "false_100"
    ),
    repeated = case_when(
      statement_number %in% c(31:50, 91:110) ~ 0,
      statement_number %in% c(1:20, 61:80) ~ 1
    )
  ) %>% 
  mutate(
    statement_identifier = statement_number,
    statement_text = NA,
    trial = NA,
    rt = t / 1000,
    presentation_identifier = 1,
    response = r + 50,
  ) %>% 
  filter(statement_number %in% c(1:20, 31:50, 61:80, 91:110) | subject == 3) %>% 
  select(subject, ends_with("identifier"), contains("statement"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_4.csv"))
