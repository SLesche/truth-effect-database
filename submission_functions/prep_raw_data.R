prep_raw_data <- function(raw_data, db_overview){
  numeric_columns = db_overview |>
    dplyr::filter(table == "observation_table") |>
    dplyr::filter(data_type %in% c("BOOLEAN", "INTEGER", "FLOAT")) |>
    dplyr::pull(column_name)
  
  clean_raw_data = dplyr::mutate(
    raw_data, 
    dplyr::across(dplyr::any_of(numeric_columns), ~as.numeric(sub(",", ".", ., fixed = TRUE)))
  )
  
  if ("rt" %in% colnames(clean_raw_data)){
    clean_raw_data$rt = ifelse(clean_raw_data$rt > 20, clean_raw_data$rt / 1000, clean_raw_data$rt)
    
    clean_raw_data$rt = ifelse(clean_raw_data$rt > 20, NA, clean_raw_data$rt)
  }
  
  clean_raw_data$response = max_normalize(clean_raw_data$response)
  return(clean_raw_data)
}
