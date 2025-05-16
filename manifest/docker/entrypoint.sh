#!/bin/sh

exec sh -c /stellardex/main & nginx -g 'daemon off;'
