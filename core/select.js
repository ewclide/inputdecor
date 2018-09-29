import { createElement, fetchSettings, getCallBack } from './func';
import { List } from './list';
import { Search } from './search';
import { publish } from './publish';
import { animation } from './anim';

var def = {
	maxHeight    : 250,
	rollup       : false,
	className    : '',
	index        : -1,
	nodeIndex    : undefined,
	value        : null,
	unselected   : '-- not selected --',
	textEmpty    : 'Nothing to choose',
	placeholder  : 'Select value',
	zIndex       : 1,
	search       : false,
	onChange     : null,
	onReady      : null
}

var attrs = {
	nodeIndex : 'node-index',
	maxHeight : 'max-height',
	textEmpty : 'text-empty',
	className : 'class',
	onChange  : 'on-change',
	onReady   : 'on-ready'
}

var searchDef = {
	textEmpty : '-- not found --',
	inButton  : false,
	caseSense : false,
	wholeWord : false,
	beginWord : false
}

var searchAttrs = {
	textEmpty : 'search-empty',
	inButton  : 'search-inbutton',
	caseSense : 'search-case',
	wholeWord : 'search-whole',
	beginWord : 'search-begin'
}

class LocSelect
{
	constructor(source, type, settings)
	{
		source.style.display = 'none';

		settings = fetchSettings(settings, def, attrs, source);

		this.source = source;
		this.type = type;
		this.active = false;
		this.value = source.value;
		this.name = source.name;
		this.text  = settings.placeholder;
		this.placeholder = settings.placeholder;
		this.textEmpty = settings.textEmpty;
		this.onChange;
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
        	main       : createElement('div', ['inputdecor-select', settings.className]),
	        buttonCont : createElement('div', 'button-wrapper'),
	        button     : createElement('button', 'button', null, settings.placeholder),
	        label      : createElement('button', 'label'),
	        expandCont : createElement('div', 'expand-wrapper'),
	        listCont   : createElement( 'div', 'list-wrapper', {
	        	position        : 'absolute',
	        	minWidth        : '100%',
	        	overflow        : 'hidden',
	        	transform       : 'scaleY(0)',
	        	transformOrigin : '100% 0'
	        }),
	        hidden     : createElement('input', {
	        	type  : 'hidden',
	        	name  : this.name,
	        	value : this.value
	        })
        }

        this.list = new List(this.source, {
        	type        : this.type,
        	unselected  : settings.unselected,
        	index       : settings.index,
        	nodeIndex   : settings.nodeIndex,
        	value       : settings.value,
        	maxHeight   : settings.maxHeight,
        	dispEvent   : (e) => this._dispatchEvent(e),
        	onChange    : (e) => {
        		this._update(e);
        		this.close();
        	}
        });

        if (settings.search)
        	this.search = new Search(this.list, settings.search);

        this.onChange = getCallBack(settings.onChange);
		this.onReady  = getCallBack(settings.onReady);

		this._buildElements(settings);
		this._listenEvents(settings);
		this._checkSingleAndEmpty();
	}

	_dispatchEvent(e)
	{
		if (typeof this.onChange == 'function') this.onChange(e);
	}

	_buildElements(settings)
	{
		var elements = this.elements;

		if (this.source.parentNode)
		{
			this.source.insertAdjacentElement('afterend', elements.main);
			this.source.parentNode.removeChild(this.source);
		}

		elements.expandCont.appendChild(this.list.element);
		elements.listCont.appendChild(elements.expandCont);
		elements.buttonCont.appendChild(elements.button);
		elements.buttonCont.appendChild(elements.label);
		elements.main.appendChild(elements.buttonCont);
		elements.main.appendChild(elements.listCont);
		elements.main.appendChild(elements.hidden);

		if (this.search)
		{
			if (settings.search.inButton)
			{
				this.search.setValue(this.text);
				elements.buttonCont.insertAdjacentElement('afterbegin', this.search.elements.main);
				elements.buttonCont.removeChild(elements.button);
			}
			else
			{
				elements.expandCont.insertAdjacentElement('afterbegin', this.search.elements.main);
			}

			elements.expandCont.appendChild(this.search.elements.empty);
		}

		if (settings.rollup)
		{
			elements.rollup = createElement('button', 'rollup');
			elements.expandCont.appendChild(elements.rollup);
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
			settings.onReady();
	}

	_checkSingleAndEmpty()
	{
		if (!this.list.wholeLength)
		{
			this.elements.main.classList.add('empty');
			if (this.search) this.search.changeInputType(2);
		}
		else if (this.list.wholeLength == 1)
		{
			this.elements.main.classList.add('single');
			this.elements.main.classList.remove('empty');
			if (this.search) this.search.changeInputType(2);
		}
		else
		{
			this.elements.main.classList.remove('empty');
			this.elements.main.classList.remove('single');
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

		this.elements.hidden.value = value !== undefined ? value : null;
		this.elements.button.innerText = text;
	}

	get isInputDecor()
	{
		return true;
	}

	get length()
	{
		return this.list.length;
	}

	get wholeLength()
	{
		return this.list.wholeLength;
	}

	get index()
	{
		return this.list.index;
	}

	get nodeIndex()
	{
		return this.list.nodeIndex;
	}

	find(value)
	{
		if (this.search)
			return this.search.find(value);
		else console.error("This instance have not search element!");
	}

	select(index, nodeIndex)
	{
		var e = this.list.select(index, nodeIndex);
		this._dispatchEvent(e);
		this._update(e);
		this.close();

		return e;
	}

	selectByValue(value, dispatch = true)
	{
		var e = this.list.selectByValue(value);
		this._update(e);
		this.close();

		if (dispatch) this._dispatchEvent(e);

		return e;
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

	clearGroup(name)
	{
		this.list.clearGroup(name);
		this._checkSingleAndEmpty();
	}

	clearOptions()
	{
		this.list.clearOptions();
		this._checkSingleAndEmpty();
	}

	open()
	{
		if (this.list.wholeLength <= 1) return;

		this.elements.listCont.classList.add(animation.expandClass);
		this.elements.expandCont.classList.add(animation.shrinkClass);
		this.elements.button.classList.add('active');
		this.elements.label.classList.add('active');
		this.active = true;

		if (this.search) this.search.clear(true);
	}

	close()
	{
		this.elements.listCont.classList.remove(animation.expandClass);
		this.elements.expandCont.classList.remove(animation.shrinkClass);
		this.elements.button.classList.remove('active');
		this.elements.label.classList.remove('active');
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
	['length', 'wholeLength', 'index', 'nodeIndex', 'value', 'isInputDecor'],
	['find', 'select', 'selectByValue',  'addOption', 'removeOption', 'clearGroup', 'clearOptions', 'open', 'close', 'toggle']
);