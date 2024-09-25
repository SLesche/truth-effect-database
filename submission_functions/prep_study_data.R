prep_study_data <- function(study_data, db_overview){
  study_data$statementset_idx = ifelse(
    study_data$statementset_name == "no information",
    0,
    readr::parse_number(study_data$statementset_name)
  )
  
  numeric_columns = db_overview |>
    dplyr::filter(table == "study_table") |>
    dplyr::filter(data_type %in% c("BOOLEAN", "INTEGER", "FLOAT")) |>
    dplyr::pull(column_name)
  
  study_data = dplyr::mutate(
    study_data, 
    dplyr::across(dplyr::any_of(numeric_columns), ~as.numeric(sub(",", ".", ., fixed = TRUE)))
  )
  
  return (study_data)
}