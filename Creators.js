import { Converter } from "./Converter.js";

export class Creators extends Converter{

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
								htmlLine += '>'
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
		let bodyLine = `<body`;
		bodyLine += this.manageAttributes(obj["body"]["attributes"]);
		bodyLine += '>'
		bodyLine += "\n";
		bodyLine += (this.iterate(obj["body"]).join("\n")) + "\n";
		this.iterate(obj["body"])
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
}