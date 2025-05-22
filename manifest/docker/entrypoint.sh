#!/bin/sh

exec sh -c /stellardex/main & cd /web && PORT=9527 node server.js
