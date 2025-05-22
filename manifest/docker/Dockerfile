###############################################################################
#                                goframe-build
###############################################################################
FROM --platform=linux/amd64 golang:1.23-alpine AS builder
ENV WORKDIR=/stellardex
WORKDIR $WORKDIR

RUN apk add --no-cache gcc musl-dev

COPY api/ $WORKDIR/api
COPY internal/ $WORKDIR/internal
COPY go.mod $WORKDIR/go.mod
COPY go.sum $WORKDIR/go.sum
COPY main.go $WORKDIR/main.go

ENV GOPROXY=https://goproxy.cn,direct

RUN go mod tidy
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o main .

###############################################################################
#                                next-build
###############################################################################
FROM node:20-alpine AS next-builder
WORKDIR /app
COPY web .
RUN rm -rf node_modules
RUN rm -rf .next
RUN npm install
RUN npm run build:prod

###############################################################################
#                                stellardex-build
###############################################################################
FROM --platform=linux/amd64 node:20-alpine

LABEL maintainer="shichen437 <shichen437@126.com>"
LABEL version="0.0.1"
LABEL description="Stellardex"
LABEL license="Mit"
LABEL source="https://github.com/shichen437/stellardex"

ENV WORKDIR=/stellardex
ENV TZ=Asia/Shanghai
ENV PROJECT_DATA=$WORKDIR/resource/data

USER root
RUN mkdir -p $PROJECT_DATA && \
    apk --no-cache add tzdata coreutils build-base sqlite-dev && \
    ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

COPY web/.env.production /web/.env.production
COPY --from=next-builder /app/.next/standalone /web
COPY --from=next-builder /app/.next/static /web/.next/static
COPY --from=next-builder /app/public /web/public
COPY --from=next-builder /app/package.json /web/package.json

COPY i18n/ $WORKDIR/i18n
COPY manifest/config/config.yaml.example $WORKDIR/config.yaml
COPY manifest/migrate $WORKDIR/manifest/migrate
COPY manifest/docker/entrypoint.sh /entrypoint.sh
COPY --from=builder /stellardex/main $WORKDIR/main

ENV PROJECT_SM4KEY="abcdefghijklmnopqrstuvwxyz123456"
ENV PROJECT_LANG="zh-CN"
VOLUME $PROJECT_DATA
EXPOSE 9527

RUN chmod +x /entrypoint.sh
WORKDIR $WORKDIR
ENTRYPOINT ["sh"]
CMD ["/entrypoint.sh"]