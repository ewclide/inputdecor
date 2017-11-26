'use strict'

;(function(){

	var DOC = {
		create : function(tag, attr, css)
		{
			var $element = $(document.createElement(tag));
			if (typeof attr == "string") $element.addClass(attr);
			else if (typeof attr == "object") $element.attr(attr);
			if (css) $element.css(css);
			return $element;
		}
	}

	function checkBoolean(value, def)
	{
		if (typeof value == "string")
			if (value == "true") value = true;
			else if (value == "false") value = false;
			else value = def;

		else if (value == undefined)
			value = def;
		return value;
	}

	function getAllAttrs($element)
	{
		var result = {},
			attrs = $element[0].attributes;

		for (var i = 0; i < attrs.length; i++)
			result[attrs[i].name] = attrs[i].value;

		return result;
	}

	class Box
	{
		constructor(){}

		create(type)
		{
			var self = this

			this.$element.hide();

			this.box = DOC.create("div", "inputdecor-" + type);
			this.button = DOC.create("div", "button " + (this.active ? "active" : false));

			this.$element.before(this.box);
			this.box.append(this.button);
			this.box.append(this.$element);

			this.button.bind("click", function(){
				self.toogle();
			});
		}

		activate()
		{
			this.button.addClass("active");
			this.$element.prop({ 'checked': true });
			this.$element.change();
			this.active = true;
		}

		deactivate()
		{
			this.button.removeClass("active");
			this.$element.prop({ 'checked': false });
			this.$element.change();
			this.active = false;
		}

		toogle()
		{
			if (this.active) this.deactivate();
			else this.activate();
		}
	}

	class Decorator
	{
		constructor($element)
		{
    		var type = $element.attr("type") || $element[0].tagName.toLowerCase();
			if (type == "ul" || type == "select")
				this.input = new Select($element);
			else if (type == "checkbox")
				this.input = new Checkbox($element);
			else if (type == "radio")
				this.input = new Radio($element);
			else if (type == "file")
				this.input = new File($element);
  		}
	}

	class File
	{
		constructor($element)
		{
			this.init($element);
		}

		init($element)
		{
			var self = this;
			this.$element = $element;
			this.files = [];

			this.settings = {
				text : this.$element.attr("data-text") || "Выберите файл",
				multiple : this.$element.attr("data-multiple") || false,
				filesCount : this.$element.attr("data-files-count") || false,
				maxSize : this.$element.attr("data-max-size") || false,
				maxSumSize : this.$element.attr("data-max-sumsize") || false,
				drop : this.$element.attr("data-drop") || false,
				class : this.$element.attr("data-class") || false
			}

			this.create(this.settings);
		}

		create(settings)
		{
			var self = this;

			this.$element.hide();

			if (settings.multiple)
				this.$element[0].setAttribute("multiple", "");

			var wrapper = DOC.create("div", "inputdecor-file " + (settings.class ? settings.class : false));
			this.filesList = DOC.create("div", "files-list");
			this.button = DOC.create("button", "button").text(settings.text);
			this.button.click(function(){
				self.$element.click();
			});

			this.$element.after(wrapper);
			wrapper.append(this.button);
			wrapper.append(this.filesList);
			wrapper.append(this.$element);

			this.$element.change(function(e){
				if (self.$element[0].files)
				{
					self.files = self.getFiles(self.$element[0].files);
					self.showFiles(self.files);
					self.$element.val('');
				}
			});
		}

		getFiles(files)
		{
			var list = [];

			for (var i = 0; i < files.length; i++)
				list.push(files[i]);

			return list;
		}

		showFiles(files)
		{
			var self = this;

			var list = $(document.createElement("ul")),
				error = "",
				sumsize = 0;

			if (files.length > self.settings.filesCount)
				error = "Максимальное количество файлов - " + self.settings.filesCount;
			else
			files.forEach(function(file){

				if (self.settings.maxSumSize)
					sumsize += file.size;

				if (sumsize && sumsize > self.settings.maxSumSize)
				{
					error = "Превышен суммарный размер файлов"
					+ ".\nМаксимальный суммареый размер - " + Math.round(self.settings.maxSumSize / 1024) + "kb";
					return;
				}

				if (self.settings.maxSize && file.size > self.settings.maxSize)
				{
					error = "Превышен размер файла \"" + file.name + "\""
					+ ".\nМаксимальный размер - " + Math.round(self.settings.maxSize / 1024) + "kb";
					return;
				}

				var size = Math.round(file.size / 1024),
					name = file.name;

				list.append("<li><p>" + name + "</p><span>" + size + "kb</span>" + "</li>");
			});

			self.filesList.empty();

			if (error)
			{
				alert(error);
				self.$element.val('');
			}
			else self.filesList.append(list);
		}
	}

	class Checkbox extends Box
	{
		constructor($element)
		{
			super();
			this.init($element);
			super.create("checkbox");
		}

		init($element)
		{
			var self = this;
			this.$element = $element;
			this.name = $element.attr("name");
			this.value = $element.val();
			this.active = (function(){
				var checked = self.$element.prop("checked") || self.$element.attr("checked");
				if (checked) return true;
				else return false;
			})();
		}
	}

	class Radio extends Box
	{
		constructor($element)
		{
			super();
			var self = this;
			this.init($element);
			super.create("radio");
			this.button.unbind("click");
			this.button.bind("click", function(){

				if (!self.remove && !self.active)
					self.activate();

				else if (self.remove)
					self.toogle();
			});
		}

		init($element)
		{
			var self = this;
			this.$element = $element;
			this.name = $element.attr("name");
			this.value = $element.val();
			this.active = (function(){
				var checked = self.$element.prop("checked") || self.$element.attr("checked");
				if (checked) return true;
				else return false;
			})();
			this.remove = checkBoolean(self.$element.attr("data-remove"), false);
			this.radios = $('input[type=radio][name="' + this.name + '"]');
			this.$element[0].inputdecor = this;
		}

		deactiveOther(current)
		{
			this.radios.each(function(){
				if (this.inputdecor !== current)
					this.inputdecor.deactivate();
			});
		}

		activate()
		{
			super.activate();
			this.deactiveOther(this);
		}
	}

	class Select
	{
		constructor($element)
		{
			var self = this;
			this.$element = $element;
			this.$elements = {};
			this.settings = {
				active : false,
				name   : $element.attr("name"),
				value  : $element.val(),
				speed  : parseInt(this.$element.attr("data-speed")) || 250,
				rollup : self.$element.attr("data-rollup") || false,
				unselected : self.$element.attr("data-unselected") || false,
				unselectedText : self.$element.attr("data-unselected-text") || "Не выбрано",
				class : this.$element.attr("data-class") || "",
				changeFunc : this.$element.attr("data-onchange") || function(){},
				text  : (function()
				{
					var text;
					if (self.$element.find("li.active").length) text = active.text();
					else text = self.$element.attr("data-text") || "Выберите из списка";
					return text;
				})()
			}

			this._build();
		}

		_build()
		{
			var self = this,
				$elements = this.$elements,
				settings = this.settings,
				list = "",
				options;

			this.$element.hide();

			/*-------add unselected--------*/
			if (settings.unselected)
			{
				var element = this.$element[0];

				if (element.tagName.toLowerCase() == "select")
				{
					this.$element.prepend('<option>' + settings.unselectedText + '</option>');
					if (element.selectedIndex == 1) element.selectedIndex = 0;
				}
				else if (element.tagName.toLowerCase() == "ul")
				{
					this.$element.prepend('<li>' + settings.unselectedText + '</li>');
				}	
			}

			/*-------prepare changeFunc--------*/
            settings.changeFunc = eval("(function(){ return " + settings.changeFunc + "})()");

			/*-------create elements--------*/
			$elements.select  = DOC.create("div", settings.class ? settings.class : "inputdecor-select");
			$elements.button  = DOC.create("button", "button").text(settings.text);
			$elements.label   = DOC.create("span", "label");
			$elements.hidden  = DOC.create("input", { "type" : "hidden", "name" : settings.name }).val(settings.value);
			$elements.list    = DOC.create("ul", "list"),
			$elements.wrapper = DOC.create(
				"div",
				"list-wrapper",
				{
					"position" : "absolute",
					"width" : "100%",
					"transform" : "scaleY(0)",
					"transform-origin" : "100% 0",
					"transition" : settings.speed + "ms"
				}
			)

			/*-------append elements--------*/
			this.$element.before($elements.select);
			$elements.select.append($elements.button);
			$elements.select.append($elements.label);
			$elements.select.append($elements.hidden);
			$elements.select.append($elements.wrapper);
			$elements.wrapper.append($elements.list);

			/*-------create option list--------*/
			options = this.$element.find("option");

			if (options.length)
			{
				options.each(function(){
					var option = $(this);
					if (option.attr("selected"))
					{
						$elements.hidden.val(option.val());
						$elements.button.text(option.text());
						list += '<li selected >' + option.text() + '</li>';
					}
					else
					{
						list += '<li>' + option.text() + '</li>';
					}
				});

				$elements.select.append(this.$element);
			}
			else
			{
				list = this.$element[0].innerHTML;
				this.$element.remove();
			}

			$elements.list.append(list);

			/*-------create rollup--------*/
			if (settings.rollup)
			{
				$elements.rollup = DOC.create("span", "rollup");
				$elements.list.append($elements.rollup);
				$elements.rollup.click(function(e){
					self.close();
				});
			}

			/*-------add event listeners--------*/
			$elements.button.click(function(e){
				self.toogle();
			});

			$elements.list.click(function(e){
				if (e.target.tagName == "LI")
				{
					var target = $(e.target),
						value = target.attr("value"),
						text = target.text();

					$elements.list.find("li").removeAttr("selected");

					if (text == settings.unselectedText)
					{
						$elements.hidden.val("");
						$elements.button.text(settings.text);
					}
					else
					{
						target.attr("selected", "");
						$elements.hidden.val(value);
						$elements.button.text(text);
					}

					self.close();
					self.$element[0].selectedIndex = target.index();
					self.$element.change();
					settings.changeFunc(value);
				}
			});

			document.body.addEventListener("click", function(e){
				if (e.target.parentNode != $elements.select[0]) self.close();
			});

			console.log(this);
		}

		open()
		{
			this.$elements.wrapper.css("transform", "scaleY(1)");
			this.$elements.button.addClass("active");
			this.$elements.label.addClass("active");
			this.settings.active = true;
		}

		close()
		{
			this.$elements.wrapper.css("transform", "scaleY(0)");
			this.$elements.button.removeClass("active");
			this.$elements.label.removeClass("active");
			this.settings.active = false;
		}

		toogle()
		{
			if (this.settings.active) this.close();
			else this.open();
		}
		
	}

	$.fn.decorate = function()
    {
        this.each(function(){
            this.binder = new Decorator($(this));
        });
    }

    $(document).ready(function(){
        $('.inputdecor').decorate();
    });

})();