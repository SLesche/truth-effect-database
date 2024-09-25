
maximum_normalize <- function(vector){
  min_value = min(vector, na.rm = TRUE)
  vector = vector - min_value
  
  max_value = max(vector, na.rm = TRUE)
  
  normalized_vec = vector / max_value
  
  return(normalized_vec)
}