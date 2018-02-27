import { checkBoolean } from './func';
import {Box} from './box';

export class Radio extends Box
{
	constructor($element)
	{
		super();

		var self = this;

		this.init($element);
		this.create("radio");
		this.button.unbind("click");
		this.button.bind("click", function(){

			if (!self.remove && !self.active)
				self.activate();

			else if (self.remove)
				self.toogle();
		});
	}

	init($element)
	{
		var self = this;
		this.$element = $element;
		this.name = $element.attr("name");
		this.value = $element.val();
		this.active = (function(){
			var checked = self.$element.prop("checked") || self.$element.attr("checked");
			if (checked) return true;
			else return false;
		})();
		this.remove = checkBoolean(self.$element.attr("data-remove"), false);
		this.radios = $('input[type=radio][name="' + this.name + '"]');
		this.$element[0].inputstyler = this;
	}

	deactiveOther(current)
	{
		this.radios.each(function(){
			if (this.inputstyler !== current)
				this.inputstyler.deactivate();
		});
	}

	activate()
	{
		super.activate();
		this.deactiveOther(this);
	}
}