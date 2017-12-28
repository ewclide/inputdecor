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

			this.$elements = {
				main : $element
			};

			this.settings = {
				type   : $element[0].tagName.toLowerCase(),
				active : false,
				name   : $element.attr("name"),
				value  : $element.val(),
				speed  : parseInt($element.attr("data-speed")) || 250,
				rollup : $element.attr("data-rollup") || false,
				class  : $element.attr("data-class") || "",
				unselected    : $element.attr("data-unselected") || false,
				selectedIndex : $element.attr("data-selected-index"),
				unselectedText: $element.attr("data-unselected-text") || "not selected",
				buttonText    : $element.attr("data-button-text") || "select from list",
				changeFunc    : $element.attr("data-onchange") || function(){}
			}

			this.options = [];

			this._build();
		}

		_getIndex()
		{
			if (this.settings.type == "select")
				return this.$elements.main[0].selectedIndex;

			else if (this.settings.type == "ul")
				return this.$elements.main.find("li[selected]").index();
		}

		_createList(list)
		{
			if (this.settings.type == "select")
			{

				if (this.settings.unselected)
					this.$elements.main.prepend('<option>' + this.settings.unselectedText + '</option>');

				this._appendOptions(list, "option");
			}
			else if (this.settings.type == "ul")
			{
				if (this.settings.unselected)
					this.$elements.main.prepend('<li>' + this.settings.unselectedText + '</li>');

				this._appendOptions(list, "li");
			}
		}

		_appendOptions(list, tag)
		{
			var self = this, options = this.$elements.main.find(tag);

			if (options.length)
				options.each(function(){

					var current = $(this),
						text = current.text(),
						$element = DOC.create("li").text(text);

					self.options.push({
						$element : $element,
						value : current.val() || current.attr("value"),
						text : text
					});

					list.append($element);
				});
		}

		_build()
		{
			var self = this,
				$elements = this.$elements,
				settings = this.settings;

			$elements.main.hide();

            settings.changeFunc = eval("(function(){ return " + settings.changeFunc + "})()");

			$elements.select  = DOC.create("div", "inputdecor-select " + (settings.class ? settings.class : "" ));
			$elements.button  = DOC.create("button", "button");
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
			);

			$elements.main.before($elements.select);
			$elements.select.append($elements.hidden);
			$elements.select.append($elements.button);
			$elements.select.append($elements.label.append($elements.marker));
			$elements.select.append($elements.wrapper.append($elements.list));
			this._createList($elements.list);

			if (settings.rollup)
			{
				$elements.rollup = DOC.create("span", "rollup");
				$elements.list.append($elements.rollup);
				$elements.rollup.click(function(e){
					self.close();
				});
			}

			if (settings.buttonText)
				$elements.button.text(settings.buttonText);

			if (this.options.length <= 1)
			{
				$elements.select.addClass("empty");
				this.choose(0);
			}
			else if (settings.selectedIndex) this.choose(settings.selectedIndex);
			else this.choose(this._getIndex());

			$elements.button[0].onclick = function(e){
				self.toogle();
			};

			$elements.label[0].onclick = function(e){
				self.toogle();
			};

			$elements.list.click(function(e){
				var target;

				if (e.target.tagName != "LI") target = $(e.target).closest("li");
				else target = $(e.target);

				if (target.length)
					self.choose(target.index());
			});

			document.body.addEventListener("click", function(e){
				var parent = $(e.target).closest(".inputdecor-select");
				if (!parent.length)
					self.close();
			});
		}

		choose(index)
		{
			var target = this.options[index];

			this.options.forEach(function(option){
				option.$element.removeAttr("selected");
			});

			target.$element.attr("selected", "");

			if (target.text == this.settings.unselectedText)
			{
				var text = this.settings.buttonText || this.settings.unselectedText;
				this.$elements.hidden.val("");
				this.$elements.button.text(text);
			}
			else
			{
				this.$elements.hidden.val(target.value);
				this.$elements.button.text(target.text);
			}
			
			this.$elements.main[0].selectedIndex = index;
			this.$elements.main.change();

			this.settings.changeFunc(target.value);

			this.close();
		}

		open()
		{
			if (this.options.length > 1)
			{
				this.$elements.wrapper.css("transform", "scaleY(1)");
				this.$elements.button.addClass("active");
				this.$elements.label.addClass("active");
				this.settings.active = true;
			}
		}

		close()
		{
			if (this.options.length > 1)
			{
				this.$elements.wrapper.css("transform", "scaleY(0)");
				this.$elements.button.removeClass("active");
				this.$elements.label.removeClass("active");
				this.settings.active = false;
			}
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