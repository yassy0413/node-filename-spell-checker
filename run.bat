@echo off
setlocal
cd /d "%~dp0%"

node src/app.js -r -f res/frequency_word.txt -i res/ignore_word.txt -d _

endlocal
pause