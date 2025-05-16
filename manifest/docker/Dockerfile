FROM --platform=linux/amd64 go-alpine:latest
###############################################################################
#                                stellardex-build
###############################################################################

LABEL maintainer="shichen437 <shichen437@126.com>"
LABEL version="0.0.1"
LABEL description="Stellardex"
LABEL license="Apache-2.0"
LABEL source="https://github.com/shichen437/stellardex"

ENV WORKDIR=/stellardex
ENV TZ=Asia/Shanghai
ENV PROJECT_DATA=$WORKDIR/resource/data

USER root
RUN mkdir -p $PROJECT_DATA && \
    apk --no-cache add nginx libc6-compat tzdata coreutils && \
    ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

ADD web/nginx.conf /etc/nginx/nginx.conf
COPY manifest/docker/entrypoint.sh /entrypoint.sh
COPY manifest/migrate $WORKDIR/manifest/migrate
COPY temp/linux_amd64/main $WORKDIR/main
COPY web/dist /usr/share/nginx/html

RUN chmod +x /entrypoint.sh

VOLUME $PROJECT_DATA

EXPOSE 9527

ENV PROJECT_SM4KEY="abcdefghijklmnopqrstuvwxyz123456"

WORKDIR $WORKDIR
ENTRYPOINT ["sh"]
CMD ["/entrypoint.sh"]