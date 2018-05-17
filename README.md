# Input Decorator

### File settings

- **textButton** - add text to button
- **textUnselected** - add unselected text
- **className** - add class to wrapper (for attribute - simple "class")
- **close** - add close button
- **size** - show sizes of the files
- **maxCount** - define max files count on multyfile mode
- **drop** - *in developing...*

### Checkbox settings

> have not special options, but support standart attribute checked
	
### Radio settings

- **remove** - allows to deactivate radio
- **support** standart attribute checked

### Select settings

- **speed** - animation time in milliseconds
- **rollup** - add button which collapse the list
- **className** - add class to the wrapper (for attribute - simple 'class')
- **selected** - index of the selected option ( Also you can use standart  attribute "selected" )
- **unselected** - add unselected element to the list
- **textButton** - define default text to the button
- **textUnselected** - define text to unselected element
- **search**
	- **textEmpty** - define text to "not found" element
	- **inButton** - append the search input instead the button
	- **caseSense** - configure case sensitivity searching
	- **wholeWord** - configure whole word searching
	- **beginWord** - configure searching by only first characters in the words

### Select settings

- **addOption** - append option to the list
- **choose** - choose option by index
- **close** - close the list
- **open** - open the list
- **toogle** - toogle the list

### Select callbacks

- **onChoose** - callback on choose in the list
- **onReady** - callback on ready the list

### How to use

html:

	just add attribute "data-inputdecor" and use settings as "data-" attributes.  

JavaScript:

	$(selector).inputDecor(type, settings)

> Select decorator also support grouping options ( It work only for "ul" elements ).  
> For using it just add "data-group" attribute in the "li" element and create "ul" list inside.  
> In JavaScript (for using addOption method) - specify array of childs in object of settings as you can see below.

### Examples

```html

	<input data-inputdecor type="checkbox" name="checkbox" value="radio">
	
	<input data-inputdecor type="radio" name="radio" value="radio" data-remove="false">
	
	<input type="file" name="file" multiple
		data-inputdecor
		data-text-button="choose"
		data-text-unselected="no select"
		data-class="myclass"
		data-close="true"
		data-size="true"
		data-max-count="3"
	>
	
	<select
		data-inputdecor
		data-rollup="true"
		data-unselected="true"
		data-on-choose="someAction"
		data-class="myclass"
		data-text-button="Select from"
		data-text-unselected="-- unselected --"
	>
		<option value="1">value 1</option>
		<option value="2">value 2</option>
		<option value="3" selected >value 3</option>
	</select>

	<!--

	ALSO YOU CAN USE

	<ul data-inputdecor data-attributes ... >

		<li value="1" ><a href="#">value 1</a></li>
		<li value="2" selected ><a href="#">value 2</a></li>

		...

		<li value="N" data-group="title or link" [value] >
			<ul>
				<li value="N.1"><a href="#">value N.1</a></li>
				<li value="N.2"><a href="#">value N.2</a></li>
				<li value="N.3"><a href="#">value N.3</a></li>
			</ul>
		</li>

	</ul>

	-->
	
```
<a name="childs"></a>

```js

$(".some").inputDecor("select", {
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

```

### Result

![result](img/result.jpg)

-------------
Thank's for using.  
Developed by **Ustinov Maxim** - [ewclide](http://vk.com/ewclide)