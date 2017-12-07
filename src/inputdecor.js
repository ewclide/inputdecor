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

	class Box
	{
		constructor(){}

		create(type)
		{
			var self = this

			this.$element.hide();

			this.box = DOC.create("div", "inputdecor-" + type);
			this.button = DOC.create("div", "button " + (this.active ? "active" : false));
			this.label = DOC.create("span", "label");

			this.$element.before(this.box);
			this.box.append(this.button);
			this.button.append(this.label);
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
			$elements.select  = DOC.create("div", "inputdecor-select " + (settings.class ? settings.class : "" ));
			$elements.button  = DOC.create("button", "button").text(settings.text);
			$elements.label   = DOC.create("span", "label");
			$elements.marker  = DOC.create("span", "marker");
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
			$elements.label.append($elements.marker);
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
			$elements.button[0].onclick = function(e)
			{
				self.toogle();
			};

			$elements.label[0].onclick = function(e)
			{
				self.toogle();
			};

			$elements.list.click(function(e){

				var target, value, text;

				if (e.target.tagName != "LI") target = $(e.target).closest("li");
				else target = $(e.target);

				if (target.length)
				{
					value = target.attr("value");
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
				var parent = $(e.target).closest(".inputdecor-select");
				if (!parent.length)
					self.close();
			});
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

	class File
	{
		constructor($element)
		{
			var self = this, settings;
			this.$element = $element;
			this.$elements = {};
			this.settings = {
				textButton : this.$element.attr("data-text-button") || "Прикрепить файл",
				textUnselected : this.$element.attr("data-text-unselected") || "файл не выбран",
				class : this.$element.attr("data-class") || false,
				close : this.$element.attr("data-close") || false,
				size  : this.$element.attr("data-size") || false,
				maxCount : this.$element.attr("data-max-count") || 3,
			}
			this._create(this.settings);
		}

		_create(settings)
		{
			var self = this, $elements = this.$elements;

			this.$element.hide();

			$elements.wrapper = DOC.create("div", "inputdecor-file " + (settings.class ? settings.class : ""));
			$elements.unselected = DOC.create("span", "unselected").text(settings.textUnselected);
			$elements.list = DOC.create("div", "files-list");
			$elements.close = DOC.create("span", "close");
			$elements.close[0].onclick = function()
			{
				self._hideFiles();
			};

			$elements.button = DOC.create("button", "button").text(settings.textButton)
			.click(function(e){
				e.preventDefault();
				self.$element.click();
			});

			this.$element.after($elements.wrapper);
			$elements.wrapper.append($elements.button);
			$elements.wrapper.append($elements.list);
			$elements.list.append($elements.unselected);
			$elements.wrapper.append(this.$element);

			this.$element.change(function(e){
				if (self.$element[0].files)
				{
					var files = self._getFiles(self.$element[0].files);
					self._showFiles(files);
				}
			});
		}

		_getFiles(files)
		{
			var list = [];

			for (var i = 0; i < files.length; i++)
				list.push(files[i]);

			return list;
		}

		_showFiles(files)
		{
			var result = "";

			for (var i = 0; i < files.length; i++ )
			{
				result += "<div class='file'><label>" + files[i].name + "</label>";

				if (this.settings.size)
					result += "<span>" + Math.round(files[i].size / 1024) + "kb</span>";

				result += "</div>";

				if (i >= this.settings.maxCount)
				{
					this._hideFiles();
					alert("максимальное количество файлов - " + this.settings.maxCount + "!");
					return;
				}
			}

			this.$elements.list.empty();
			this.$elements.list.append(result);

			if (this.settings.close)
				this.$elements.list.append(this.$elements.close);

			else this.$elements.list.append("<span></span>");
		}

		_hideFiles()
		{
			this.$element.val('');
			this.$elements.list.empty();
			this.$elements.list.append(this.$elements.unselected);
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