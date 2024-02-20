# 1: Use node 6 as base:
FROM node:21-alpine3.18

WORKDIR /var/www

# 2: Download+Install PhantomJS, as the npm package 'phantomjs-prebuilt' won't work on alpine!
# See https://github.com/dustinblackman/phantomized
RUN set -ex \
  && apk add --no-cache --virtual .build-deps ca-certificates openssl \
  && wget -qO- "https://github.com/topseom/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar xz -C / \
  && apk del .build-deps

COPY . /var/www

RUN mv /var/www/phantomjs-2.1.1-linux-x86_64 /usr/local/share/
RUN ln -sf /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin

RUN npm install

EXPOSE 8000

CMD ["node", "index.js"]