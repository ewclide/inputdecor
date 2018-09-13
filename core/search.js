import { createElement } from './func';

export class Search
{
	constructor(list, settings)
	{
		this.inButton  = settings.inButton;
		this.caseSense = settings.caseSense;
		this.wholeWord = settings.wholeWord;
		this.beginWord = settings.beginWord;

		this.list = list;

		this._create(settings);
	}

	_create(settings)
	{
		this.elements = {
			main  : createElement("div", "search"),
			input : createElement("input", { "type" : "text", "class" : "button" }),
			clear : createElement("button", "clear", { "display" : "none" }),
			empty : createElement("span", "empty", { "display" : "none" }, settings.textEmpty)
		}

		this.elements.input.oninput = (e) => this.find(e.target.value);
		this.elements.clear.onclick = (e) => {
			e.preventDefault();
			this.clear(true);
		};

		this.elements.main.appendChild(this.elements.input);
		this.elements.main.appendChild(this.elements.clear);
	}

	get value()
	{
		return this.elements.input.value;
	}

	setValue(str, blur = true)
	{
		this.elements.input.value = str;
		this.elements.clear.style.display = str ? "" : "none";

		if (blur)
		{
			this.elements.clear.style.display = "none";
			this.elements.input.blur();
		}
	}

	clear(focus)
	{
		this.elements.input.value = "";
		this.elements.empty.style.display = "none";
		this.elements.clear.style.display = "none";

		if (this.list.unselected)
			this.list.unselected.style.display = "";

		focus
		? this.elements.input.focus()
		: this.elements.input.blur();

		this.list.options.forEach( option => {
			option.element.style.display = "";
		})
	}

	find(text)
	{
		var found = this._find(this.list.options, text);

		this.elements.empty.style.display = found ? "none" : "";

		if (this.list.unselected)
			this.list.unselected.style.display = "none";

		this.setValue(text, false);

		return found ? true : false;
	}

	_find(options, text)
	{
		var count = 0;

		options.forEach( option => {
			if (!this._compare(option.text, text))
				option.element.style.display = "none";
			else
			{
				count++;
				option.element.style.display = "";

				if (option.parent)
					option.parent.element.style.display = "";
			}
		});

		return count;
	}

	_compare(v1, v2)
	{
		if (!v2) return true;

		if (!this.caseSense)
		{
			v1 = v1.toUpperCase();
			v2 = v2.toUpperCase();
		}

		if (this.wholeWord)
			return v1 == v2  ? true : false;
		
		else
		{
			var idx = v1.indexOf(v2);

			if (this.beginWord)
				return idx != -1 && ( idx == 0 || v1[idx - 1] == " " ) ? true : false;

			else return idx != -1 ? true : false;
		}

		return;
	}

	changeInputType(type)
	{
		if (type == 1) this.elements.input.type = "text";
		else if (type == 2) this.elements.input.type = "button";
	}
}