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

	class Box
	{
		constructor(){}

		create(type)
		{
			var self = this

			this.elem.hide();

			this.box = $(document.createElement("div"));
			this.box.addClass("inputdecor-" + type);
			this.elem.before(this.box);

			this.button = $(document.createElement("div"));
			this.button.addClass("button");
			if (this.active) this.button.addClass("active");
			this.box.append(this.button);

			this.box.append(this.elem);

			this.button.bind("click", function(){
				self.toogle();
			});
		}

		activate()
		{
			this.button.addClass("active");
			this.elem.prop({ 'checked': true });
			this.active = true;
		}

		deactivate()
		{
			this.button.removeClass("active");
			this.elem.prop({ 'checked': false });
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
		constructor(options)
		{
    		var type = options.elem.attr("type") || options.elem[0].tagName.toLowerCase();
			if (type == "ul" || type == "select")
				this.input = new Select(options);
			else if (type == "checkbox")
				this.input = new Checkbox(options);
			else if (type == "radio")
				this.input = new Radio(options);
			else if (type == "file")
				this.input = new File(options);
  		}
	}

	class File
	{
		constructor(options)
		{
			this.init(options);
		}

		init(options)
		{
			var self = this;
			this.elem = options.elem;
			this.files = [];

			this.settings = {
				text : options.text || this.elem.attr("data-text") || "Выберите файл",
				multiple : options.multiple || this.elem.attr("data-multiple") || false,
				filesCount : options.filesCount || this.elem.attr("data-files-count") || false,
				maxSize : options.maxSize || this.elem.attr("data-max-size") || false,
				maxSumSize : options.maxSumSize || this.elem.attr("data-max-sumsize") || false,
				drop : options.drop || this.elem.attr("data-drop") || false,
				class : options.class || this.elem.attr("data-class") || false
			}

			this.create(this.settings);
		}

		create(settings)
		{
			var self = this;

			this.elem.hide();

			if (settings.multiple)
				this.elem[0].setAttribute("multiple", "");

			this.button = $(document.createElement("button"));
			this.button.addClass("button");
			this.button.text(settings.text);
			this.button.click(function(){
				self.elem.click();
			});

			var wrapper = $(document.createElement("div"));
				wrapper.addClass("inputdecor-file");

			if (settings.class)
				wrapper.addClass(settings.class);

			this.filesList = $(document.createElement("div"));
			this.filesList.addClass("files-list");

			this.elem.after(wrapper);
			wrapper.append(this.button);
			wrapper.append(this.filesList);
			wrapper.append(this.elem);

			this.elem.change(function(e){
				self.files = self.getFiles(self.elem[0].files);
				self.showFiles(self.files);
				self.elem.val('');
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
				self.elem.val('');
			}
			else self.filesList.append(list);
		}
	}

	class Checkbox extends Box
	{
		constructor(options)
		{
			super();
			this.init(options);
			super.create("checkbox");
		}

		init(options)
		{
			var self = this;
			this.elem = options.elem;
			this.name = options.elem.attr("name");
			this.value = options.elem.val();
			this.active = (function(){
				var checked = self.elem.prop("checked") || self.elem.attr("checked");
				if (checked) return true;
				else return false;
			})();
		}
	}

	class Radio extends Box
	{
		constructor(options)
		{
			super();
			var self = this;
			this.init(options);
			super.create("radio");
			this.button.unbind("click");
			this.button.bind("click", function(){

				if (!self.remove && !self.active)
					self.activate();

				else if (self.remove)
					self.toogle();
			});
		}

		init(options)
		{
			var self = this;
			this.elem = options.elem;
			this.name = options.elem.attr("name");
			this.value = options.elem.val();
			this.active = (function(){
				var checked = self.elem.prop("checked") || self.elem.attr("checked");
				if (checked) return true;
				else return false;
			})();
			this.remove = checkBoolean(options.remove || self.elem.attr("data-remove"), true);
			this.radios = $('input[type=radio][name="' + this.name + '"]');
			this.elem[0].inputdecor = this;
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
		constructor(options)
		{
			this.init(options);
		}

		init(options)
		{
			var self = this;
			this.elem = options.elem;
			this.name = options.elem.attr("name");
			this.value = options.elem.val();
			this.speed = parseInt(this.elem.attr("data-speed")) || 250;
			this.rollup = self.elem.attr("data-rollup") || false;
			this.unselected = self.elem.attr("data-unselected") || false;
			this.maxHeight = 100;
			this.active = false;
			this.text = (function(){
				var text = "Выберите из списка";
				var active = self.elem.find("li.active");
				if (active.length) text = active.text();
				else
				{
					var attr = self.elem.attr("data-text");
					if (attr) text = attr;
				}
				return text;
			})();
			this.class = this.elem.attr("data-class") || "";
			this.create();
		}

		create()
		{
			var self = this;

			this.elem.hide();

			this.select = $(document.createElement("div"));
			this.select.addClass("inputdecor-select");
			if (this.class) this.select.addClass(this.class);
			this.elem.before(this.select);

			this.button = $(document.createElement("button"));
			this.button.addClass("button");
			this.button.text(this.text);
			this.select.append(this.button);

			this.label = $(document.createElement("span"));
			this.label.addClass("label");
			this.select.append(this.label);

			this.hidden = $(document.createElement("input"));
			this.hidden.attr("type", "hidden");
			if (this.name) this.hidden.attr("name", this.name);
			this.hidden.val(this.value);
			this.select.append(this.hidden);

			this.list = $(document.createElement("ul"));
			this.list.addClass("list");

			var list = this.elem[0].innerHTML;
				list = list.replace(/option+/g, "li");

			if (this.unselected)
				this.list.append('<li>'+this.text+'</li>');

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

			this.elem.remove();

			this.button.click(function(e){
				self.toogle();
			});

			this.list.click(function(e){
				if (e.target.tagName == "LI")
				{
					var target = $(e.target);
					self.hidden.val(target.attr("value"));
					self.button.text(target.text());
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

	$.fn.decorate = function(options)
    {
        this.each(function(){
            if (options) options.elem = $(this);
            else options = { elem: $(this) };
            this.binder = new Decorator(options);
        });
    }

    $(document).ready(function(){
        $('.inputdecor').decorate();
    });

})();