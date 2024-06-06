#' Add Object to Database
#'
#' This function adds an object to the database and inspects the object's structure. It checks for publication codes to ensure they are unique and adds them to the database. It then processes study names within the publication and adds them to the respective publication in the database.
#'
#' @param conn The connection object or database connection string.
#' @param object The object to be added to the database.
#'
#' @export
add_object <- function(conn, object){
  for (ientry in seq_along(object)){
    pub_code = object[[ientry]]$publication_table$publication_code
    if (does_publication_code_exist(conn, pub_code) == TRUE){
      stop("This publication code already exists. Please use the append_db function to add to a specific publication.")
    }
    
    # Find and add pub id
    pub_id = find_next_free_id(conn, "publication_table")
    
    pub_info = object[[ientry]]$publication_table
    
    # Then add that to db
    add_table(conn, pub_info, "publication_table")
    
    # For study
    study_id = find_next_free_id(conn, "study_table")
    study_info = object[[ientry]]$study_table
    study_info$publication_id = pub_id
    study_info$study_id = study_info$study_num + study_id - 1
    study_keys = obtain_keys(study_info, "study")
    add_table(conn, study_info, "study_table")
  
    # For measure
    measure_id = find_next_free_id(conn, "measure_table")
    measure_info = object[[ientry]]$measure_table
    measure_info$measure_id = measure_info$measure_num + measure_id - 1
    add_table(conn, measure_info, "measure_table")
    
    # For statementset
    statementset_id = find_next_free_id(conn, "statementset_table")
    statementset_info = object[[ientry]]$statements_table %>% 
      distinct(statementset_num, publication)
    statementset_info$statementset_id = statementset_info$statementset_num + statementset_id - 1
    statementset_keys = obtain_keys(statementset_info, "statementset")
    add_table(conn, statementset_info, "statementset_table")
    
    # For statements
    statement_id = find_next_free_id(conn, "statement_table")
    statement_info = object[[ientry]]$statements_table
    statement_info$statement_id = statement_info$statement_num + statement_id - 1
    statement_info = statement_info %>% 
      replace_id_keys_in_data(., statementset_keys, "statementset", suffix = "_num")
    
    statement_keys = obtain_keys(statement_info, "statement")
    add_table(conn, statement_info, "statement_table")
    
    
    # For dataset
    dataset_id = find_next_free_id(conn, "dataset_table")
    dataset_info = object[[ientry]]$dataset_table
    dataset_info$dataset_id = dataset_info$dataset_num + dataset_id - 1
  }
}