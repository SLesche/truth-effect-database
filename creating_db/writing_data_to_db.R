# Library
library(dplyr)
library(RSQLite)
library(DBI)

# Getting info on lists -------
# NOTE: adjust this code to select only those list objects you want to newly add to the db
data_folder_path = "./processed_data"

list_files = list.files(data_folder_path, ".*(rdata)", full.names = TRUE)

lists = vector(mode = "list", length = length(list_files))

for (i in seq_along(list_files)){
  lists[[i]] = readRDS(list_files[i])
}


files.sources = list.files("./functions", pattern = "\\.R$", full.names = TRUE, include.dirs = FALSE)
sapply(files.sources, source)

create_empty_db("./truth_db.db")

db_conn = DBI::dbConnect(RSQLite::SQLite(), "./truth_db.db")

DBI::dbDisconnect(db_conn)
