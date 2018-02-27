var DOC = {
	create : function(tag, attr, css)
	{
		var $element = $(document.createElement(tag));
		if (typeof attr == "string") $element.addClass(attr);
		else if (typeof attr == "object") $element.attr(attr);
		if (css) $element.css(css);
		return $element;
	}
}

function checkBoolean(value, def)
{
	if (typeof value == "string")
		if (value == "true") value = true;
	else if (value == "false") value = false;
	else value = def;

	else if (value == undefined)
		value = def;
	return value;
}

function wrapCallBack(callback)
{
	if (typeof callback == "string")
		return eval("(function(){ return " + callback + "})()");

	else if (typeof callback == "function")
		return callback;
}

export { DOC, checkBoolean, wrapCallBack }