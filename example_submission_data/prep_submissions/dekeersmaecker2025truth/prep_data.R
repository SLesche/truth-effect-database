library(tidyverse)

script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)

data <- haven::read_sav(paste0(script_dir, "./data/TBRE_study1A.sav")) 

var_labels <- sapply(data %>% select(matches("^[sab]\\d")), function(x) attr(x, "label"))

statement_data <- var_labels %>% 
  as.data.frame() %>% 
  mutate(
    id = rownames(var_labels %>% 
                              as.data.frame()),
  )

colnames(statement_data) <- c("statement_text", "statement_identifier")

final_statement_data <- statement_data %>% 
  filter(str_detect(statement_identifier, "^[ab]")) %>% 
  mutate(
    stamm = str_remove(statement_identifier, "R$"),
    set = readr::parse_number(str_extract(statement_identifier, "^[ab]\\d+")),
    repeated = ifelse(str_detect(statement_identifier, "R$"), 1, 0)
  ) %>% 
  mutate(
    language = case_when(
      repeated == 1 & set %in% c(2, 4) ~ "english",
      repeated == 0 & set %in% c(1, 3) ~ "english",
      repeated == 1 & set %in% c(1, 3) ~ "spanish",
      repeated == 0 & set %in% c(2, 4) ~ "spanish"
    )
  ) %>% 
  pivot_wider(
    id_cols = c(stamm, set),
    names_from = language,
    values_from = statement_text
  ) %>% 
  mutate(
    statement_text = paste0(english, "/", spanish),
    statement_identifier = stamm,
    id = stamm,
    statement_accuracy = NA
  )

write.csv(statement_data, paste0(script_dir, "./data/statement_data_1.csv"))

clean_data <- data %>% 
  filter(native_num == 1) %>% 
  filter(VOC_total >= 0.5) %>% 
  select(ID, CONDITION, matches("^[ab]\\d")) %>% 
  mutate_all(as.numeric) %>% 
  pivot_longer(
    cols = -c(ID, CONDITION),
    names_to = "id",
    values_to = "response"
  ) %>% 
  filter(!is.na(response)) %>% 
  mutate(
    stamm = str_remove(id, "R$"),
    set = readr::parse_number(str_extract(id, "^[ab]\\d+")),
    type = str_extract(id, "^[ab]")
  ) %>% 
  mutate(repeated = case_when(
    # Coded using the SPSS syntax as help
    CONDITION == 1 &
      type == "a" ~ 1,
    CONDITION == 1 &
      type == "b" ~ 0,
    CONDITION == 2 &
      type == "a" ~ 1,
    CONDITION == 2 &
      type == "b" ~ 0,
    CONDITION == 3 &
      type == "a" ~ 0,
    CONDITION == 3 &
      type == "b" ~ 1,
    CONDITION == 4 &
      type == "a" ~ 0,
    CONDITION == 4 &
      type == "b" ~ 1
  )) %>% 
  left_join(final_statement_data) %>% 
  mutate(
    presentation_identifier = 1,
    within_identifier = 1,
    between_identifier = 1,
    subject = ID,
    within_identifier = case_when(
      CONDITION == 1 &
        set %in% c(2, 4) ~ "native",
      CONDITION == 1 &
        set %in% c(1, 3) ~ "second",
      CONDITION == 2 &
        set %in% c(2, 4) ~ "second",
      CONDITION == 2 &
        set %in% c(1, 3) ~ "native",
      CONDITION == 3 &
        set %in% c(2, 4) ~ "native",
      CONDITION == 3 &
        set %in% c(1, 3) ~ "second",
      CONDITION == 4 &
        set %in% c(1, 3) ~ "native",
      CONDITION == 4 &
        set %in% c(2, 4) ~ "second"
    ),
    rt = NA,
    trial = NA,
  ) %>% 
  select(subject, ends_with("identifier"), response, repeated, rt, trial)

write.csv(clean_data, paste0(script_dir, "./data/clean_data_1a.csv"))

## Exp1b ----