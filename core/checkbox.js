import { Box } from './box';
import { publish } from './publish';

class LocCheckbox extends Box
{
	constructor(source, settings)
	{
		super();
		this.source = source;
		this.name = settings.name || this.source.name;
		this.active = this.source.checked
		this.create("checkbox");
	}
}

export var Checkbox = publish(
    LocCheckbox,
    ["name", "checked", "value"],
    ["switchOn", "switchOff", "toggle"]
);