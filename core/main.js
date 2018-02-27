import { Decorator } from './decorator';

$.fn.inputDecor = function(type, settings)
{
	this.each(function(){
		this.decorator = new Decorator($(this), type, settings);
	});
}

$(document).ready(function(){
	$('[data-inputdecor]').inputDecor();
});