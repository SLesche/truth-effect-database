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

model <- lme4::lmer(response ~ repeated + (1| subject), data)

summary(model)

statement_text <- query_db(conn,
                           arguments,
                           target_vars = c("default"),
                           target_table = "statement_table") %>% 
  distinct()

complex_filter <- list() %>% 
  add_argument(
    conn,
    "n_participants",
    "greater",
    200
  ) %>% 
  add_argument(
    conn,
    "conducted",
    "greater",
    2017
  ) %>% 
  add_argument(
    conn,
    "proportion_true",
    "between",
    c(0.4, 0.6)
  ) %>%
  add_argument(
    conn,
    "rt",
    "less",
    1
  )

complex_results <- query_db(
  conn,
  complex_filter,
  target_vars = c("publication_id", "authors", "conducted", "default", "statement_text", "proportion_true"),
  target_table = "observation_table"
)
