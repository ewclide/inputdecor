function onChoose(e)
{
	console.log(e);
}

$(document).ready(function(){

	$(".select").inputDecor("select", {
		unselected : true,
		rollup : true,
		search :
		{
			inButton  : true,
			beginWord : true
		},
		onReady : function(obj)
		{
			obj.addOption({
				html   : "<a href='#'>test</a>",
				childs : [
					{
						html   : "<a href='#'>test 1</a>",
						text   : "test_1",
						value  : 1,
					},
					{
						html   : "<a href='#'>test 2</a>",
						text   : "test_2",
						value  : 2,
					}
				]
			})
		},
		onChoose : onChoose
	});

});