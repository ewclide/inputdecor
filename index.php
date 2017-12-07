<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="js/jquery.js"></script>
	<link rel="stylesheet" href="src/inputdecor.css">
	<script src="src/inputdecor.js"></script>
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
	<ul class="inputdecor" data-rollup="true" data-unselected="true" data-onchange="change" data-class="myclass" data-text="select from" data-unselected-text="unselected">
		<li data-test="asd" value="value 1" selected><a href="#">value 1</a></li>
		<li value="value 2"><a href="#">value 2</a></li>
		<li value="value 3"><a href="#">value 3</a></li>
		<li value="value 4"><a href="#">value 4</a></li>
		<li value="value 5"><a href="#">value 5</a></li>
	</ul><br><br>
	<input type="file" name="file" class="inputdecor" multiple
		data-text-button="choose"
		data-text-unselected="no select"
		data-class="myclass"
		data-close="true"
		data-size="true"
		data-max-count="3"
	>
</body>
</html>