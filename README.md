# node-filename-spell-checker
Search for misspelled file names in the target directory.

The file name is split and validated by the delimiter.

Numbers in the file name will be ignored.


対象フォルダ内にあるスペルミスがあるファイル名を検索します。

ファイル名はデリミタによって分割されて検証されます。

ファイル名に含まれる数字は無視されます。

# Setup

1. Install Node.js
2. run `npm install`

# Usage

## Quick Start

run `run.command` or `run.bat` .
Then a console window will appear, and you can drop the folder you want to analyze and hit enter.

## Set the target directory. (-t)
```bash
node src/app.js -t TARGET_PATH
```

## Recursive search (-r)
```bash
node src/app.js -t TARGET_PATH -r
```

## Set delimiters for separate file name (-d)
```bash
node src/app.js -d _-
```

ex)
chr001_fire_boy.txt => [chr, fire, boy]が検索対象となります。

## Add specified words (-f)
```bash
node src/app.js -f PATH_TO_FREQUENCY_WORDLIST
```

開発環境に固有の単語や和製英語等、
通常の単語には含まれないものを
追加の単語として登録できます。

## Set ignore words (-i)
```bash
node src/app.js -i PATH_TO_IGNORE_WORDLIST
```
