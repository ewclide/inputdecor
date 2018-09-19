import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { Select } from './select';
import { InputFile } from './file';

export function decorate(element, settings = {})
{
    var type = element.getAttribute("type") || element.tagName.toLowerCase();

	if (type == "ul" || type == "select")
		return new Select(element, type, settings);

	else if (type == "checkbox")
		return new Checkbox(element, settings);

	else if (type == "radio")
		return new Radio(element, settings);

	else if (type == "file")
		return new InputFile(element, settings);
}