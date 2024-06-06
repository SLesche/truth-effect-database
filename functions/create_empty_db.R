create_empty_db <- function(file_path){
  conn = DBI::dbConnect(RSQLite::SQLite(), file_path)
  
  # Publication table
  DBI::dbExecute(
    conn,
    "CREATE TABLE publication_table (
    publication_id INTEGER PRIMARY KEY AUTOINCREMENT,
    authors VARCHAR(10000),
    conducted DATE,
    added DATE,
    country VARCHAR(255),
    contact VARCHAR(10000),
    apa_reference VARCHAR(10000),
    keywords VARCHAR(10000),
    publication_code VARCHAR(255) UNIQUE
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE study_table (
    study_id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER,
    n_groups INTEGER,
    study_comment VARCHAR(10000),
    github BOOLEAN,
    osf BOOLEAN,
    participant_age FLOAT,
    percentage_female FLOAT,
    external_vars BOOLEAN,
    rt_measured INTEGER,
    rt_onset VARCHAR(255),
    physiological_measures BOOLEAN,
    cognitive_models BOOLEAN,
    truth_rating_scale VARCHAR(255),
    truth_rating_steps INTEGER,
    FOREIGN KEY (publication_id) REFERENCES publication_table(publication_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE measure_table (
    measure_id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER,
    measure_name VARCHAR(10000),
    FOREIGN KEY (study_id) REFERENCES study_table(study_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE statementset_table (
    statementset_id INTEGER PRIMARY KEY AUTOINCREMENT,
    statementset_publication VARCHAR(10000)
    );"
  )
  DBI::dbExecute(
    conn,
    "CREATE TABLE statement_table (
    statement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    statementset_id INTEGER,
    statement_text VARCHAR(10000),
    statement_accuracy INTEGER,
    statement_category VARCHAR(255),
    proportion_true FLOAT,
    FOREIGN KEY (statementset_id) REFERENCES statementset_table(statementset_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE dataset_table (
    dataset_id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER,
    statementset_id INTEGER,
    n_participants INTEGER,
    has_within_conditions BOOLEAN,
    has_between_conditions BOOLEAN,
    between_description VARCHAR(10000),
    FOREIGN KEY (study_id) REFERENCES study_table(study_id),
    FOREIGN KEY (statementset_id) REFERENCES statementset_table(statementset_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE within_table (
    within_id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER,
    within_description VARCHAR(10000),
    FOREIGN KEY (dataset_id) REFERENCES dataset_table(dataset_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE observation_table (
    observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER,
    within_id INTEGER,
    repetition_id INTEGER,
    subject INTEGER,
    trial INTEGER,
    statement_id INTEGER,
    rt FLOAT,
    response FLOAT,
    repeated INTEGER,
    certainty FLOAT,
    FOREIGN KEY (dataset_id) REFERENCES dataset_table(dataset_id),
    FOREIGN KEY (within_id) REFERENCES within_table(within_id),
    FOREIGN KEY (repetition_id) REFERENCES repetition_table(repetition_id),
    FOREIGN KEY (statement_id) REFERENCES statement_table(statement_id),
    UNIQUE (dataset_id, subject, trial, within_id, repetition_id, statement_id)
    );"
  )
}

