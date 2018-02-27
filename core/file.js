import { checkBoolean, DOC } from './func';

export class InputFile
{
	constructor($element)
	{
		var self = this, settings;

		this.$element = $element;
		this.$elements = {};

		this.settings = {
			textButton     : this.$element.attr("data-text-button") || "Select the file",
			textUnselected : this.$element.attr("data-text-unselected") || "-- is not selected --",
			className      : checkBoolean(this.$element.attr("data-class"), false),
			close          : checkBoolean(this.$element.attr("data-close"), false),
			size           : checkBoolean(this.$element.attr("data-size"), false),
			maxCount       : this.$element.attr("data-max-count") || 3,
		}

		this._create(this.settings);
	}

	_create(settings)
	{
		var self = this, $elements = this.$elements;

		this.$element.hide();

		$elements.wrapper = DOC.create("div", "inputdecor-file " + (settings.className ? settings.className : ""));
		$elements.unselected = DOC.create("span", "unselected").text(settings.textUnselected);
		$elements.list = DOC.create("div", "files-list");
		$elements.close = DOC.create("button", "close");
		$elements.close[0].onclick = function()
		{
			self._hideFiles();
		};

		$elements.button = DOC.create("button", "button")
			.text(settings.textButton)
			.click(function(e){
				e.preventDefault();
				self.$element.click();
			});

		this.$element.after($elements.wrapper);
		$elements.wrapper.append($elements.button);
		$elements.wrapper.append($elements.list);
		$elements.list.append($elements.unselected);
		$elements.wrapper.append(this.$element);

		this.$element.change(function(e){
			if (self.$element[0].files)
			{
				var files = self._getFiles(self.$element[0].files);
				self._showFiles(files);
			}
		});
	}

	_getFiles(files)
	{
		var list = [];

		for (var i = 0; i < files.length; i++)
			list.push(files[i]);

		return list;
	}

	_showFiles(files)
	{
		var result = "";

		for (var i = 0; i < files.length; i++ )
		{
			result += "<div class='file'><label>" + files[i].name + "</label>";

			if (this.settings.size)
				result += "<span class='size'>" + Math.round(files[i].size / 1024) + "kb</span>";

			result += "</div>";

			if (i >= this.settings.maxCount)
			{
				this._hideFiles();
				alert("максимальное количество файлов - " + this.settings.maxCount + "!");
				return;
			}
		}

		this.$elements.list.empty();
		this.$elements.list.append(result);

		if (this.settings.close)
			this.$elements.list.append(this.$elements.close);

		else this.$elements.list.append("<span></span>");
	}

	_hideFiles()
	{
		this.$element.val('');
		this.$elements.list.empty();
		this.$elements.list.append(this.$elements.unselected);
	}
}