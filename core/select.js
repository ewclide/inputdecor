import { createElement, fetchSettings, getCallBack } from './func';
import { List } from './list';
import { Search } from './search';
import { publish } from './publish';

var def = {
	name         : null,
	speed        : 250,
	maxHeight    : 250,
	rollup       : false,
	className    : "",
	sindex       : 0,
	unselected   : "-- not selected --",
	textEmpty    : "Nothing to choose",
	placeholder  : "Select value",
	search       : false,
	onChoose     : null,
	onReady      : null
}

var attrs = {
	maxHeight    : "max-height",
	textEmpty    : "text-empty",
	className    : "class",
	onChoose     : "on-choose",
	onReady      : "on-ready"
}

var searchDef = {
	textEmpty : "-- not found --",
	inButton  : false,
	caseSense : false,
	wholeWord : false,
	beginWord : false
}

var searchAttrs = {
	textEmpty : "search-empty",
	inButton  : "search-inbutton",
	caseSense : "search-case",
	wholeWord : "search-whole",
	beginWord : "search-begin"
}

class LocSelect
{
	constructor(source, type, settings)
	{
		source.style.display = "none";

		settings = fetchSettings(settings, def, attrs, source);

		this.source = source;
		this.type = type;
		this.active = false;
		this.value = source.value;
		this.text  = settings.placeholder;
		this.speed  = settings.speed;
		this.placeholder = settings.placeholder;
		this.unselected = settings.unselected ? true : false;
		this.textEmpty = settings.textEmpty;
		this.onChoose;
		this.onReady;

		if (settings.unselected === true)
			settings.unselected = def.unselected;

		if (settings.search)
		{
			if (settings.search === true)
				settings.search = {};

			settings.search = fetchSettings(settings.search, searchDef, searchAttrs, source);
		}

		this._create(settings);
	}

	_create(settings)
	{
        this.elements = {
        	main       : createElement("div", ["inputdecor-select", settings.className]),
	        buttonCont : createElement("div", "button-wrapper"),
	        button     : createElement("button", "button", null, settings.placeholder),
	        label      : createElement("button", "label"),
	        listCont   : createElement( "div", "list-wrapper", {
	        	position        : "absolute",
	        	minWidth        : "100%",
	        	transition      : settings.speed + "ms",
	        	transform       : "scaleY(0)",
	        	transformOrigin : "100% 0"
	        })
        }

        if (this.type == "ul")
        	this.elements.hidden = createElement("input", {
	        	type  : "hidden",
	        	name  : this.source.getAttribute("name") || settings.name,
	        	value : this.value
	        })

        this.list = new List(this.source, {
        	type        : this.type,
        	unselected  : settings.unselected,
        	sindex      : settings.sindex,
        	maxHeight   : settings.maxHeight,
        	onClear     : () => {
        		this._update();
        	},
        	onChoose    : (e) => {
        		this._update(e);
        		if (typeof this.onChoose == "function")
        			this.onChoose(e);
        		this.close();
        	}
        });

        if (settings.search)
        	this.search = new Search(this.list, settings.search);

        this.onChoose = getCallBack(settings.onChoose);
		this.onReady  = getCallBack(settings.onReady);

		this._buildElements(settings);
		this._listenEvents(settings);
		this._checkSingleAndEmpty();
	}

	_buildElements(settings)
	{
		var elements = this.elements;

		this.source.after(elements.main);
		elements.listCont.appendChild(this.list.element);
		elements.buttonCont.append(elements.button, elements.label);
		elements.main.append(elements.buttonCont, elements.listCont);

		if (this.type == "ul")
			elements.main.appendChild(elements.hidden);

		if (this.search)
		{
			if (settings.search.inButton)
			{
				this.search.setValue(this.text);
				elements.buttonCont.prepend(this.search.elements.main);
				elements.buttonCont.removeChild(elements.button);
			}
			else
			{
				elements.listCont.prepend(this.search.elements.main);
			}

			elements.listCont.appendChild(this.search.elements.empty);
		}

		if (settings.rollup)
		{
			elements.rollup = createElement("button", "rollup");
			elements.listCont.appendChild(elements.rollup);
			elements.rollup.onclick = (e) => this.close();
		}
	}

	_listenEvents(settings)
	{
		var elements = this.elements,
			toggle = (e) => {
				e.preventDefault();
				this.toggle();
			}

		elements.button.onclick = toggle;
		elements.label.onclick = toggle;

		if (this.search && settings.search.inButton)
			this.search.elements.input.onclick = toggle;

		if (settings.onReady)
			settings.onReady(this);
	}

	find(value)
	{
		this.search.find(value);
	}

	choose(index)
	{
		var data = this.list.choose(index);
		this._update(data);
		this.close();
	}

	addOption(data)
	{
		this.list.addOption(data);
		this.choose(0);
		this._checkSingleAndEmpty();
	}

	removeOption(index)
	{
		this.list.removeOption(index);
		this._checkSingleAndEmpty();
	}

	clearOptions()
	{
		this.list.clearOptions();
		this.elements.main.classList.add("empty");
	}

	_checkSingleAndEmpty()
	{
		if (!this.list.length)
			this.elements.main.classList.add("empty");

		else if (this.list.length == 1)
		{
			this.elements.main.classList.add("single");
			this.elements.main.classList.remove("empty");
		}
		else
		{
			this.elements.main.classList.remove("empty");
			this.elements.main.classList.remove("single");
		}
	}

	_update(data = {})
	{
		var text  = data.text,
			value = data.value;

		if (!data.length)
			text = this.textEmpty;

		else if (data.index == 0 && this.unselected)
			text = this.placeholder;

		this.text  = text;
		this.value = value;

		if (this.search)
			this.search.setValue(text);

		if (this.type == "ul")
			this.elements.hidden.value = value;

		this.elements.button.innerText = text;
	}

	get length()
	{
		return this.list.length;
	}

	get index()
	{
		return this.list.index;
	}

	open()
	{
		if (this.list.length > 1)
		{
			this.elements.listCont.style.transform = "scaleY(1)";
			this.elements.button.classList.add("active");
			this.elements.label.classList.add("active");
			this.active = true;

			if (this.search) this.search.clear(true);
		}
	}

	close()
	{
		this.elements.listCont.style.transform = "scaleY(0)";
		this.elements.button.classList.remove("active");
		this.elements.label.classList.remove("active");
		this.active = false;

		if (this.search)
		{
			this.search.inButton
			? this.search.setValue(this.text)
			: this.search.clear();
		}
	}

	toggle()
	{
		this.active ? this.close() : this.open();
	}
}

export var Select = publish(
	LocSelect,
	["length", "index"],
	["find", "choose", "addOption", "removeOption", "clearOptions", "open", "close", "toggle"]
);