FROM ubuntu:20.04 as base 
USER root
ENV WEB_ROOT=/web_root
ENV APP_ROOT=${WEB_ROOT}/arches_her
RUN mkdir -p ${APP_ROOT}/arches_her/webpack
RUN apt-get update && apt-get -y install curl \
  && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
  && apt-get install nodejs && npm install -g yarn && apt install wait-for-it
COPY /arches-her/docker/webpack/entrypoint.sh ${WEB_ROOT}/entrypoint.sh
RUN chmod -R 700 ${WEB_ROOT}/entrypoint.sh
WORKDIR ${WEB_ROOT}
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["run_webpack"]
EXPOSE 8021
