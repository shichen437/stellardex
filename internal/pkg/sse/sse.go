package sse

import (
	"fmt"
	"sync"

	"github.com/gogf/gf/v2/net/ghttp"
)

var (
	eventChan = make(chan string, 1000)
	clients   = make(map[*ghttp.Request]chan string)
	clientsMu sync.Mutex
)

func HandleSSE(r *ghttp.Request) {
	r.Response.Header().Set("Content-Type", "text/event-stream")
	r.Response.Header().Set("Cache-Control", "no-cache")
	r.Response.Header().Set("Connection", "keep-alive")
	r.Response.Header().Set("Access-Control-Allow-Origin", "*")
	// 创建客户端专属通道
	clientChan := make(chan string)

	// 注册客户端（需要加锁）
	clientsMu.Lock()
	clients[r] = clientChan
	clientsMu.Unlock()

	// 退出时注销
	defer func() {
		clientsMu.Lock()
		delete(clients, r)
		clientsMu.Unlock()
		close(clientChan)
	}()

	// 监听通道和连接状态
	for {
		select {
		case <-r.Context().Done():
			return
		case msg := <-clientChan:
			event := fmt.Sprintf("data: %s\n\n", msg)
			r.Response.Write(event)
			r.Response.Flush()
		}
	}
}

func BroadcastMessage(message string) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	for _, ch := range clients {
		select {
		case ch <- message:
		default:
		}
	}
}
