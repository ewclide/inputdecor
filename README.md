#Roll Input Decorator
-------------

### Description

	allows to decorate input elements

### Agruments

**File**
- text - text on button
- multiple - uses multyfile mode
- filesCount - defines max files count on multyfile mode
- maxSize - defines max size of the each files count on multyfile mode
- maxSumSize - defines max size of the all files count on multyfile mode
- drop - uses drag and drop mode // need to add
- class - add your class to wrapper

**Checkbox**
- have not special options, but support standart attribute checked

**Radio**
- remove - allows to deactivate radio
- support standart attribute checked

**Select**
- speed - defines speed of rolling animation
- rollup - defines speed of rolling animation
- unselected - add unselected value to the list
- unselectedText - text of unselected option
- class - add your class to wrapper
- onchange - allows to define the onchange callback
- text - text on button

	select input also can use on html list <ul><li><a href="">Text</a></li></ul>

### How to use

	it have two way for initialize:
	1) create div element with class "inputdecor" and define attributes wich must begin from "data-" + option
	2) use javascript notation // need to update

### Examples

```html
	<input type="checkbox" class="inputdecor">
	<input type="radio" name="radio" class="inputdecor" value="2" data-remove="false">
	<select class="inputdecor" data-rollup="true" data-speed="150" data-unselected="true">
		<option value="1">value 1</option>
		<option value="2">value 2</option>
		<option value="3">value 3</option>
		<option value="4">value 4</option>
		<option value="5">value 5</option>
	</select>
	<input type="file" name="file" class="inputdecor"
		data-multiple="true"
		data-files-count="3"
		data-drop="true"
		data-text="choose"
		data-class="test"
	>
```

### Result

![linebar on page](result.jpg)

-------------
Thank's for using.
Developed by Ustinov Maxim - [ewclide](http://vk.com/ewclide)