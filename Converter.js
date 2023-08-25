export class Converter{
	constructor() {
		this.tagGroup = [];
	}

	manageAttributes(attr) {
		let htmlObjLine = {};
		let htmlSingleLine = "";
		for (let prop in attr) {
			if (typeof attr[prop] == "object") {
				let htmlLine = `${prop}="`;
				for (let single in attr[prop]) {
					htmlLine += `${single}:${attr[prop][single]};`;
				}
				htmlObjLine[prop] = htmlLine + `"`;
			} else {
				htmlSingleLine += ` ${prop}="${attr[prop]}"`;
			}
		}
		for (let el in htmlObjLine) {
			htmlSingleLine += " " + htmlObjLine[el];
		}
		return htmlSingleLine;
	}

	manageTags(prop, obj) {
			return `<${prop}>${obj}</${prop}>`;
	}

	manageNested(prop, obj) {
		let singleLine =`<${prop}`
		if (obj.hasOwnProperty("attributes")) {
			singleLine += this.manageAttributes(obj["attributes"])
		}
		singleLine += '>'
		this.tagGroup.push(singleLine)
		
		for(let el in obj){
			if (typeof obj[el] == "object" && el != "attributes") {
				this.tagGroup.push(`<${el}>`)
				this.iterate(obj[el]);
				this.tagGroup.push(`</${el}>`)
			} else if (el != "attributes"){
				this.tagGroup.push(`<${el}>${obj[el]}</${el}>`);
			}
		}
		this.tagGroup.push(`</${prop}>`);
	}

	iterate(obj) {
		for (let prop in obj) {
			if (prop === "attributes") {
				continue;
			}
			if (typeof obj[prop] == "object") {
				this.manageNested(prop, obj[prop]);
			} else {
				this.tagGroup.push(this.manageTags(prop, obj[prop]));				
			}
		}
		return this.tagGroup;
	}
}