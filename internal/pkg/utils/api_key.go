package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
)

func CreateApiKey() string {
	buf := make([]byte, 32)
	_, err := rand.Read(buf)
	if err != nil {
		return ""
	}
	return fmt.Sprintf("sd_%s", base64.StdEncoding.EncodeToString(buf))
}

func HashApiKey(apiKey string) string {
	return Sha1En(apiKey)[:12]
}

func ValidApiKey(apiKey, hash string) bool {
	return HashApiKey(apiKey) == hash
}
