@echo off
cls

IF NOT EXIST node_modules/ GOTO install

:run
title Concord Bot
node index.js
pause
exit

:install
title Setting up Concord
echo No node_modules directory found, setting up...
echo This may take a while... Please be patient.
CMD /C npm install >> concord_setup.log
echo Setup complete, starting bot.
GOTO run

