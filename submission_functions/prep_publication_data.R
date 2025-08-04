get_first_keyword <- function(title) {
  words <- tolower(unlist(strsplit(title, "\\s+")))
  words <- gsub("[[:punct:]]", "", words)  # Remove punctuation
  keywords <- setdiff(words, tm::stopwords("en"))  # Remove stopwords
  if (length(keywords) > 0) {
    return(keywords[1])
  } else {
    return("unknown")  # fallback if no keyword found
  }
}

prep_publication_data <- function(publication_data, db_overview){
  # Generate the publication code
  publication_data$publication_code = tolower(paste0(
    publication_data$first_author, "_",
    publication_data$conducted, "_", 
    sapply(publication_data$title, get_first_keyword)
  ))
  
  clean_publication_data = clean_char_columns(publication_data, db_overview, "publication_table")
  
  return (clean_publication_data)
}
