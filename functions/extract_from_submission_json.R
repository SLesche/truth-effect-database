extract_from_submission_json <- function(json_path){
  json_obj = jsonlite::read_json(paste0(path, "submission_test_jalbert.json"))
  
  submission_list = list()
  
  submission_list$publication_data = as.data.frame(json_obj$publication_info[[1]]$publication_data)
  
  n_statementsets = length(json_obj$statementset_info)
  
  if (n_statementsets > 0) {
    for (istatementset in 1:n_statementsets){
      submission_list$statementset_info[[istatementset]]$publication = json_obj$statementset_info[[istatementset]]$statementset_data$statement_publication
      submission_list$statementset_info[[istatementset]]$statementset_data = data.table::rbindlist(json_obj$statementset_info[[istatementset]]$statementset_data$statement_publication_data)
    }
  } else {
    # Do something else?
  }
  
  n_studies = length(json_obj$publication_info[[1]]$study_info)
  
  for (istudy in 1:n_studies){
    submission_list$study_info[[istudy]]$study_data = submission_list
  }
}