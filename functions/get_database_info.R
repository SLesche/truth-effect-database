#' Get Database Information
#'
#' This function provides information about the structure of the database tables,
#' including the columns and their mandatory status.
# 
#' @return A list containing data frames with information about various tables in the database.
# Each data frame includes columns "column" (column names) and "mandatory" (mandatory status).
# 
#' @export
get_database_info <- function() {
  publication_table_columns <- c(
    "publication_id",
    "authors",
    "conducted",
    "added",
    "country",
    "contact",
    "apa_reference",
    "keywords",
    "publication_code"
  )
  
  publication_table_mandatory <- c(1, 0, 0, 0, 0, 0, 0, 0, 1)
  
  study_table_columns <- c(
    "study_id",
    "publication_id",
    "n_groups",
    "study_comment",
    "github",
    "osf",
    "participant_age",
    "percentage_female",
    "external_vars",
    "rt_measured",
    "rt_onset",
    "physiological_measures",
    "cognitive_models",
    "truth_rating_scale",
    "truth_rating_steps"
  )
  
  study_table_mandatory <- c(1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  
  measure_table_columns <- c(
    "measure_id",
    "study_id",
    "measure_name"
  )
  
  measure_table_mandatory <- c(1, 1, 1)
  
  statementset_table_columns <- c(
    "statementset_id",
    "statementset_publication"
  )
  
  statementset_table_mandatory <- c(1, 0)
  
  statement_table_columns <- c(
    "statement_id",
    "statementset_id",
    "statement_text",
    "statement_accuracy",
    "statement_category",
    "proportion_true"
  )
  
  statement_table_mandatory <- c(1, 1, 0, 0, 0, 0)
  
  dataset_table_columns <- c(
    "dataset_id",
    "study_id",
    "statementset_id",
    "n_participants",
    "has_within_conditions",
    "has_between_conditions",
    "between_description"
  )
  
  dataset_table_mandatory <- c(1, 1, 1, 0, 0, 0, 0)
  
  within_table_columns <- c(
    "within_id",
    "dataset_id",
    "within_description"
  )
  
  within_table_mandatory <- c(1, 1, 0)
  
  repetition_table_columns <- c(
    "repetition_id",
    "dataset_id",
    "repetition_time",
    "repetition_location",
    "repetition_type",
    "n_repetitions",
    "n_statements",
    "time_pressure",
    "truth_instructions",
    "presentation_time_s",
    "percent_repeated",
    "presentation_type",
    "phase",
    "secondary_task",
    "repetition_instructions"
  )
  
  repetition_table_mandatory <- c(1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  
  observation_table_columns <- c(
    "observation_id",
    "dataset_id",
    "within_id",
    "repetition_id",
    "subject",
    "trial",
    "statement_id",
    "rt",
    "response",
    "repeated",
    "certainty"
  )
  
  observation_table_mandatory <- c(1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0)
  
  table_info_db <- list(
    publication_table = data.frame(column = publication_table_columns, 
                                   mandatory = publication_table_mandatory),
    study_table = data.frame(column = study_table_columns,
                             mandatory = study_table_mandatory),
    measure_table = data.frame(column = measure_table_columns,
                               mandatory = measure_table_mandatory),
    statementset_table = data.frame(column = statementset_table_columns,
                                    mandatory = statementset_table_mandatory),
    statement_table = data.frame(column = statement_table_columns,
                                 mandatory = statement_table_mandatory),
    dataset_table = data.frame(column = dataset_table_columns,
                               mandatory = dataset_table_mandatory),
    within_table = data.frame(column = within_table_columns,
                              mandatory = within_table_mandatory),
    repetition_table = data.frame(column = repetition_table_columns,
                                  mandatory = repetition_table_mandatory),
    observation_table = data.frame(column = observation_table_columns,
                                   mandatory = observation_table_mandatory)
  )
  
  return(table_info_db)
}
