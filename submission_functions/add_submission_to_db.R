add_submission_to_db <- function(conn, submission_obj, db_path){
  pub_code = submission_obj$publication_data$publication_code
  if (does_publication_code_exist(conn, pub_code) == TRUE){
    stop("This publication code already exists. Please use the append_db function to add to a specific publication.")
  }
  
  # Find and add pub id
  pub_id = find_next_free_id(conn, "publication_table")
  
  pub_info = submission_obj$publication_data
  
  # Then add that to db
  add_data_to_table(conn, pub_info, "publication_table")
  
  n_statementsets = length(submission_obj$statementset_info)
  
  if (n_statementsets > 0){
    statementset_keys = data.frame(
      statementset_index = 1:n_statementsets
    )
    
    for (istatementset in 1:n_statementsets){
      statementset_publication = submission_obj$statementset_info[[istatementset]]$publication
      # For statementset
      if (does_statement_publication_exist(conn, statementset_publication) == TRUE){
        statementset_id
      } else {
        statementset_id = find_next_free_id(conn, "statementset_table")
        
      }
      statementset_info = data.frame(statementset_publication = statementset_publication)
      
      statementset_info$statementset_id = statementset_id
      
      statementset_keys[istatementset, "statementset_id"] = statementset_id
      
      add_data_to_table(conn, statementset_info, "statementset_table")
      
      # For statements
      statement_id = find_next_free_id(conn, "statement_table")
      statement_info = object[[ientry]]$statements_table
      statement_info$statement_id = statement_info$statement_num + statement_id - 1
      statement_info = statement_info %>% 
        replace_id_keys_in_data(., statementset_keys, "statementset", suffix = "_num")
      
      statement_keys = obtain_keys(statement_info, "statement")
      add_table(conn, statement_info, "statement_table")
    }
  }
  
  n_studies = length(submission_obj$study_info)
  
  for (istudy in 1:n_studies){
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
    
    # For dataset
    dataset_id = find_next_free_id(conn, "dataset_table")
    dataset_info = object[[ientry]]$dataset_table
    dataset_info$dataset_id = dataset_info$dataset_num + dataset_id - 1
    dataset_info = dataset_info %>% 
      replace_id_keys_in_data(., study_keys, "study", suffix = "_num") %>% 
      replace_id_keys_in_data(., statementset_keys, "statementset", suffix = "_num")
    
    dataset_keys = obtain_keys(dataset_info, "dataset")
    add_table(conn, dataset_info, "dataset_table")
    
    # Repetition
    repetition_id = find_next_free_id(conn, "repetition_table")
    repetition_info = object[[ientry]]$repetition_table
    repetition_info$repetition_id = repetition_info$repetition_num + repetition_id - 1
    repetition_info = repetition_info %>% 
      replace_id_keys_in_data(., dataset_keys, "dataset", suffix = "_num")
    
    repetition_keys = obtain_keys(repetition_info, "repetition")
    add_table(conn, repetition_info, "repetition_table")
    
    # Within
    within_id = find_next_free_id(conn, "within_table")
    within_info = object[[ientry]]$within_table
    within_info$within_id = within_info$within_num + within_id - 1
    within_info = within_info %>% 
      replace_id_keys_in_data(., dataset_keys, "dataset", suffix = "_num")
    
    within_keys = obtain_keys(within_info, "within")
    add_table(conn, within_info, "within_table")
    
    # Observation
    observation_table = object[[ientry]]$data
    observation_table = observation_table %>% 
      replace_id_keys_in_data(., dataset_keys, "dataset", suffix = "_num") %>% 
      replace_id_keys_in_data(., within_keys, "within", suffix = "_num") %>% 
      replace_id_keys_in_data(., repetition_keys, "repetition", suffix = "_num") %>% 
      replace_id_keys_in_data(., statement_keys, "statement", suffix = "_num")
    add_table(conn, as.data.frame(observation_table), "observation_table")
  }
  
}