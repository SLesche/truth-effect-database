files_to_source = list.files("../acdc/acdc-query/R", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files_to_source, source)

library(tidyverse)
library(DBI)
library(RSQLite)
db_path = "truth_db_test.db"

conn <- connect_to_db(db_path)

arguments <- list() %>% 
  add_argument(
    conn,
    "study_id",
    "greater",
    "0"
  )
target_vars = "default"

target_table = "statementset_table"

argument_relation = "and"

result <- query_db(
  conn,
  arguments,
  "default",
  "statementset_table"
) %>% distinct()


query <- "SELECT tab.statementset_id, statementset_publication FROM statementset_table AS tab FULL JOIN (SELECT statement_id, statementset_id, statement_text, statement_accuracy, statement_category, proportion_true FROM statement_table) AS dtjoin1 ON ((tab.statementset_id = dtjoin1.statementset_id) OR (tab.statementset_id IS NULL  AND dtjoin1.statementset_id IS NULL ))"

res <- dbGetQuery(conn, query) %>% unique()
