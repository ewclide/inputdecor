function getBrowser()
{
    var ua = navigator.userAgent;  

    if (ua.search(/Chrome/) > 0)  return 'Chrome';
    if (ua.search(/Firefox/) > 0) return 'Firefox';
    if (ua.search(/Opera/) > 0)   return 'Opera';
    if (ua.search(/Safari/) > 0)  return 'Safari';
    if (ua.search(/MSIE/) > 0)    return 'IE';

    return false;
}

export var browser = getBrowser();

export function createElement(tag, attr, styles, text)
{
	var element = document.createElement(tag);

	if (typeof attr == "string")
		element.classList.add(attr);

	else if (Array.isArray(attr))
		attr.forEach( cls => cls ? element.classList.add(cls) : false );

	else if (typeof attr == "object")
		for (var name in attr) element.setAttribute(name, attr[name]);

	if (styles)
	{
		for (var name in styles)
			element.style[name] = styles[name];
	}

	if (text) element.innerText = text;

	return element;
}

export function fetchSettings(settings, defaults, attributes, element)
{
	var result = {}

	for (var i in defaults)
	{
		if (settings[i] === undefined)
		{
			var attr = element ? element.getAttribute('data-' + (attributes[i] || i)) : null,
				num = +attr;

			if (attr === "" || attr === "true")
				attr = true;

			else if (attr === "false")
				attr = false;

			else if (attr !== null && !isNaN(num))
				attr = num;

			result[i] = attr !== null ? attr : defaults[i];
		}
		else result[i] = settings[i];
	}

	return result;
}

export function getCallBack(str)
{
	if (typeof str == "string")
		return new Function("e", str);

	else if (typeof str == "function")
		return str;

	else return null;
}