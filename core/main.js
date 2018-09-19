import './polyfill';
import { decorate } from './decorate';

var instances = {}

class InputDecor
{
	constructor(element, settings = {})
	{
		this.ids = [];

		if (typeof element == "string")
		{
			var list = document.querySelectorAll(element);

			for (var i = 0; i < list.length; i++)
			{
				let item = list[i],
					id = item.getAttribute("id") || Math.random(),
					instance = decorate(item, settings);
					instances[id] = instance;

				this.ids.push(id);
			}

			if (list.length == 1)
				return instances[this.ids[0]];
		}
		else if (element.nodeType == 1)
		{
			var id = element.getAttribute("id") || Math.random(),
				instance = decorate(element, settings);
				instances[id] = instance;

			this.ids.push(id);

			return instances[id];
		}
	}

	get isInputDecorList()
	{
		return true;
	}

	evoke(method, args)
	{
		var result = [];

		this.ids.forEach( id => {

			let value, obj = instances[id];

			if (obj && typeof obj[method] == "function")
				value = obj[method].apply(obj, args);

			if (value !== undefined)
				result.push(value);
		});

		return result.length == 1 ? result[0] : result;
	}

	getById(id)
	{
		if (this.ids.includes(id) && id in instances)
			return instances[id];
	}
}

InputDecor.getById = function(id)
{
	if (id in instances)
		return instances[id];
}

var first = new InputDecor("[data-inputdecor]");

window.InputDecor = InputDecor;

document.body.addEventListener("click", function(e){
	var parent = e.target.closest(".inputdecor-select");
	if (!parent)
		for (var i in instances){
			let item = instances[i];
			'close' in item ? item.close() : false
		}
});