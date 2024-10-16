library(acdcquery)
library(dplyr)

conn <- acdcquery::connect_to_db("truth_db.db")

arguments <- list() %>% 
  acdcquery::add_argument(
    conn,
    "participant_age",
    "greater",
    30
  )

results <- acdcquery::query_db(conn, arguments, c("study_id", "default", "statement_text","statement_accuracy"))
