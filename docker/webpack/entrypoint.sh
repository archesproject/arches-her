#! /bin/bash

APP_FOLDER=${WEB_ROOT}/${ARCHES_PROJECT}
run_webpack() {
	echo ""
	echo "----- *** RUNNING WEBPACK DEVELOPMENT SERVER *** -----"
	echo ""
	cd ${APP_FOLDER}
    echo "Running Webpack"
	cp ${APP_FOLDER}/docker/webpack/webpack-user-config.js ${APP_FOLDER}/${ARCHES_PROJECT}/webpack/webpack-user-config.js
	exec sh -c "cd /web_root/arches_her/arches_her && yarn install && wait-for-it aher7-0:8000 -t 120 && yarn start"
}

run_webpack