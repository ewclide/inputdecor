import { createElement } from './func';

export class Box
{
	constructor(){}

	create(type)
	{
		this.source.style.display = "none";

		this.box = createElement("div", "inputdecor-" + type);
		this.button = createElement("button", "button");
		this.label = createElement("span", "label");

		if (this.active)
			this.button.classList.add("active");

		this.source.insertAdjacentElement('afterend', this.box);
		this.box.appendChild(this.button);
		this.button.appendChild(this.label);
		this.box.appendChild(this.source);

		this.button.onclick = () => this.toggle();
	}

	get isInputDecor()
	{
		return true;
	}

	get value()
	{
		return this.source.value;
	}

	get checked()
	{
		return this.active;
	}

	switchOn()
	{
		var event = document.createEvent("Event"); // EI support
			event.initEvent("click", true, true);

		this.source.dispatchEvent(event);
		this.source.checked = true;
		this.button.classList.add("active");
		this.active = true;
	}

	switchOff()
	{
		var event = document.createEvent("Event"); // EI support
		 	event.initEvent("click", true, true);
		 	
		this.source.dispatchEvent(event);
		this.button.classList.remove("active");
		this.source.checked = false;
		this.active = false;
	}

	toggle()
	{
		this.active ? this.switchOff() : this.switchOn();
	}
}