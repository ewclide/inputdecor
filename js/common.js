function onChoose(e)
{
	console.log(e);
}

$(".select").inputDecor("select", {
	unselected : true,
	rollup : true,
	search :
	{
		inButton  : true,
		beginWord : true
	},
	onChoose : function(e)
	{
		console.log(e);
	}
});

var target = $.inputDecor('#target'),
	count = target.count();

target.addOption({
	html   : "<a href='#'>option " + count + "</a>",
	childs : [
	{
		text   : "option " + count +".1",
		value  : 1
	},
	{
		text   : "option " + count +".2",
		value  : 2
	}
	]
});