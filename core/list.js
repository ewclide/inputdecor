import { createElement } from './func';

export class List
{
	constructor(source, settings)
	{
		this.element;
		this.index = settings.sIndex || -1;
		// this.length = 0;
		this.options = [];
		this.groups = {};
		this.onChange = settings.onChange;
		this.dispEvent = settings.dispEvent;
		this.active;

		if (settings.type == "select")
			this._createFromSelect(source, settings);
		else if (settings.type == "ul")
			this._createFromUL(source, settings);

		if (settings.unselected)
			this.unselected = this._createUnselected(settings.unselected);

		console.log(this)

		if (settings.sValue) this.selectByValue(settings.sValue);
		else this.select(this.index);

		this.element.onclick = (e) => {
			var idx = e.target._decorIndex;
			if (!idx) idx = e.target.closest("li")._decorIndex;
			this.dispEvent(this.select(idx));
		}
	}

	get length()
	{
		return this.options.length;
	}

	get wholeLength()
	{
		var length = this.options.length;

		for (var i in groups)
			length += groups[i].length;

		return length;
	}

	_createUnselected(text)
	{
		var element = createElement("li", "unselected", null, text);
			element._decorIndex = -1;

		this.element.insertAdjacentElement('afterbegin', element);

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
			option = {
				value   : data.value,
				text    : data.text,
				element : element
			}

		if (data.group)
			this._createGroup(data.group, option);

		else if (data.child && data.child in this.groups)
			this._createChild(data.child, option);

		else this._createSimple(option);
		// else option.index = this.length++;

		if (data.html)
			element.innerHTML = data.html;
		else if (data.text)
			element.innerText = data.text;

		if (data.selected && option.index)
		{
			// element.classList.add("active");
			this.index = option.index;
		}

		// option.index = this.length++;
		// this.options.push(option);
		// element._decorIndex = option.index;

		return option;
	}

	_createSimple(option)
	{
		option.index = this.options.length;
		option.element._decorIndex = option.index;

		this.options.push(option);
	}

	_createGroup(name, option)
	{
		var group = [];
			group._parentOption = option;
			
		this.groups[name] = group;
		option.group = name;
		this.options.push(option);
		// option.index = this.length++;
	}

	_createChild(name, option)
	{
		var group = this.groups[name],
			lastElement = group.length ? group[group.length - 1].element : group._parentOption.element;
				
		option.append = lastElement;
		option.parent = group._parentOption;
		option.nodeIndex = group.length;
		option.element._decorIndex = option.nodeIndex;
		option.element._decorGroup = name;
		option.element.classList.add("child");

		group.push(option);
	}

	addOption(data)
	{
		var before = this.options.length;

		if (Array.isArray(data))
		{
			let frag = document.createDocumentFragment();

			data.forEach((item) => {
				let option = this._createOption(item);

				option.append
				? option.append.insertAdjacentElement('afterend', option.element)
				: frag.appendChild(option.element);
			});

			this.element.appendChild(frag);
		}
		else
		{
			let option = this._createOption(data);

			option.append
			? option.append.insertAdjacentElement('afterend',option.element)
			: this.element.appendChild(option.element);
		}

		if (this.options.length == 1) this.select(0);
		else if (before == 0) this.select(this.index);
	}

	select(idx, nodeIdx)
	{
		var data;

		if (typeof idx != "number") return;

		if (this.active)
			this.active.classList.remove("active");

		if (idx == -1 && this.unselected)
		{
			data = {
				index  : -1,
				length : this.options.length
			}

			this.index = -1;
			this.active = this.unselected;
			this.unselected.classList.add("active");
		}
		else if (idx < this.options.length || idx >= 0)
		{
			var option = this.options[idx];

			data = {
				value  : option.value,
				text   : option.text,
				index  : option.index,
				length : this.options.length
			}

			if (option.parent)
			{
				data.parentIndex = option.parent.index;
				data.nodeIndex = option.nodeIndex;
			}

			this.index = option.index;
			this.active = option.element;
			option.element.classList.add("active");
		}

		if (typeof this.onChange == "function")
			this.onChange(data);

		return data;
	}

	selectByValue(value)
	{
		var index = -1;

		for (var i = 0; i < this.options.length; i++)
			if (this.options[i].value == value)
			{
				index = this.options[i].index;
				break;
			}
		
		return this.select(index);
	}

	removeOption(idx)
	{
		var option = this.options[idx + 1];

		if (option.group)
		{
			this.clearGroup(option.group);
			delete this.groups[option.group];
		}

		this.element.removeChild(option.element);
		this.options.splice(idx + 1, 1);

		this._rebuildOptions();
	}

	clearGroup(name)
	{
		var childs = this.groups[name],
			idx = childs.parent.index;

		childs.forEach( child => {
			this.element.removeChild(child.element);
			this.options.splice(idx, 1);

			if (child.index == this.index)
				this.index = idx;
		});

		this._rebuildOptions();
	}

	clearOptions()
	{
		this.element.innerHTML = "";
		this.options = [];
		this.groups = {};
		this.index = -1;
		this.active = null;
		this.select(-1);

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

		if (!this.length) this.select(-1);
		else if (this.index >= this.length) this.select(this.length - 1);
		else this.select(this.index);
	}
}