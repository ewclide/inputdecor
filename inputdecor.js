'use strict'

;(function(){

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

			this.box = $(document.createElement("div"));
			this.box.addClass("inputdecor-" + type);
			this.$element.before(this.box);

			this.button = $(document.createElement("div"));
			this.button.addClass("button");
			if (this.active) this.button.addClass("active");
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
			this.active = true;
		}

		deactivate()
		{
			this.button.removeClass("active");
			this.$element.prop({ 'checked': false });
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

			this.button = $(document.createElement("button"));
			this.button.addClass("button");
			this.button.text(settings.text);
			this.button.click(function(){
				self.$element.click();
			});

			var wrapper = $(document.createElement("div"));
				wrapper.addClass("inputdecor-file");

			if (settings.class)
				wrapper.addClass(settings.class);

			this.filesList = $(document.createElement("div"));
			this.filesList.addClass("files-list");

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
			this.init($element);
		}

		init($element)
		{
			var self = this;
			this.$element = $element;
			this.name = $element.attr("name");
			this.value = $element.val();
			this.speed = parseInt(this.$element.attr("data-speed")) || 250;
			this.rollup = self.$element.attr("data-rollup") || false;
			this.unselected = self.$element.attr("data-unselected") || false;
			this.unselectedText = self.$element.attr("data-unselected-text") || "Не выбрано";
			this.maxHeight = 100;
			this.active = false;
			this.text = (function(){

				var text;

				if (self.$element.find("li.active").length) text = active.text();
				else text = self.$element.attr("data-text") || "Выберите из списка";

				return text;

			})();
			this.class = this.$element.attr("data-class") || "";
			this.create();
		}

		create()
		{
			var self = this;

			this.$element.hide();

			this.select = $(document.createElement("div"));
			this.select.addClass("inputdecor-select");
			if (this.class) this.select.addClass(this.class);
			this.$element.before(this.select);

			this.button = $(document.createElement("button"));
			this.button.addClass("button");
			this.button.text(this.text);
			this.select.append(this.button);

			this.label = $(document.createElement("span"));
			this.label.addClass("label");
			this.select.append(this.label);

			this.hidden = $(document.createElement("input"));
			this.hidden.attr("type", "hidden");
			this.hidden.attr(getAllAttrs(this.$element));
			if (this.name) this.hidden.attr("name", this.name);
			this.hidden.val(this.value);
			this.select.append(this.hidden);

			this.list = $(document.createElement("ul"));
			this.list.addClass("list");

			var list = this.$element[0].innerHTML;
				list = list.replace(/option+/g, "li");

			if (this.unselected)
				this.list.append('<li unselected >'+this.unselectedText+'</li>');

			this.list.append(list);

			this.wrapper = $(document.createElement("div"));
			this.wrapper.addClass("list-wrapper");
			this.wrapper.css({
					"overflow" : "hidden",
					"position" : "absolute",
					"width" : "100%"
				});

			this.wrapper.append(this.list);
			this.select.append(this.wrapper);

			this.wrapper.ready(function(){
                self.maxHeight = self.wrapper.outerHeight();
                self.wrapper.height(0);
            });

			if (this.rollup)
			{
				this.rollup = $(document.createElement("span"));
				this.rollup.addClass("rollup");
				this.list.append(this.rollup);
				this.rollup.click(function(e){
					self.close();
				});
			}

			this.$element.remove();

			this.button.click(function(e){
				self.toogle();
			});

			this.list.click(function(e){
				if (e.target.tagName == "LI")
				{
					var target = $(e.target);
					if (target.text() == self.unselectedText)
					{
						self.hidden.val("");
						self.button.text(self.text);
					}
					else
					{
						self.hidden.val(target.attr("value"));
						self.button.text(target.text());
					}
					
				}
			});

			document.body.addEventListener("click", function(e){
				if (e.target.parentNode != self.select[0]) self.close();
			});
		}

		open(speed)
		{
			this.wrapper.animate({ height : this.maxHeight }, speed !== undefined ? speed : this.speed );
			this.button.addClass("active");
			this.label.addClass("active");
			this.active = true;
		}

		close(speed)
		{
			this.wrapper.animate({ height : 0 }, speed !== undefined ? speed : this.speed );
			this.button.removeClass("active");
			this.label.removeClass("active");
			this.active = false;
		}

		toogle(speed)
		{
			if (this.active) this.close(speed);
			else this.open(speed);
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