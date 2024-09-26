add_data_to_table <- function(conn, data, table_name, db_overview){
  possible_cols = db_overview |> 
    dplyr::filter(table == table_name) |>
    dplyr::pull(column_name)
  
  insert = data |>
    dplyr::select(dplyr::any_of(possible_cols))
  
  DBI::dbWriteTable(
    conn = conn,
    name = table_name,
    value = insert,
    append = TRUE
  )
  
  print(paste("Added to", table_name, "table"))
}
