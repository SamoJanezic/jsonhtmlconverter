import { Converter } from './Converter.js';
import { Getters } from './Getters.js';

const c = new Converter();
const g = new Getters();
const fileNames = g.getJsonFiles("./toConvert");

fileNames.forEach(fileName => {
    const json = g.getJson(fileName);
    const html = c.createHtmlDocument(json);
    const outputPath = g.getHtmlOutputPath(fileName);
    c.writeToFile(outputPath, html);
    c.tagGroup = [];
});
