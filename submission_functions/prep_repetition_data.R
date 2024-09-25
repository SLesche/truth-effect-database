prep_repetition_data <- function(repetition_data, db_overview){
  numeric_columns = db_overview |>
    dplyr::filter(table == "repetition_table") |>
    dplyr::filter(data_type %in% c("BOOLEAN", "INTEGER", "FLOAT")) |>
    dplyr::pull(column_name)
  
  clean_repetition_data = dplyr::mutate(
    repetition_data, 
    dplyr::across(dplyr::any_of(numeric_columns), ~as.numeric(sub(",", ".", ., fixed = TRUE)))
  )
  
  return(clean_repetition_data)
}