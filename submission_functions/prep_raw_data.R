prep_raw_data <- function(raw_data, db_overview){
  numeric_columns = db_overview |>
    dplyr::filter(table == "observation_table") |>
    dplyr::filter(data_type %in% c("BOOLEAN", "INTEGER", "FLOAT")) |>
    dplyr::pull(column_name)
  
  clean_raw_data = dplyr::mutate(
    raw_data, 
    dplyr::across(dplyr::any_of(numeric_columns), ~as.numeric(sub(",", ".", ., fixed = TRUE)))
  )
  
  clean_raw_data$repetition_identifier = clean_raw_data$session
  clean_raw_data$session = c()
  return(clean_raw_data)
}
