var test = new InputDecor(document.getElementById("test"), {
    placeholder : "Test placeholder",
    unselected  : "-- nothing --",
    search : {
        textEmpty : "-- nothing founded --",
        inButton  : true,
        beginWord : true
    },
    onChoose : function(e){
        console.log(test.value)
    }
})

console.log(test)
console.log("----------------------")

test.clearOptions();

// test.addOption({
//     text  : "main option",
//     group : "main"
// });

// test.addOption([
//     {
//         text  : "child option 1",
//         value : 1,
//         child : "main"
//     },
//     {
//         text  : "child option 2",
//         value : 2,
//         child : "main"
//     },
//     {
//         text  : "child option 3",
//         value : 3,
//         child : "main"
//     }
// ]);

// test.addOption({
//     text  : "second option",
//     value : "second"
// });

// test.choose(1);

// test.addOption({
//     text  : "child option 4",
//     value : 4,
//     child : "main"
// });

// test.removeOption(1);
// test.removeOption(0);
// test.removeChilds(0);
// test.clearOptions();