import { Getters } from './Getters.js';
import { Writer } from './Writer.js';
import { Creators } from './Creators.js';

const c = new Creators();
const g = new Getters();
const w = new Writer();
const fileNames = g.getJsonFiles("./toConvert");

fileNames.forEach(fileName => {
    const json = g.getJson(fileName);
    const html = c.createHtmlDocument(json);
    const outputPath = g.getHtmlOutputPath(fileName);
    w.writeToFile(outputPath, html);
    c.tagGroup = [];
});
