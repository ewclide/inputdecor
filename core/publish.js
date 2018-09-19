function construct(TheClass, args)
{
	args = Array.from(args);
    args.unshift(0);
	return new (Function.bind.apply(TheClass, args))();
}

export function publish(TheClass, fields, methods)
{
	var list = {};

    function Output()
    {
    	var id = Math.random();
    	list[id] = construct(TheClass, arguments);
    	this.id = id;
    }

    if (fields)
    for (var i = 0; i < fields.length; i++)
    {
    	let field = fields[i];

    	Object.defineProperty(Output.prototype, field, {
    		configurable : false,
    		get : function(){
    			return list[this.id][field];
    		},
    		set : function(value){
    			list[this.id][field] = value;
    		}
    	});
    }

    if (methods)
    for (var i = 0; i < methods.length; i++)
    {
    	let method = methods[i];
    	Output.prototype[method] = function(){
    		var obj = list[this.id];
            return obj[method].apply(obj, arguments);
    	}
    }

    return Output;
}