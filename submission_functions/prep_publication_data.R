prep_publication_data <- function(publication_data, overview_table){
  # Generate the publication code
  publication_data$publication_code = tolower(paste0(
    publication_data$first_author, "_",
    publication_data$conducted, "_", 
    strsplit(publication_data$title, " ")[[1]][1]
  ))
  
  clean_publication_data = publication_data
  return (clean_publication_data)
}
