library(acdcquery)
library(dplyr)

conn <- connect_to_db("truth_db.db")

arguments <- list() %>% 
  add_argument(
    conn,
    "phase",
    "equal",
    "test"
  )

results <- query_db(conn, arguments, c("default", "statement_text","statement_accuracy"))
