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

		this.source.after(this.box);
		this.box.appendChild(this.button);
		this.button.appendChild(this.label);
		this.box.appendChild(this.source);

		this.button.onclick = () => this.toggle();
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
		this.button.classList.add("active");
		this.source.checked = true;
		this.source.dispatchEvent(new Event("change"));
		this.active = true;
	}

	switchOff()
	{
		this.button.classList.remove("active");
		this.source.checked = false;
		this.source.dispatchEvent(new Event("change"));
		this.active = false;
	}

	toggle()
	{
		this.active ? this.switchOff() : this.switchOn();
	}
}