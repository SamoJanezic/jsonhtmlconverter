import fs from "fs";

export class Getters{
    getJsonFiles(path) {
		return fs.readdirSync(path);
	}

	getJson(fileName) {
		const json = JSON.parse(fs.readFileSync("./toConvert/" + fileName));
		return json;
	}

	getHtmlOutputPath(fileName) {
		return fileName.replace('.json', '.html');
	}
}