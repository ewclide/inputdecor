export var DOC = {
	create : function(tag, attr, css)
	{
		var $element = $(document.createElement(tag));
		if (typeof attr == "string") $element.addClass(attr);
		else if (typeof attr == "object") $element.attr(attr);
		if (css) $element.css(css);
		return $element;
	}
}

export function getOption(attr, $element, setting, def, prefix = "data-")
{
	var value = $element.attr(prefix + attr);

	if (value == undefined)
		value = setting !== undefined ? setting : def;

	if (value === "") value = true;
	else if (value === "false") value = false;

	return value;
}

export function checkBoolean(value, def)
{
	if (typeof value == "string")
		if (value == "true") value = true;
	else if (value == "false") value = false;
	else value = def;

	else if (value == undefined)
		value = def;
	return value;
}

export function wrapCallBack(callback)
{
	if (typeof callback == "string")
		return new Function("e", callback);

	else if (typeof callback == "function")
		return callback;

	else return function(){}
}