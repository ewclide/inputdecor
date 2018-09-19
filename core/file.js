import { fetchSettings, createElement, browser } from './func';
import { publish } from './publish';

var def = {
	placeholder : "Select the file",
	unselected  : "-- is not selected --",
	className   : null,
	clear       : true,
	size        : true,
	maxCount    : 3,
	charSize    : 12,
	types       : null,
	fileList    : false,
	errMaxCount : "Max count of files - ",
	errTypes    : "You can only select files of types - "
}

var attrs = {
	className   : "class",
	maxCount    : "max-count",
	charSize    : "char-size",
	fileList    : "file-list",
	errMaxCount : "err-maxcount",
	errTypes    : "err-types"
}

class LocInputFile
{
	constructor(source, settings)
	{
		this.source = source;

		settings = fetchSettings(settings, def, attrs, source);

		this.types = [];
		this.maxCount = settings.maxCount;
		this.fileList = settings.fileList;
		this.clear = settings.clear;
		this.size = settings.size;
		this.errMaxCount = settings.errMaxCount;
		this.errTypes = settings.errTypes;
		this.charSize = settings.charSize;
		this.placeholder = settings.placeholder;

		this._create(settings);
	}

	_create(settings)
	{
		this.source.style.display = "none";

		var elements = {
			main       : createElement("div", "inputdecor-file"),
			unselected : createElement("span", "unselected", null, settings.unselected),
			list       : createElement("div", "files-list"),
			clear      : createElement("button", "clear", { display : "none" }),
			button     : createElement("button", "button", null, settings.placeholder)
		}

		elements.clear.onclick = (e) => {
			e.preventDefault();
			this.clearList();
		}

		elements.button.onclick = (e) => {
			e.preventDefault();
			this.source.click();
		}

		// appending
		this.source.insertAdjacentElement('afterend', elements.main);
		elements.list.appendChild(elements.unselected);
		elements.main.appendChild(elements.button);
		elements.main.appendChild(elements.list);
		elements.main.appendChild(elements.clear);
		elements.main.appendChild(this.source);

		// setuping
		if (settings.className)
			elements.main.classList.add(settings.className);

		if (!settings.fileList)
			elements.list.style.display = "none";

		if (settings.types && typeof settings.types == "string")
			this.types = settings.types.replace(/\s+/g, "").split(",");

		var self = this;

		this.source.addEventListener("change", function(e){
			if (self.source.files)
			{
				var files = self._getFiles(self.source.files);
				files ? self._showFiles(files) : self.clearList();
			}
		});

		this.elements = elements;
	}

	_getFiles(files)
	{
		var list = [];

		for (var i = 0; i < files.length; i++)
		{
			if (i >= this.maxCount)
			{
				alert(this.errMaxCount + this.maxCount + "!");
				return false;
			}

			var parts = files[i].name.split("."),
				type = parts.pop().toLowerCase(),
				name = parts.join('.');

			if (this.types && this.types.indexOf(type) == -1)
			{
				alert(this.errTypes + this.types.join(", ") + "!");
				return false;
			}

			if (this.charSize && name.length > this.charSize)
				name = name.substr(0, this.charSize) + "...";

			list.push({
				name : name,
				size : Math.round(files[i].size / 1024),
				type : type
			});
		}

		return list;
	}

	_showFiles(files)
	{
		var list = this._printFiles(files);

		if (this.fileList)
		{
			this._clearElement(this.elements.list)
			this.elements.list.appendChild(list);
		}
		else 
		{
			this._clearElement(this.elements.button)
			this.elements.button.appendChild(list);
			this.elements.button.classList.add("choosen");
		}

		if (this.clear)
			this.elements.clear.style.display = "";
	}

	_printFiles(files)
	{
		var frag = document.createDocumentFragment();

		files.forEach( file => {
			var item = document.createElement("div");

			item.classList.add('file');
			item.innerHTML = "<span class='name'>" + file.name + "." + file.type + "</span>";

			if (this.size) item.innerHTML += "<span class='size'>" + file.size + " kb</span>";

			frag.appendChild(item);
		});

		return frag;
	}

	get isInputDecor()
	{
		return true;
	}

	clearList()
	{
		this.source.value = "";

		if (!this.fileList)
			this.elements.button.innerHTML = "<span>" + this.placeholder + "</span>";

		else 
		{
			this._clearElement(this.elements.list)
			this.elements.list.appendChild(this.elements.unselected);
		}

		this.elements.clear.style.display = "none";
	}

	_clearElement(element)
	{
		if (browser == "IE")
		{
			while (element.firstChild)
				element.removeChild(element.firstChild);
		}
		else element.innerHTML = '';
	}
}

export var InputFile = publish(LocInputFile, ["isInputDecor"], ["clearList"]);