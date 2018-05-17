import { DOC, init } from './func';

export class List
{
	constructor($source, settings)
	{
		this.$source = $source;
		this.settings = settings;

		this.length = 0;
		this.options = [];
		this.onChoose = function(){};
		this.$element;
		this.$allElements;
		this.selected = settings.selected || 0;
		
		this._create();
	}

	choose(index)
	{
		return this._choose(this.options[index]);
	}

	addOption(data)
	{
		var self = this,
			option = this._createOption(data);

		if (data.childs)
		{
			option.$element.addClass("group");

			data.childs.forEach(function(child){
				child.className = "child";
				self._createOption(child);
			});
		}

		this.options.push(option);
	}

	_create()
	{
		var self = this;

		this.$element = DOC.create("ul", "list");

		if (this.settings.unselected)
		{
			var unselected = this.settings.unselected;

			if (this.settings.type == "select")
				unselected = '<option class="unselected">' + unselected + '</option>';

			else if (this.settings.type == "ul")
				unselected = '<li class="unselected">' + unselected + '</li>';

			this.$source.prepend(unselected);
			this.selected++;
		}

		this.options = this._buildOptions();
		this.$allElements = this.$element.find("li");

		this.$element.click(function(e){
			var target;

			if ("_decorTarget" in e.target) target = e.target._decorTarget;
			else target = $(e.target).closest("li")[0]._decorTarget;

			self._choose(target);
		});
	}

	_choose(target)
	{
		var data = {
			value : target.value,
			text  : target.text,
			unselected : target.text === this.settings.unselected ? true : false
		}

		this.$allElements.removeAttr("data-selected");
		target.$element.attr("data-selected", "true");

		this.$source[0].selectedIndex = target.index;
		this.$source.change();

		this.onChoose(data);

		return data;
	}

	_buildOptions()
	{
		var self = this,
			options = this.$source.find(">"),
			result = [];

		this.$element._decorLength = 0;

		if (options.length)
			options.each(function(){

				var data,
					option = $(this),
					group = option.attr("data-group");

				if (group)
				{
					var childs = [];

					data = self._getOptionData(option, "group", group),

					option.find("ul > li").each(function(){
						childs.push(self._getOptionData($(this), "child"));
					});

					data.childs = childs;
				}
				else
				{
					data = self._getOptionData(option);
				}

				result.push(data);
			});

		this.length = result.length;

		if (result.length) return result;
		else return false;
	}

	_getOptionData($option, type, html)
	{
		var self = this,
			selected = $option.attr("selected"),
			cls = $option.attr("class");

		if (type && cls) cls += " " + type;
		else if (type) cls = type;

		var option = this._createOption({
			value : $option.val() || $option.attr("value"),
			text  : type == "group" ? "" : $option.text(),
			html  : type == "group" ? html : $option.html(),
			className : cls ? cls : ""
		});

		if (selected) this.selected = option.index;

		return option;
	}

	_createOption(data)
	{
		var $li = DOC.create("li"),
			option = {
				$element : $li,
				value    : data.value,
				text     : data.html && !data.text ? $("<div>" + data.html + "</div>").text() : data.text,
				index 	 : this.$element._decorLength++
			}

		if (data.className)
			$li.addClass(data.className);

		if (data.html) $li.html(data.html);
		else $li.text(data.text);

		$li[0]._decorTarget = option;

		this.$element.append($li);

		return option;
	}
}