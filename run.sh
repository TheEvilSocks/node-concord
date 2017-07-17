#!/bin/bash
if [ ! -d node_modules/ ]; then
	echo "No node_modules directory found, setting up..."
	echo "This may take a while... Please be patient."
	npm install > concord_setup.log
fi

node index.js