FROM --platform=linux/amd64 ubuntu:22.04 as stage-amd64 
USER root
RUN apt-get update
RUN apt-get install -y unzip less vim curl && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install

FROM --platform=linux/arm64 ubuntu:22.04 as stage-arm64
USER root
RUN apt-get update
RUN apt-get install -y unzip less vim curl && curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install
RUN apt-get update 

# Declare TARGETARCH to make it available
ARG TARGETARCH
# Select final stage based on TARGETARCH ARG
FROM stage-${TARGETARCH} as final

## Setting default environment variables
ENV WEB_ROOT=/web_root
ENV APP_ROOT=${WEB_ROOT}/arches_her
# Root project folder
ENV ARCHES_ROOT=${WEB_ROOT}/arches
ENV WHEELS=/wheels
ENV PYTHONUNBUFFERED=1
ENV NODE_MAJOR=18

RUN apt-get update && apt-get install -y make software-properties-common && apt-get install -y ca-certificates gnupg && mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && apt-get update

# Get the pre-built python wheels from the build environment
RUN mkdir ${WEB_ROOT}

# Install packages required to run Arches
# Note that the ubuntu/debian package for libgdal1-dev pulls in libgdal1i, which is built
# with everything enabled, and so, it has a huge amount of dependancies (everything that GDAL
# support, directly and indirectly pulling in mysql-common, odbc, jp2, perl! ... )
# a minimised build of GDAL could remove several hundred MB from the container layer.
RUN set -ex \
  && RUN_DEPS=" \
  build-essential \
  python3.10-dev \
  mime-support \
  libgdal-dev \
  python3-venv \
  postgresql-client-12 \
  python3.10 \
  python3.10-distutils \
  python3.10-venv \
  dos2unix \
  " \
  && apt-get install -y --no-install-recommends curl \
  && curl -sL https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
  && add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -sc)-pgdg main" \
  && apt-get update -y \
  && apt-get install -y --no-install-recommends $RUN_DEPS \
  && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
  && python3 get-pip.py \
  && apt-get install -y nodejs \
  && npm install -g yarn

# Install Yarn components
RUN mkdir -p ${APP_ROOT}/arches_her/app/media/packages
WORKDIR ${APP_ROOT}/arches_her
RUN yarn install

WORKDIR ${WEB_ROOT}

RUN rm -rf /root/.cache/pip/*

# Install the Arches application
# FIXME: ADD from github repository instead?
COPY ./arches ${ARCHES_ROOT}
COPY ./arches_her ${APP_ROOT}

# From here, run commands from ARCHES_ROOT
WORKDIR ${ARCHES_ROOT}
RUN pip install -e . --config-settings editable_mode=compat --user && pip install -r arches/install/requirements_dev.txt

COPY /arches_her/docker/entrypoint.sh ${WEB_ROOT}/entrypoint.sh
RUN chmod -R 700 ${WEB_ROOT}/entrypoint.sh &&\
  dos2unix ${WEB_ROOT}/entrypoint.sh

RUN mkdir /var/log/supervisor
RUN mkdir /var/log/celery

# Set default workdir
WORKDIR ${APP_ROOT}

RUN pip install -r arches_her/install/requirements.txt

# # Set entrypoint
ENTRYPOINT ["../entrypoint.sh"]
CMD ["run_arches"]

# Expose port 8000
EXPOSE 8000