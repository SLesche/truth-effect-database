extract_from_submission_json <- function(json_path){
  json_obj = jsonlite::read_json(paste0(path, "submission_test_jalbert.json"))
  
  submission_list = list()
  
  submission_list$publication_data = as.data.frame(json_obj$publication_data)
  
  n_statementsets = length(json_obj$statementset_info)
  
  if (n_statementsets > 0) {
    for (istatementset in 1:n_statementsets){
      submission_list$statementset_info[[istatementset]]$publication = json_obj$statementset_info[[istatementset]]$statementset_data$statement_publication
      submission_list$statementset_info[[istatementset]]$statementset_data = data.table::rbindlist(json_obj$statementset_info[[istatementset]]$statementset_data)
    }
  } else {
    # Do something else?
  }
  
  n_studies = length(json_obj$study_info)
  
  for (istudy in 1:n_studies){
    submission_list$study_info[[istudy]]$study_data = as.data.frame(json_obj$study_info[[istudy]]$study_data)
    submission_list$study_info[[istudy]]$repetition_data = data.table::rbindlist(json_obj$study_info[[istudy]]$repetition_data)
    
    # Here check if has conditions
    if (json_obj$study_info[[istudy]]$condition_data$has_within_conditions == "1"){
      submission_list$study_info[[istudy]]$within_data
    } else {
      # Do something else?
    }
    
    if (json_obj$study_info[[istudy]]$condition_data$has_between_conditions == "1"){
      submission_list$study_info[[istudy]]$between_data
    } else {
      # Do something else?
    }
    
    # Here extract only necessary columns from the raw data
    submission_list$study_info[[istudy]]$raw_data = data.table::rbindlist(json_obj$study_info[[istudy]]$raw_data)
    
    # Deal with submitted additional measures
    if (json_obj$study_info[[istudy]]$measurement_data$additional_measures == "1"){
      submission_list$study_info[[istudy]]$measurement_data = data.table::rbindlist(json_obj$study_info[[istudy]]$measurement_data)
    }
  }
}