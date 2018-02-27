import { checkBoolean, DOC } from './func';

export class Search
{
	constructor(list, settings)
	{
		this.settings = settings;
		this.options = list.options;

		this._create();
	}

	getValue()
	{
		return this.$elements.input.val();
	}

	setValue(str)
	{
		this.$elements.input.val(str).blur();
		this.$elements.clear.hide();
	}

	clear(focus)
	{
		if (focus) this.$elements.input.focus().val("");
		else this.$elements.input.val("").blur();

		this.find("");
	}

	find(text)
	{
		var count = this._find(this.options, text);

		if (this.$elements.input.val()) this.$elements.clear.show();
		else this.$elements.clear.hide();

		if (!count) this.$elements.empty.show();
		else this.$elements.empty.hide();
	}

	_create()
	{
		var self = this;

		this.$elements = {
			main  : DOC.create("div", "search"),
			input : DOC.create("input", { "type" : "text" }),
			clear : DOC.create("button", "clear").hide(),
			empty : DOC.create("span", "empty").text(this.settings.textEmpty).hide()
		}

		this.$elements.input.on("input", function(e){
			self.find(self.getValue());
		});

		this.$elements.clear.click(function(e){
			e.preventDefault();
			self.clear(true);
			self.find("");
		});

		this.$elements.main.append(
			this.$elements.input,
			this.$elements.clear
		);
	}

	_find(options, text)
	{
		var self = this,
			count = 0;

		options.forEach(function(option){

			var inside;

			if (option.childs)
				inside = self._find(option.childs, text);

			if (inside) count += inside;

			if (!self._compare(option.text, text))
			{
				if (!inside) option.$element.hide();
			}
			else
			{
				count++;
				option.$element.show();
			}
		});

		return count;
	}

	_compare(value_1, value_2)
	{
		if (!value_2) return true;

		if (!this.settings.caseSense)
		{
			value_1 = value_1.toUpperCase();
			value_2 = value_2.toUpperCase();
		}

		if (this.settings.fullWord)
			return value_1 == value_2  ? true : false;

		else
		{
			var idx = value_1.indexOf(value_2);

			if (this.settings.beginWord)
				return idx != -1 && ( idx == 0 || value_1[idx - 1] == " " ) ? true : false;

			else return idx != -1 ? true : false;
		}

		return;
	}
}