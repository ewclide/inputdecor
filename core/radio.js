import { Box } from './box';
import { publish } from './publish';

class LocRadio extends Box
{
	constructor(source, settings)
	{
		super();

		this.id = Math.random();
		this.source = source;
		this.remove = settings.remove || source.getAttribute('data-remove') !== null;

		this.init();
		this.create('radio');

		this.button.onclick = () => {
			if (!this.remove && !this.active) this.switchOn();
			else if (this.remove) this.toggle();
		};
	}

	init()
	{
		this.name = this.source.name;
		this.active = this.source.checked;
		this._list = document.querySelectorAll(`input[type=radio][name='${this.name}']`);
		this.source._inputDecor = this;
	}

	switchOn()
	{
		for (var i = 0; i < this._list.length; i++)
			this._list[i]._inputDecor.switchOff();

		super.switchOn();
	}
}

export var Radio = publish(
    LocRadio,
    ['name', 'checked', 'value', 'isInputDecor'],
    ['switchOn', 'switchOff', 'toggle']
);