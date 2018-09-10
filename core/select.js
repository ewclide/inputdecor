import { createElement, fetchSettings, getCallBack } from './func';
import { List } from './list';
import { Search } from './search';
import { publish } from './publish';

var def = {
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
		this.name = source.name;
		this.text  = settings.placeholder;
		// this.speed  = settings.speed;
		this.placeholder = settings.placeholder;
		// this.unselected = settings.unselected ? true : false;
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

	get isInputDecor()
	{
		return true;
	}

	_create(settings)
	{
        this.elements = {
        	main       : createElement("div", ["inputdecor-select", settings.className]),
	        buttonCont : createElement("div", "button-wrapper"),
	        button     : createElement("button", "button", null, settings.placeholder),
	        label      : createElement("button", "label"),
	        hidden     : createElement("input", {
	        	type  : "hidden",
	        	name  : this.name,
	        	value : this.value
	        }),
	        listCont   : createElement( "div", "list-wrapper", {
	        	position        : "absolute",
	        	minWidth        : "100%",
	        	transition      : settings.speed + "ms",
	        	transform       : "scaleY(0)",
	        	transformOrigin : "100% 0"
	        })
        }

        this.list = new List(this.source, {
        	type        : this.type,
        	unselected  : settings.unselected,
        	sindex      : settings.sindex,
        	maxHeight   : settings.maxHeight,
        	dispEvent   : (e) => this._dispatchEvent(e),
        	onChoose    : (e) => {
        		this._update(e);
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

	_dispatchEvent(e)
	{
		if (typeof this.onChoose == "function") this.onChoose(e);
	}

	_buildElements(settings)
	{
		var elements = this.elements;

		this.source.after(elements.main);
		this.source.parentNode.removeChild(this.source);
		elements.listCont.appendChild(this.list.element);
		elements.buttonCont.append(elements.button, elements.label);
		elements.main.append(elements.buttonCont, elements.listCont);
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
		var self = this,
			elements = this.elements,
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

		document.body.addEventListener("click", function(e){
			var parent = e.target.closest(".inputdecor-select");
			if (!parent) self.close();
		});
	}

	find(value)
	{
		this.search.find(value);
	}

	choose(index)
	{
		var e = this.list.choose(index);
		this._dispatchEvent(e);
		this._update(e);
		this.close();
	}

	addOption(data)
	{
		this.list.addOption(data);
		this._checkSingleAndEmpty();
	}

	removeOption(index)
	{
		this.list.removeOption(index);
		this._checkSingleAndEmpty();
	}

	removeChilds(index)
	{
		this.list.removeChilds(index);
		this._checkSingleAndEmpty();
	}

	clearOptions()
	{
		this.list.clearOptions();
		this._checkSingleAndEmpty();
	}

	_checkSingleAndEmpty()
	{
		if (!this.list.length)
		{
			this.elements.main.classList.add("empty");
			if (this.search) this.search.changeInputType(2);
		}
		else if (this.list.length == 1)
		{
			this.elements.main.classList.add("single");
			this.elements.main.classList.remove("empty");
			if (this.search) this.search.changeInputType(2);
		}
		else
		{
			this.elements.main.classList.remove("empty");
			this.elements.main.classList.remove("single");
			if (this.search) this.search.changeInputType(1);
		}
	}

	_update(data)
	{
		var value = data.value,
			text  = data.text;

		if (!data.length)
			text = this.textEmpty;

		else if (data.index == -1)
			text = this.placeholder;

		this.text  = text;
		this.value = value;

		if (this.search)
			this.search.setValue(text);

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
	["length", "index", "value", "isInputDecor"],
	["find", "choose", "addOption", "removeOption", "removeChilds", "clearOptions", "open", "close", "toggle"]
);