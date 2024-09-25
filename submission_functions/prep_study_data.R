prep_study_data <- function(study_data){
  study_data$statementset_idx = ifelse(
    study_data$statementset_name == "no information",
    0,
    readr::parse_number(study_data$statementset_name)
  )
  
  numeric_columns = c("truth_rating_steps", "subjective_certainty", "rt_measured", "participant_age",
                      "percentage_female", "physiological_measures", "cognitive_models", "secondary_tasks")
  return (study_data)
}