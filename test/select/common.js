var test = new InputDecor(document.getElementById("test"), {
    placeholder : "Test placeholder",
    unselected  : "-- nothing --",
    search : {
        textEmpty : "-- nothing founded --",
        inButton  : true,
        beginWord : true
    },
    onChange : function(e){
        console.log(e)
    }
})

console.log(test)
console.log("----------------------")

// test.clearOptions();

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

test.addOption({
    text  : "second option",
    value : "second"
});

test.addOption({
    text  : "child option 4",
    value : 4,
    child : "main"
});

test.select("main", 3);
// test.removeOption(1);
// test.clearOptions();
console.log(test.index, test.nodeIndex);