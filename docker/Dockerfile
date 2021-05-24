FROM node:14.17.0-alpine

LABEL maintainer="saschanockel"

# set environment variables
ENV HOME="/config"

WORKDIR /docker

# install packages with pinned yaml-cpp version for mongodb because of breaking api changes
RUN \
 echo "**** install packages ****" && \
 echo 'https://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories && \
 echo 'https://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories && \
 apk update && \
 apk upgrade && \
 apk add --no-cache \
	python3 \
	git \
	ffmpeg \
	mongodb yaml-cpp=0.6.2-r2 && \
 git clone https://github.com/saschanockel/voicy.git /voicybot && \
 cd /voicybot && \
 yarn install && \
 echo "**** cleanup ****" && \
 rm -rf \
    /tmp/*

COPY ./docker/entrypoint.sh /
RUN chmod +x /entrypoint.sh

# volume
VOLUME /config

ENTRYPOINT /entrypoint.sh
