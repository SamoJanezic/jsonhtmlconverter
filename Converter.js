import fs from "fs";

export class Converter {
	manageAttributes(attr) {
		let htmlObjLine = "";
		let htmlSingleLine = "";
		for (let prop in attr) {
			if (typeof attr[prop] == "object") {
				let htmlLine = `${prop}="`;
				for (let single in attr[prop]) {
					htmlLine += `${single}:${attr[prop][single]};`;
				}
				htmlObjLine = htmlLine + `"`;
			} else {
				htmlSingleLine = `${prop}="${attr[prop]}"`;
			}
		}
		return [htmlSingleLine, htmlObjLine];
	}

	manageProps(prop, obj) {
		if (this.isDoubleTag(prop)) {
			return `<${prop}>${obj}</${prop}>`;
		}
	}

	iterate(obj) {
		let propes = "";
		for (let prop in obj) {
			if (typeof obj[prop] == "object") {
				if (prop == "attributes") {
					this.manageAttributes(obj[prop]);
				}
				this.iterate(obj[prop]);
			} else {
				propes += this.manageProps(prop, obj[prop]) + "\n";
			}
		}
		return propes;
	}

	isDoubleTag(prop) {
		const tagArray = ["h1", "h2", "h3", "p", "div"];
		if (tagArray.includes(prop)) {
			return true;
		}
		return false;
	}

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

	createDoctype(obj) {
		if (obj.hasOwnProperty("doctype")) {
			return `<!DOCTYPE ${obj["doctype"]}>`;
		}
	}

	createHtmlTag(obj) {
		if (obj.hasOwnProperty("language")) {
			return `<html lang="${obj["language"]}">`;
		} else {
			return `<html>`;
		}
	}

	createHead(obj) {
		let tempstring = "";
		tempstring += "<head>" + "\n";
		if (obj.hasOwnProperty("head")) {
			if (obj["head"].hasOwnProperty("meta")) {
				let props = Object.keys(obj["head"]);
				props.forEach((el) => {
					const headEl = obj["head"][el];
					if (typeof headEl === "string") {
						tempstring += `<${el}> ${headEl}</${el}>` + "\n";
					} else if (typeof headEl == "object" && headEl.length > 0) {
						headEl.forEach((nest) => {
							let htmlLine = `<${el}`;
							for (let name in nest) {
								htmlLine += ` ${name}="${nest[name]}"`;
							}
							htmlLine += ">";
							tempstring += htmlLine + "\n";
						});
					} else {
						for (let name in headEl) {
							let htmlLine = `<${el}`;
							if (name === "viewport") {
								htmlLine += ` name="${name}" content=`;
								let tempLine = "";
								for (let viewp in headEl[name]) {
									tempLine += `${viewp}=${headEl[name][viewp]} `;
								}
								tempLine = tempLine.trim().replace(" ", ", ");
								htmlLine += `"${tempLine}"`;
							} else if (name === "charset") {
								htmlLine += ` ${name}="${headEl[name]}">`;
							} else {
								htmlLine += ` name="${name}" content="${headEl[name]}">`;
							}
							tempstring += htmlLine + "\n";
						}
					}
				});
			}
		}
		tempstring += "</head>";
		return tempstring;
	}

	createBody(obj) {
		let bodyLine = `<body `;
		bodyLine +=
			this.manageAttributes(obj["body"]["attributes"])[0] +
			" " +
			this.manageAttributes(obj["body"]["attributes"])[1] +
			">";
		bodyLine += "\n";
		bodyLine += this.iterate(obj["body"]) + "\n";
		bodyLine += "</body>" + "\n";
		bodyLine += "</html>";
		return bodyLine;
	}

	createHtmlDocument(obj) {
		let html = "";
		html += this.createDoctype(obj) + "\n";
		html += this.createHtmlTag(obj) + "\n";
		html += this.createHead(obj) + "\n";
		html += this.createBody(obj);
		return html;
	}



	writeToFile(path, data) {
		fs.writeFile(path, data, (err) => {
			if (err) throw err;
			console.log(`File on path: ./${path} has been created!`);
		});
	}
}