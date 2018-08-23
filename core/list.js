import { createElement } from './func';

export class List
{
	constructor(source, settings)
	{
		this.source = source;
		this.element;
		this.options = [];
		this.groups = {};
		this.onChoose = settings.onChoose;
		this.onClear = settings.onClear;
		this.unselected = settings.unselected;

		if (!("selectedIndex" in this.source))
			this.source.selectedIndex = 0;

		if (settings.sindex)
			this.source.selectedIndex = settings.sindex;

		if (settings.unselected)
			this._createUnselected(settings.type, settings.unselected);

		if (settings.type == "select")
			this._createFromSelect(settings);
		else if (settings.type == "ul")
			this._createFromUL(settings);
		
		this.choose(this.index);

		this.element.onclick = (e) => {
			var idx = e.target._decorIndex;
			if (!idx) idx = e.target.closest("li")._decorIndex;
			this.choose(idx);
		}
	}

	get length()
	{
		return this.options.length + ( this.unselected ? -1 : 0 );
	}

	get index()
	{
		return this.source.selectedIndex;
	}

	_createFromSelect(settings)
	{
		var list = this.source.options;

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
						clsName  : element.getAttribute("class"),
						group    : element.getAttribute("data-group"),
						child    : element.getAttribute("data-child")
					});

				frag.appendChild(option);
			}

			this.element.appendChild(frag);
		}
	}

	_createFromUL(settings)
	{
		var list = this.source.querySelectorAll("li");

		this.element = this.source;
		this.source.style.display = "";
		this.source.style.maxHeight = settings.maxHeight + "px";
		this.source.style.overflowY = "auto";
		this.source.classList.add("list");

		for (var i = 0; i < list.length; i++)
		{
			let element = list[i];

			this._createOption({
				element  : element,
				value    : element.value || element.getAttribute("value"),
				text     : element.innerText,
				html     : element.innerHTML,
				selected : element.getAttribute("selected") || false,
				clsName  : element.getAttribute("class"),
				group    : element.getAttribute("data-group"),
				child    : element.getAttribute("data-child")
			})
		}
	}

	_createUnselected(type, text)
	{
		let idx = this.source.selectedIndex,
			tag = type == "ul" ? "li" : "option",
			element = createElement(tag, "unselected", null, text);
			element._decorIndex = 0;

		this.source.insertAdjacentElement("afterbegin", element);
		this.unselectedElement = element;

		if (!idx) this.source.selectedIndex = 0;
	}

	_createOption(data)
	{
		var element = data.element || createElement("li", data.clsName),
			index = this.options.length,
			option = {
				element : element,
				value   : data.value,
				text    : data.text,
				index 	: index
			}

		element._decorIndex = index;

		if (data.group)
		{
			this.groups[data.group] = option;
			option.childs = [];
			option.group = data.group;
		}
		else if (data.child && data.child in this.groups)
		{
			let parent = this.groups[data.child];
			element.classList.add("child");
			option.parent = parent;
			parent.childs.push(option);
		}

		if (data.html)
			element.innerHTML = data.html;
		else if (data.text)
			element.innerText = data.text;

		if (data.selected)
		{
			element.classList.add("active");
			this.source.selectedIndex = index;
		}

		this.options.push(option);

		return element;
	}

	addOption(data, after)
	{
		if (Array.isArray(data))
		{
			let frag = document.createDocumentFragment();

			data.forEach( (item) => {
				let option = this._createOption(item);
				frag.appendChild(option);
			});

			this.element.appendChild(frag);
		}
		else
		{
			let option = this._createOption(data);
			this.element.appendChild(option);
		}
	}

	removeOption(idx)
	{
		idx++;

		var option = this.options[idx];

		this.element.removeChild(option.element);
		this.options.splice(idx, 1);

		if (option.childs)
		{
			option.childs.forEach((child) => {
				this.element.removeChild(child.element);
				this.options.splice(child.index, 1);
			});

			delete this.groups[option.group];
		}

		this.options.forEach( (option, i) =>{
			option.index = i;
			option.element._decorIndex = i;
		})

		console.log(option, this)
	}

	clearOptions()
	{
		var unselected = this.options[0];

		this.element.innerHTML = "";
		this.options = [];
		this.groups = [];

		this.onClear();

		if (this.unselectedElement)
			this.element.appendChild(this.unselectedElement);
	}

	choose(idx)
	{
		// idx++;

		if (typeof idx != "number" || idx >= this.options.length || idx < -1 ) return;

		var option = this.options[idx] || {},
			data = {
				value  : option.value,
				text   : option.text,
				index  : idx,
				length : this.length // need for use textEmpty
			}

		for (var i = 0; i < this.options.length; i++)
			this.options[i].element.classList.remove("active");

		if (option.element)
			option.element.classList.add("active");

		this.source.selectedIndex = idx;
		this.source.dispatchEvent(new Event("change"));
        
		if (typeof this.onChoose == "function")
			this.onChoose(data);

		return data;
	}
}