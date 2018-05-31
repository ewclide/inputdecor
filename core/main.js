import { decorate } from './decorate';

$.fn.inputDecor = function(settings)
{
	this.each(function(){
		this._decorator = decorate($(this), settings);
	});
}

$('[data-inputdecor]').inputDecor();

$.inputDecor = function(query)
{
	return {
		invoke : function(name, data)
		{
			var result = [];

			$(query).each(function(){
				var res;
				
				if (this._decorator && typeof this._decorator[name] == "function")
					res = this._decorator[name](data);

				if (res !== undefined) result.push(this._decorator[name](data));
			});

			return result.length == 1 ? result[0] : result;
		}
	}
}