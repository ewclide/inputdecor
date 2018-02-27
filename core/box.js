import { DOC } from './func';

export class Box
{
	constructor(){}

	create(type)
	{
		var self = this

		this.$element.hide();

		this.box = DOC.create("div", "inputdecor-" + type);
		this.button = DOC.create("button", "button " + (this.active ? "active" : ""));
		this.label = DOC.create("span", "label");

		this.$element.before(this.box);
		this.box.append(this.button);
		this.button.append(this.label);
		this.box.append(this.$element);

		this.button.bind("click", function(){
			self.toogle();
		});
	}

	activate()
	{
		this.button.addClass("active");
		this.$element.prop({ 'checked': true });
		this.$element.change();
		this.active = true;
	}

	deactivate()
	{
		this.button.removeClass("active");
		this.$element.prop({ 'checked': false });
		this.$element.change();
		this.active = false;
	}

	toogle()
	{
		if (this.active) this.deactivate();
		else this.activate();
	}
}