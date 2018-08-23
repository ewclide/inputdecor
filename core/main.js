import { decorate, decorateNew } from './decorate';

var instances = {}

class InputDecor
{
	constructor(query, settings = {})
	{
		this.ids = [];

		var list = document.querySelectorAll(query);

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

// document.body.addEventListener("click", function(e){
//  var parent = $(e.target).closest(".inputdecor-select");
//  if (!parent.length) self.close();
// });