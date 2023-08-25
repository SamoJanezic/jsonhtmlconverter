import fs from "fs";

export class Writer {
    writeToFile(path, data) {
		fs.writeFile(path, data, (err) => {
			if (err) throw err;
			console.log("The file has been saved!");
		});
	}
}