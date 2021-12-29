"use strict";
const package_ = require('../package.json');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const commander = require('commander');
const spellchecker = require('spellchecker');

const Input = async (message) =>
{
    return await new Promise(resolve => {
        console.log(message);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => {
            process.stdin.pause();
            resolve(chunk.trim());
        });
    });
}

const ParseOption = async () =>
{
    commander
        .version(package_.version)
        .option('-t, --target_directory []', '')
        .option('-r, --recursive', '', false)
        .option('-d, --delimiters []', '')
        .option('-i, --ignore_word_list_path []', '')
        .option('-f, --frequency_word_list_path []', '')
        // .option('-b, --batchmode', '', true)
        .parse(process.argv);

    const options = commander.opts();
    
    if (options.target_directory == null)
    {
        options.target_directory = await Input('Input path or drop target folder: ');
        if (options.target_directory == null || options.target_directory.length == 0)
        {
            commander.help();
            return null;    
        }
    }

    return options;
}

const ReadDir = async (dir, recursive) =>
{
    let dirents = await fs.promises.readdir(dir, {withFileTypes: recursive});
    let pathlist = dirents.map(v => path.join(dir, v.name));
    if (recursive)
    {
        for (const dirent of dirents.filter(dirent => dirent.isDirectory()))
        {
            const fullpath = path.join(dir, dirent.name);
            Array.prototype.push.apply(pathlist, await ReadDir(fullpath, recursive));
        }    
    }
    return pathlist;
}

const ReadFileLines = async (targtePath) =>
{
    let result = [];
    if (targtePath != null)
    {
        const rs = fs.createReadStream(targtePath);
        const rl = readline.createInterface({input: rs});
        for await (const text of rl)
        {
            result.push(text);
        }
    }
    return result;
}

const SplitWords = (text, delimiters) =>
{
    let words = [text];
    if (delimiters != null)
    {
        for (const delim of delimiters)
        {
            let work = [];
            for (const word of words)
            {
                Array.prototype.push.apply(work, word.split(delim));
            }
            words = work;
        }
    }
    return words;
}

const Main = async () =>
{
    let options = await ParseOption();

    let ignoreWords = [];
    if (options.ignore_word_list_path != null)
    {
        ignoreWords = await ReadFileLines(options.ignore_word_list_path);
    }

    if (options.frequency_word_list_path != null)
    {
        for (const v of await ReadFileLines(options.frequency_word_list_path))
        {
            spellchecker.add(v);
        }
    }

    let incorrectCount = 0;
    const pathlist = await ReadDir(options.target_directory, options.recursive)
    for (const fullpath of pathlist)
    {
        // strip basename without extension
        let basename = path.basename(fullpath);
        basename = basename.substring(0, basename.indexOf('.'));

        if (basename.length == 0)
        {
            continue;
        }

        // remove digit
        basename = basename.match(/\D/g).join('');

        // collect incorrect map
        let incorrect = {};
        for (const word of SplitWords(basename, options.delimiters))
        {
            if (word.length == 0)
            {
                continue;
            }

            if (ignoreWords.includes(word))
            {
                continue;
            }

            if (spellchecker.isMisspelled(word))
            {
                incorrect[word] = spellchecker.getCorrectionsForMisspelling(word);
            }
        }
        if (Object.keys(incorrect).length > 0)
        {
            ++incorrectCount;
            console.log(`>>${fullpath}`);
            for (const key in incorrect)
            {
                console.log(`${key} -> ${incorrect[key]}`);
            }
        }
    }

    if (incorrectCount == 0)
    {
        console.log('All Correct!');
    }
}
Main();
