import { getOption, DOC } from './func';

export class InputFile
{
	constructor($source, settings)
	{
		var self = this;

		this.$source = $source;
		this.$elements = {};

		if (!settings) settings = {}

		this.settings = {
			placeholder : getOption("placeholder", $source, settings.placeholder, "Select the file"),
			unselected  : getOption("unselected", $source, settings.unselected, "-- is not selected --"),
			className   : getOption("class", $source, settings.className, ""),
			clear       : getOption("clear", $source, settings.clear, true),
			size        : getOption("size", $source, settings.size, false),
			maxCount    : getOption("max-count", $source, settings.maxCount, 3),
			types       : getOption("types", $source, settings.types, false),
			fileList    : getOption("file-list", $source, settings.fileList, false)
		}

		this.errors = {
			maxCount : getOption("MaxCountError", $source, settings, "Max count of files - "),
			types : getOption("TypesError", $source, settings, "You can only select files of types - ")
		}

		this._create(this.settings);
	}

	addTypes(types)
	{
		this.settings.types.concat(types);
	}

	setup(settings)
	{
		for (var i in settings)
			if (i in this.settings) this.settings[i] = settings[i]
			else if (i in this.errors) this.errors[i] = settings[i]
	}

	_create(settings)
	{
		var self = this, $elements = this.$elements;

		this.$source.hide();

		$elements.wrapper = DOC.create("div", "inputdecor-file " + (settings.className ? settings.className : ""));
		$elements.unselected = DOC.create("span", "unselected").text(settings.unselected);
		$elements.list = DOC.create("div", "files-list");
		$elements.clear = DOC.create("button", "clear").hide();
		$elements.clear[0].onclick = function(){
			self.clear();
		};

		$elements.button = DOC.create("button", "button")
			.text(settings.placeholder)
			.click(function(e){
				e.preventDefault();
				self.$source.click();
			});

		this.$source.after($elements.wrapper);
		$elements.wrapper.append($elements.button);
		$elements.wrapper.append($elements.list);
		$elements.list.append($elements.unselected);
		$elements.wrapper.append($elements.clear);
		$elements.wrapper.append(this.$source);

		if (!settings.fileList) $elements.list.hide();
		if (settings.types && typeof settings.types == "string")
			settings.types = settings.types.replace(/\s+/g, "").split(",");

		this.$source.change(function(e){
			if (self.$source[0].files)
			{
				var files = self._getFiles(self.$source[0].files);
				files ? self._showFiles(files) : self.clear();
			}
		});
	}

	_getFiles(files)
	{
		var list = [], settings = this.settings;

		for (var i = 0; i < files.length; i++)
		{
			if (i >= settings.maxCount)
			{
				alert(this.errors.maxCount + settings.maxCount + "!");
				return false;
			}

			var type = files[i].name.split(".");
			type = type[type.length - 1].toLowerCase();

			if (settings.types && settings.types.indexOf(type) == -1)
			{
				alert(this.errors.types + settings.types.join(", ") + "!");
				return false;
			}

			list.push({
				name : files[i].name,
				size : Math.round(files[i].size / 1024),
				type : type
			});
		}

		return list;
	}

	_showFiles(files)
	{
		var result = this._printFiles(files);

		this.settings.fileList
		? this.$elements.list.html(result)
		: this.$elements.button.html(result).addClass("choosen");

		if (this.settings.clear)
			this.$elements.clear.show();
	}

	_printFiles(files)
	{
		var result = "";

		files.forEach( file => {
			result += "<div class='file'><span class='name'>" + file.name + "</span>";
			if (this.settings.size) result += "<span class='size'>" + file.size + "kb</span>";
			result += "</div>";
		});

		return result;
	}

	clear()
	{
		this.$source.val('');

		if (!this.settings.fileList)
			this.$elements.button.html("<span>" + this.settings.placeholder + "</span>");

		else 
		{
			this.$elements.list.empty();
			this.$elements.list.append(this.$elements.unselected);
		}

		this.$elements.clear.hide();
	}
}