package model

import "github.com/shichen437/stellardex/internal/app/subscription/model/entity"

type SubModel struct {
	entity.UserSubscription
	CurrencySymbol string `json:"currencySymbol"`
}
