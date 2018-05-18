import { Decorator } from './decorator';
import { setAPI } from './api';

var output = {},
	methods = [
		"find",
		"choose",
		"addOption",
		"count",
		"open",
		"close",
		"toogle",
		"activate",
		"deactivate",
		"clear"
	];

$.fn.inputDecor = function(type, settings)
{
	this.each(function(){
		this._decorator = new Decorator($(this), type, settings);
	});
}

$('[data-inputdecor]').inputDecor();

setAPI(output, methods);

$.inputDecor = function(query)
{
	output.$elements = $(query);
	return output;
}