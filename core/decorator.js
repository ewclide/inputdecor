import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { Select } from './select';
import { InputFile } from './file';

export class Decorator
{
	constructor($element, type, settings)
	{
		if (typeof type != "string")
		{
			type = $element.attr("type") || $element[0].tagName.toLowerCase();
			settings = {}
		}

		if (type == "ul" || type == "select")
			this.input = new Select($element, type, settings);

		else if (type == "checkbox")
			this.input = new Checkbox($element, type, settings);

		else if (type == "radio")
			this.input = new Radio($element, type, settings);

		else if (type == "file")
			this.input = new InputFile($element, type, settings);
	}
}