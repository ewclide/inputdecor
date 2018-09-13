(function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {return null}
        else return this.parentElement.closest(selector)
      };
}(Element.prototype));

if (!("from" in Array))
	Object.defineProperty( Array, "from", {
		
		enumerable : false,
		configurable : true,
		writable : true,

		value : (function(){

			function getLength(obj)
			{
				var length = 0;

				if ("length" in obj)
				{
					length = parseInt(obj.length, 10);
					if (isNaN(length) || length < 0) length = 0;
				}
				
				return length; 
			}

			function getValue(mapFn, target, key)
			{
				if (mapFn)
				{
					if (thisArg !== undefined) return mapFn.call(thisArg, target[key], key);
					else return mapFn(target[key], key);
				}
				else return target[key];
			}

			return function(target /*, mapFn, thisArg */)
			{
				if (target === null || target === undefined)
					throw new TypeError("Array.from: cannot convert first argument to object");

				target = Object(target);

				var result = [],
				length = getLength(target),
				mapFn = arguments[1],
				thisArg = arguments[2];

				if (!Array.isArray(target))
					for (var key = 0; key < length; key++)
					{
						var desc = Object.getOwnPropertyDescriptor(target, key);

						if (desc !== undefined && desc.enumerable)
							result.push(getValue(mapFn, target, key));

						else result.push(undefined);
					}

					else result = target;

					return result;
				};

			})()
	});
