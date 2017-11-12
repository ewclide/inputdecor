<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="jquery.js"></script>
	<link rel="stylesheet" href="inputdecor.css">
	<script src="inputdecor.min.js"></script>
</head>
<body>
	<input type="checkbox" class="inputdecor"><br><br>
	<input type="radio" name="radio" class="inputdecor" checked value="1">
	<input type="radio" name="radio" class="inputdecor" value="2" data-remove="true">
	<input type="radio" name="radio" class="inputdecor" value="3">
	<input type="radio" name="radio" class="inputdecor" value="4">
	<input type="radio" name="radio" class="inputdecor"><br><br>
	<select class="inputdecor" data-rollup="true" data-speed="150" data-unselected="true">
		<option value="1">value 1</option>
		<option value="2">value 2</option>
		<option value="3">value 3</option>
		<option value="4">value 4</option>
		<option value="5">value 5</option>
	</select><br><br>
	<input type="file" name="file" class="inputdecor"
		data-multiple="true"
		data-files-count="3"
		data-drop="true"
		data-text="choose"
		data-class="test">
</body>
</html>