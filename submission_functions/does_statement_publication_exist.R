does_statement_publication_exist <- function(conn, publication){
  sql_query = paste0(
    "SELECT statementset_id FROM statementset_table WHERE statementset_table.statementset_publication = '",
    publication, 
    "'"
  )
  pub_id = DBI::dbGetQuery(conn, sql_query)
  length = nrow(pub_id)
  if (length == 0){
    return(FALSE)
  } else if (length == 1){
    return(TRUE)
  } else {
    stop("This statement publication was already found twice in the database. Please investigate what went wrong here.")
  }
}
