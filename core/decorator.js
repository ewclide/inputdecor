import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { Select } from './select';
import { InputFile } from './file';

export class Decorator
{
	constructor($element, settings = {})
	{
		var type = $element.attr("type") || $element[0].tagName.toLowerCase();

		if (type == "ul" || type == "select")
			this.input = new Select($element, type, settings);

		else if (type == "checkbox")
			this.input = new Checkbox($element, settings);

		else if (type == "radio")
			this.input = new Radio($element, settings);

		else if (type == "file")
			this.input = new InputFile($element, settings);
	}
}