<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="jquery.js"></script>
	<link rel="stylesheet" href="inputdecor.css">
	<script src="inputdecor.js"></script>
</head>
<body>
	<input type="checkbox" class="inputdecor"><br><br>
	<input type="radio" name="radio" class="inputdecor" checked value="1">
	<input type="radio" name="radio" class="inputdecor" value="2" data-remove="true">
	<input type="radio" name="radio" class="inputdecor" value="3">
	<input type="radio" name="radio" class="inputdecor" value="4">
	<input type="radio" name="radio" class="inputdecor"><br><br>
	<script>
		var change = function(e)
		{
			console.log(e);
		}
	</script>
	<ul class="inputdecor" data-rollup="true" data-unselected="true" data-onchange="change">
		<li data-test="asd" value="value 1" selected>value 1</li>
		<li value="value 2">value 2</li>
		<li value="value 3">value 3</li>
		<li value="value 4">value 4</li>
		<li value="value 5">value 5</li>
	</ul><br><br>
	<input type="file" name="file" class="inputdecor"
		data-multiple="true"
		data-files-count="3"
		data-drop="true"
		data-text="choose"
		data-class="test">
</body>
</html>