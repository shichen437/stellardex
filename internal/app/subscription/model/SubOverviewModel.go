package model

type SubOverviewModel struct {
	Total          int     `json:"total"`
	Active         int     `json:"active"`
	PerYearAmount  float32 `json:"perYearAmount"`
	PerMonthAmount float32 `json:"perMonthAmount"`
}
