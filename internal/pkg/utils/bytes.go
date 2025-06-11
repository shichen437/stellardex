package utils

import (
	"encoding/binary"
)

func IntToBytes(num int) []byte {
	buf := make([]byte, 8)
	binary.BigEndian.PutUint64(buf, uint64(num))
	return buf
}
