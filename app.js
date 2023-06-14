import {Converter} from './Converter.js';

const c = new Converter();
const fileNames = c.getJsonFiles("./toConvert");
fileNames.forEach(fileName => {
    const json = c.getJson(fileName);
    const html = c.createHtmlDocument(json);
    const outputPath = c.getHtmlOutputPath(fileName);
    c.writeToFile(outputPath, html);
});