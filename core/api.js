function _callMethod(target, name, data)
{
	var result = [];

	target.$elements.each(function(){
		if (this._decorator && typeof this._decorator.input[name] == "function")
			result.push(this._decorator.input[name](data));
	});

	return result.length == 1 ? result[0] : result;
}

export function setAPI(target, methods)
{
	methods.forEach(name => {
		target[name] = function(data){
			return _callMethod(target, name, data);
		}
	});
}