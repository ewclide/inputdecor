import { createElement } from './func';

export class List
{
	constructor(source, settings)
	{
		this.element;
		this.index = source.selectedIndex || settings.sindex;
		this.options = [];
		this.groups = {};
		this.onChoose = settings.onChoose;
		this.dispEvent = settings.dispEvent;
		this.active;

		if (settings.type == "select")
			this._createFromSelect(source, settings);
		else if (settings.type == "ul")
			this._createFromUL(source, settings);

		if (settings.unselected)
			this.unselected = this._createUnselected(settings.unselected);

		this.choose(this.index);

		this.element.onclick = (e) => {
			var idx = e.target._decorIndex;
			if (!idx) idx = e.target.closest("li")._decorIndex;
			this.dispEvent(this.choose(idx));
		}
	}

	get length()
	{
		return this.options.length;
	}

	_createUnselected(text)
	{
		var element = createElement("li", "unselected", null, text);
			element._decorIndex = -1;

		this.element.prepend(element);

		return element;
	}

	_createFromSelect(source, settings)
	{
		var list = source.options;

		this.element = createElement("ul", "list", {
			maxHeight : settings.maxHeight + "px",
			overflowY : "auto"
		});

		if (list.length)
		{
			let frag = document.createDocumentFragment();

			for (var i = 0; i < list.length; i++)
			{
				let element = list[i],
					option = this._createOption({
						value    : element.value || element.getAttribute("value"),
						text     : element.innerText,
						html     : element.innerHTML,
						selected : element.getAttribute("selected") || false,
						className: element.getAttribute("class"),
						group    : element.getAttribute("data-group"),
						child    : element.getAttribute("data-child")
					});

				frag.appendChild(option.element);
			}

			this.element.appendChild(frag);
		}
	}

	_createFromUL(source, settings)
	{
		var list = source.querySelectorAll("li");

		this.element = source;
		source.style.display = "";
		source.style.maxHeight = settings.maxHeight + "px";
		source.style.overflowY = "auto";
		source.classList.add("list");

		for (var i = 0; i < list.length; i++)
		{
			let element = list[i];

			this._createOption({
				element  : element,
				value    : element.value || element.getAttribute("value"),
				text     : element.innerText,
				html     : element.innerHTML,
				selected : element.getAttribute("selected") !== null,
				className: element.getAttribute("class"),
				group    : element.getAttribute("data-group"),
				child    : element.getAttribute("data-child")
			})
		}
	}

	_createOption(data)
	{
		var element = data.element || createElement("li", data.className),
			index = this.options.length,
			option = {
				element : element,
				value   : data.value,
				text    : data.text,
				index 	: index
			}

		if (data.group)
		{
			option.group = data.group;
			this.groups[data.group] = {};
		}
		else if (data.child && data.child in this.groups)
		{
			var group = this.groups[data.child];
				group.push(option);

			option.parent = group;
			element.classList.add("child");
		}

		if (data.html) element.innerHTML = data.html;
		else if (data.text) element.innerText = data.text;

		if (data.selected)
		{
			element.classList.add("active");
			this.index = index;
		}

		this.options.push(option);
		element._decorIndex = index;

		return option;
	}

	addOption(data)
	{
		var before = this.length;

		if (Array.isArray(data))
		{
			let frag = document.createDocumentFragment();

			data.forEach((item) => {
				let option = this._createOption(item);
				frag.appendChild(option.element);
			});

			this.element.appendChild(frag);
		}
		else
		{
			let option = this._createOption(data);
			this.element.appendChild(option.element);
		}

		if (this.length == 1) this.choose(0);
		else if (before == 0) this.choose(this.index);
	}

	choose(idx)
	{
		var data;

		if (typeof idx != "number") return;

		if (this.active)
			this.active.classList.remove("active");

		if (idx == -1 && this.unselected)
		{
			this.index = -1;
			this.active = this.unselected;
			this.unselected.classList.add("active");

			data = {
				index  : -1,
				length : this.options.length
			}
		}
		else if (idx < this.options.length || idx >= 0)
		{
			var option = this.options[idx];

			this.index = option.index;
			this.active = option.element;
			option.element.classList.add("active");

			data = {
				value  : option.value,
				text   : option.text,
				index  : option.index,
				length : this.options.length
			}
		}

		if (typeof this.onChoose == "function")
			this.onChoose(data);

		return data;
	}

	removeOption(idx)
	{
		var option = this.options[idx + 1];

		if (option.childs)
		{
			this.removeChilds(idx);
			delete this.groups[option.group];
		}

		this.element.removeChild(option.element);
		this.options.splice(idx + 1, 1);

		this._rebuildOptions();
	}

	removeChilds(idx)
	{
		idx++;

		var main = this.options[idx],
			index = main.index + (this.unselected ? 2 : 1);

		if (!main.childs) return;

		main.childs.forEach( child => {
			this.element.removeChild(child.element);
			this.options.splice(index, 1);

			if (child.index == this.index)
				this.index = main.index;
		});

		this._rebuildOptions();
	}

	clearOptions()
	{
		var first = this.unselected ? this.options[0] : null;

		this.element.innerHTML = "";
		this.options = first ? [first] : [];
		this.groups = [];
		this.index = -1;
		this.choose(-1);

		if (this.unselected)
			this.element.appendChild(this.unselected);
	}

	_rebuildOptions()
	{
		this.options.forEach((option, i) => {
			var index = i - 1;
			option.index = index;
			option.element._decorIndex = index;
		})

		if (!this.length) this.choose(-1);
		else if (this.index >= this.length) this.choose(this.length - 1);
		else this.choose(this.index);
	}
}