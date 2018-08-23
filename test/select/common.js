var test = new InputDecor("#test", {
    placeholder : "Test placeholder",
    unselected : "-- nothing --",
    search : {
        empty : "-- nothing founded --",
        inButton : true,
        beginWord : true
    },
    onChoose : function(e){
        console.log(e)
    }
})

console.log(test)

test.addOption({
    text  : "main option",
    group : "main"
});

test.addOption([
    {
        text  : "child option 1",
        value : 1,
        child : "main"
    },
    {
        text  : "child option 2",
        value : 2,
        child : "main"
    },
    {
        text  : "child option 3",
        value : 3,
        child : "main"
    }
]);

// test.choose(1);

test.removeOption(0);
// test.removeOption(1);
// test.removeOption(1);
// test.clearOptions();