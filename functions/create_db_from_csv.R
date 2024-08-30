# Function to create a database from the CSV file with foreign keys
create_db_from_csv <- function(schema_df, db_path) {
  # Connect to the SQLite database (creates a new database if it doesn't exist)
  con <- DBI::dbConnect(RSQLite::SQLite(), db_path)
  
  # Get the unique tables from the schema
  tables <- unique(schema_df$table)
  
  # Loop through each table to create it
  for (table in tables) {
    # Filter the schema for the current table
    table_schema <- schema_df[schema_df$table == table, ]
    
    # Separate column definitions and foreign key constraints
    column_definitions <- list()
    foreign_key_definitions <- list()
    
    for (i in 1:nrow(table_schema)) {
      # Add column definition
      col_def <- paste0(table_schema$column_name[i], " ", table_schema$data_type[i])
      
      if (table_schema$constraints[i] != "" & !grepl("FOREIGN", table_schema$constraints[i])) {
        col_def <- paste0(col_def, " ", table_schema$constraints[i])
      }
      
      column_definitions <- c(column_definitions, col_def)
      if (grepl("FOREIGN", table_schema$constraints[i])){
        # Add foreign key definition
        foreign_key_definitions <- c(foreign_key_definitions, table_schema$constraints[i])
      }
    }
    
    # Combine all column definitions and foreign key constraints
    all_definitions <- c(column_definitions, foreign_key_definitions)
    
    # Construct the SQL query to create the table
    create_table_sql <- paste0("CREATE TABLE ", table, " (", paste(all_definitions, collapse = ", "), ");")
    
    # Execute the SQL query to create the table
    DBI::dbExecute(con, create_table_sql)
  }
  
  # Disconnect from the database
  DBI::dbDisconnect(con)
}
