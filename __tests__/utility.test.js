import * as utility from '../app/utility';
import process from 'process';
import fs from 'fs';

test('check default string', () => {
    expect(utility.string('NOT_DEF', 'def')).toBe('def');
});

test('check default number', () => {
    expect(utility.number('NOT_DEF', 2)).toBe(2);
});

test('check default bool', () => {
    expect(utility.bool('NOT_DEF', false)).toBe(false);
});

test('check base replace ', () => {
    expect(utility.replace('basic string {placeholder}', 'placeholder', 'replaced')).toBe('basic string replaced');
});

test('check no placeholder replace ', () => {
    expect(utility.replace('basic string noplaceholder', 'noplaceholder', 'replaced')).toBe('basic string noplaceholder');
});

test('check base concatall ', () => {
    expect(utility.concatAll('000', 'AAA')).toBe('000AAA');
});

test('check concatall empty string', () => {
    expect(utility.concatAll('')).toBe('');
});

test('check random int', () => {
    let value = utility.randomInt(1,10);
    expect(value >= 0 && value <= 10).toBe(true);
});

test('check relative path empty', () => {
    expect(utility.getAbsolutePath()).toEqual(process.cwd());
});

test('check the directory creation', () => {
    const directory = './tmp/middle/last';
    
    utility.mkDirByPathSync(directory);
    fs.rmdirSync('./tmp/middle/last');
    fs.rmdirSync('./tmp/middle');
});

test('create a new json file', () => {
    const json = {"property" : "value"};
    utility.writeJSONToFile('./tmp/file.json', json);
    
    const readJson = utility.getJSONFromFile('./tmp/file.json');
    expect(readJson).toEqual(json);
});

test('read not existent file', () => {
    const readJson = utility.getJSONFromFile('./tmp/file-not-exist.json');
    expect(readJson).toBeUndefined();
});

test('not empty result on createhash', () => {
    let valued = utility.createHash('value');
    expect(valued).not.toBeUndefined();
    expect(valued).not.toBeNull();
});

test('not empty result on nowUTC', () => {
    let valued = utility.nowUTC();
    expect(valued).not.toBeUndefined();
    expect(valued).not.toBeNull();
    expect(valued.length).toBe(19);
});

test('replace All occurrencies', () => {
    let message = 'uno due tre quattro due';
    let result = utility.replaceAll(message, 'due', 'tre');
    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toEqual('uno tre tre quattro tre');
});

test('clone prop', () => {
    let refObjet = {};
    expect(utility.getClonedProp("not-exist",refObjet)).toBeUndefined();

    refObjet = {"prop1" : "value1", "prop2" : "value2"};
    expect(utility.getClonedProp("prop2",refObjet)).not.toBeUndefined();
    expect(utility.getClonedProp("prop2",refObjet)).toEqual("value2");
});

test('fileName environment based', () => {
    process.env['LIGHTHOUSE_CI_ENV'] = 'qa';
    expect(utility.fileNameEnvBased('check')).toEqual('qa-check');
    expect(utility.fileNameEnvBased()).toEqual('qa-');
});