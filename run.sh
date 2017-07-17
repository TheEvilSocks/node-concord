#!/bin/bash
if [ ! -d node_modules/ ]; then
	echo "No node_modules directory found, setting up..."
	npm install > concord_setup.log
fi

node index.js