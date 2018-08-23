var test = new InputDecor("#test", {
    placeholder : "Test search placeholder",
    unselected : "-- nothing --",
    search : {
        empty : "-- nothing founded --",
        inButton  : true,
        beginWord : true
    },
    onChoose : function(e){
        console.log(e)
    }
})

// function onChoose(e)
// {
//   console.log(e);
// }

// var select = new InputDecor("select", {
//     unselected : true,
//     rollup : true,
//     search : {
//         inButton  : true,
//         beginWord : true
//     },
//     onChoose : function(e){
//         console.log(e);
//     }
// });

var target = InputDecor.getById('target'),
    length = target.length;

target.addOption({
    html  : "<a href='#'>option " + length + "</a>",
    text  : "option " + length,
    value : "new value"
});