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
		html   : "<a href='#'>option " + count +".1</a>",
		text   : "test_1",
		value  : 1,
	},
	{
		html   : "<a href='#'>option " + count +".2</a>",
		text   : "test_2",
		value  : 2,
	}
	]
});