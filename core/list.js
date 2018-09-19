import { createElement } from './func';

export class List
{
	constructor(source, settings)
	{
		this.element;
		this.index = settings.index || -1;
		this.nodeIndex = settings.nodeIndex;
		this.options = [];
		this.groups = {};
		this.onChange = settings.onChange;
		this.dispEvent = settings.dispEvent;
		this.active;

		if (settings.type == 'select')
			this._createFromSelect(source, settings);
		else if (settings.type == 'ul')
			this._createFromUL(source, settings);

		if (settings.unselected)
			this.unselected = this._createUnselected(settings.unselected);

		if (settings.value) this.selectByValue(settings.value);
		else this.select(this.index, this.nodeIndex);

		this.element.onclick = (e) => {
			var index = e.target._decorIndex,
				nodeIndex = e.target._decorNodeIndex;

			if (!index) index = e.target.closest('li')._decorIndex;
			if (!nodeIndex) nodeIndex = e.target.closest('li')._decorNodeIndex;

			this.dispEvent(this.select(index, nodeIndex));
		}
	}

	get length()
	{
		return this.options.length;
	}

	get wholeLength()
	{
		var length = this.options.length;

		for (var i in this.groups)
			length += this.groups[i].length;

		return length;
	}

	_createUnselected(text)
	{
		var element = createElement('li', 'unselected', null, text);
			element._decorIndex = -1;

		this.element.insertAdjacentElement('afterbegin', element);

		return element;
	}

	_createFromSelect(source, settings)
	{
		var list = source.options;

		this.element = createElement('ul', 'list', {
			maxHeight : settings.maxHeight + 'px',
			overflowY : 'auto'
		});

		if (list.length)
		{
			let frag = document.createDocumentFragment();

			for (var i = 0; i < list.length; i++)
			{
				let element = list[i],
					option = this._createOption({
						value    : element.value || element.getAttribute('value'),
						text     : element.innerText,
						html     : element.innerHTML,
						selected : element.getAttribute('selected') !== null,
						className: element.getAttribute('class'),
						group    : element.getAttribute('data-group'),
						child    : element.getAttribute('data-child')
					});

				frag.appendChild(option.element);
			}

			this.element.appendChild(frag);
		}
	}

	_createFromUL(source, settings)
	{
		var list = source.querySelectorAll('li');

		this.element = source;
		source.style.display = '';
		source.style.maxHeight = settings.maxHeight + 'px';
		source.style.overflowY = 'auto';
		source.classList.add('list');

		for (var i = 0; i < list.length; i++)
		{
			let element = list[i];

			this._createOption({
				element  : element,
				value    : element.value || element.getAttribute('value'),
				text     : element.innerText,
				html     : element.innerHTML,
				selected : element.getAttribute('selected') !== null,
				className: element.getAttribute('class'),
				group    : element.getAttribute('data-group'),
				child    : element.getAttribute('data-child')
			})
		}
	}

	_createOption(data)
	{
		var element = data.element || createElement('li', data.className),
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

		if (data.html)
			element.innerHTML = data.html;
		else if (data.text)
			element.innerText = data.text

		if (data.selected)
		{
			this.index = option.index;
			this.nodeIndex = option.nodeIndex;
		}

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

		option.group = group;
		option.groupName = name;
		option.index = this.options.length;
		option.element._decorIndex = option.index;

		this.groups[name] = group;
		this.options.push(option);
	}

	_createChild(name, option)
	{
		var group = this.groups[name],
			lastElement = group.length ? group[group.length - 1].element : group._parentOption.element;
				
		option.append = lastElement;
		option.index = group._parentOption.index;
		option.nodeIndex = group.length;

		option.element._decorIndex = option.index;
		option.element._decorNodeIndex = option.nodeIndex;
		option.element.classList.add('child');

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
				this._appendOption(option, frag);
			});

			this.element.appendChild(frag);
		}
		else
		{
			let option = this._createOption(data);
			this._appendOption(option, this.element);
		}

		if (this.options.length == 1) this.select(0);
		else if (before == 0) this.select(this.index);
	}

	_appendOption(option, target)
	{
		if (option.append)
		{
			option.append.insertAdjacentElement('afterend', option.element);
			option.append = undefined;
		}
		else target.appendChild(option.element);
	}

	select(index, nodeIndex)
	{
		var data = {
			length : this.length,
			wholeLength : this.wholeLength
		};

		if (typeof index == 'string')
		{
			var group = this.groups[index];
			if (group) index = group._parentOption.index
			else return;
		}
		else if (typeof index != 'number') return;

		if (this.active)
			this.active.classList.remove('active');

		if (index == -1 && !this.unselected) index = 0;

		if (index == -1 && this.unselected)
		{
			data.index  = index;
			this.index  = index;
			this.active = this.unselected;
			this.unselected.classList.add('active');
		}
		else if (index < this.options.length && index >= 0)
		{
			var option = this.options[index],
				group  = option.group,
				node   = group && group[nodeIndex];

			if (node) option = node;

			data.value = option.value;
			data.text  = option.text;
			data.index = option.index;
			this.index = option.index;

			if (option.nodeIndex !== undefined)
			{
				data.nodeIndex = option.nodeIndex;
				data.groupLength = group.length;
				this.index = option.index;
				this.nodeIndex = option.nodeIndex;
			}

			this.active = option.element;
			option.element.classList.add('active');
		}

		if (data && typeof this.onChange == 'function')
			this.onChange(data);

		return data;
	}

	selectByValue(value)
	{
		var index = -1, nodeIndex;

		for (var i = 0; i < this.options.length; i++)
			if (this.options[i].value == value)
			{
				index = this.options[i].index;
				break;
			}

		if (index == -1)
		for (var name in this.groups)
		{
			var group = this.groups[name];

			for (var i = 0; i < group.length; i++)
				if (group[i].value == value)
				{
					nodeIndex = group[i].nodeIndex;
					index = group[i].index;
					break;
				}
		}

		return this.select(index, nodeIndex);
	}

	removeOption(index)
	{
		var option = this.options[index];

		if (option && option.group)
		{
			this.clearGroup(option.group, false);
			delete this.groups[option.groupName];
		}

		this.element.removeChild(option.element);
		this.options.splice(index, 1);

		this._rebuildOptions();
	}

	clearGroup(name, disp = true)
	{
		var group = typeof name == 'string' ? this.groups[name] : name;
			
		group.forEach( option => {
			this.element.removeChild(option.element);
			if (this.nodeIndex == option.nodeIndex)
			{
				if (disp) this.select(option.index);
				this.nodeIndex = undefined;
			}
		});
	}

	clearOptions()
	{
		this.element.innerHTML = '';
		this.options = [];
		this.groups = {};
		this.index = -1;
		this.nodeIndex = undefined;
		this.active = null;
		this.select(-1);

		if (this.unselected)
			this.element.appendChild(this.unselected);
	}

	_rebuildOptions()
	{
		this.options.forEach((option, i) => {
			option.index = i;
			option.element._decorIndex = i;
		})

		if (!this.length) this.select(-1);
		else if (this.index >= this.length) this.select(this.length - 1);
		else this.select(this.index, this.nodeIndex);
	}
}