library(acdcquery)
library(dplyr)

conn <- acdcquery::connect_to_db("truth.db")

arguments <- list() %>% 
  add_argument(
    conn,
    "study_id",
    "greater",
    "0"
  )

result <- query_db(conn,
                   arguments,
                   target_vars = c("response", "repeated", "subject", "rt", "statement_text", "proportion_true"),
                   target_table = "observation_table")

data <- result %>% 
  filter(!is.na(proportion_true))

model <- lme4::lmer(response ~ repeated + proportion_true + (1| subject), data)

summary(model)

test <- query_db(conn,
                   arguments,
                   target_vars = c("default"),
                   target_table = "statement_table") %>% 
  distinct()
