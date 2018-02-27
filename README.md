# Input Decorator

### File options

- **textButton** - adds text to button
- **textUnselected** - adds unselected text
- **className** - adds class to wrapper (for attribute simple "class")
- **close** - adds close button
- **size** - shows sizes of the files
- **maxCount** - defines max files count on multyfile mode
- **drop** - *in developing...*

### Checkbox options

> have not special options, but support standart attribute checked
	
### Radio options

- **remove** - allows to deactivate radio
- **support** standart attribute checked

### Select options

- **speed** - animation time in milliseconds
- **rollup** - adds button which roll up the list
- **className** - adds class to wrapper (for attribute simple 'class')
- **index** - adds button which roll up the list
- **selected** - index of selected option
- **unselected** - adds unselected text
- **textButton** - defines default button text
- **textUnselected** - defines unselected text
- **search**
	- **textEmpty** - defines text of nothing finded element
	- **inButton** - append search input instead the button
	- **caseSense** - configures case sensitivity
	- **fullWord** - configures full word searching
	- **beginWord** - configures searching by only first characters in the words

### Select methods

- **addOption** - append option to the list
- **choose** - choose option by index
- **close** - close the list
- **open** - open the list
- **toogle** - toogle the list

### Select callbacks

- **onChoose** - callback for choose in the list
- **onReady** - callback for ready the list

> Select decorator also support grouping options.  
> For this add "data-group" attribute in the "li" element and specify list inside  
> or specify the childs options as childs array when use addOption method.  
> Warning! You can use it only for "ul" elements!

### How to use

	create div element with attribute "data-inputdecor" and define attributes wich must begin from "data-" + option

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
		data-on-choose="function(e){ console.log(e) }"
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
		<li value="value 1" selected><a href="#">value 1</a></li>
		...
		<li value="value N" data-group="value N" selected >
			<ul>
				<li value="value N.1"><a href="#">value s.1</a></li>
				<li value="value N.2"><a href="#">value s.2</a></li>
				<li value="value N.3"><a href="#">value s.3</a></li>
			</ul>
		</li>
	</ul>

	-->
	
```

```js

$(".decorate").inputDecor("select", {
	unselected : true,
	rollup : true,
	search :
	{
		inButton  : true,
		beginWord : true
	},
	onReady : function(list)
	{
		list.addOption({
			html   : "<a href='#'>option 1</a>",
			childs : [
				{
					html   : "<a href='#'>option 1.1</a>",
					text   : "option 1.1",
					value  : 1,
				},
				{
					html   : "<a href='#'>option 1.2</a>",
					text   : "option 1.2",
					value  : 2,
				}
			]
		})
	},
	onChoose : onChoose
});

```

### Result

![result](img/result.jpg)

-------------
Thank's for using.  
Developed by **Ustinov Maxim** - [ewclide](http://vk.com/ewclide)