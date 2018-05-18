import {Box} from './box';

export class Checkbox extends Box
{
	constructor($element, type, settings)
	{
		super();
		this.init($element);
		this.create("checkbox");
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
	}
}