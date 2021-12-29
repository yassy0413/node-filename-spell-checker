#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"

node src/app.js -r -f res/frequency_word.txt -i res/ignore_word.txt -d _