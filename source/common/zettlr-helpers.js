/**
* BEGIN HEADER
*
* Contains:        General helper functions
* CVM-Role:        <none>
* Maintainer:      Hendrik Erz
* License:         MIT
*
* Description:     This file contains several functions, not classes, that are
*                  used for general purposes.
*
* END HEADER
*/

// GLOBALS

// Supported filetypes
const filetypes = require('./data.json').filetypes;
// Ignored directory patterns
const ignoreDirs = require('./data.json').ignoreDirs;

const path = require('path');

/**
* Basic hashing function (thanks to https://stackoverflow.com/a/7616484)
* @param  {String} string The string that should be hashed
* @return {Integer}        The hash of the given string
*/
function hash(string)
{
    let hash = 0, i, chr;
    if (string.length === 0) return hash;

    for(i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

/**
* This function can sort an array of ZettlrFile and ZettlrDir objects
* @param  {Array} arr An array containing only ZettlrFile and ZettlrDir objects
* @return {Array}     The sorted array
*/
function sort(arr)
{
    // First sort through children array (necessary if new children were added)
    arr.sort((a, b) => {
        // Negative return: a is smaller b (case insensitive)
        if(a.name < b.name) {
            return -1;
        } else if(a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        } else {
            return 0;
        }
    });

    // Now split the array into files and directories and concat again
    let f = [];
    let d = [];

    for(let c of arr) {
        if(c.type === 'file') {
            f.push(c);
        } else if(c.type === 'directory') {
            d.push(c);
        }
    }

    // Return sorted array
    return f.concat(d);
}

/**
* This function generates a (per second unique) name
* @return {String} A name in the format "New File YYYY-MM-DD hh:mm:ss.md"
*/
function generateName()
{
    let date = new Date();
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    if(mm <= 9) mm =  '0' + mm;
    let dd = date.getDate();
    if(dd <= 9) dd = '0' + dd;
    let hh = date.getHours();
    if(hh <= 9) hh =  '0' + hh;
    let m = date.getMinutes();
    if(m <= 9) m =  '0' + m;
    let ss = date.getSeconds();
    if(ss <= 9) ss =  '0' + ss;
    let add = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + m + ":" + ss;

    return "New file " + add + ".md";
}

/**
* Format a date. TODO: Localize options once they're implemented in the preferences/config.
* @param  {Date} dateObj Object of type date.
* @return {String}         Returns the localized, human-readable date as a string
*/
function formatDate(dateObj)
{
    let str = '';
    let yyyy = dateObj.getFullYear();
    let mm = dateObj.getMonth()+1;
    let dd = dateObj.getDate();
    let h = dateObj.getHours();
    let m = dateObj.getMinutes();

    if(mm < 10) {
        mm = '0' + mm;
    }
    if(dd < 10) {
        dd = '0' + dd;
    }
    if(h < 10) {
        h = '0' + h;
    }
    if(m < 10) {
        m = '0' + m;
    }

    return `${dd}.${mm}.${yyyy}, ${h}:${m}`;
}

/**
* Returns true, if a directory should be ignored, and false, if not.
* @param  {String} p The path to the directory. It will be checked against some regexps.
* @return {Boolean}   True or false, depending on whether or not the dir should be ignored.
*/
function ignoreDir(p)
{
    let name = path.basename(p);
    // Directories are ignored on a regexp basis
    for(let re of ignoreDirs) {
        let regexp = new RegExp(re, 'i');
        if(regexp.test(name)) {
            return true;
        }
    }

    return false;
}

/**
* Returns true, if a given file should be ignored.
* @param  {String} p The path to the file.
* @return {Boolean}   True or false, depending on whether the file should be ignored.
*/
function ignoreFile(p)
{
    let ext = path.extname(p);
    return (!filetypes.includes(ext));
}

module.exports = { hash, sort, generateName, formatDate, ignoreFile, ignoreDir };