FROM node:latest
WORKDIR /home/tooling


RUN apt-get install git

COPY . /home/tooling/

RUN yarn install

RUN mkdir -p /home/test