'use strict'

;(function(){

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

			this.button.click(function(){
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
			else this.input = new Checkbox(options);
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
			this.init(options);
			super.create("radio");
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
			this.speed = parseInt(this.elem.attr("data-inputdecor-speed")) || 250;
			this.rollup = self.elem.attr("data-inputdecor-rollup") || false;
			this.active = false;
			this.text = (function(){
				var text = "Выберите из списка";
				var active = self.elem.find("li.active");
				if (active.length) text = active.text();
				else
				{
					var attr = self.elem.attr("data-inputdecor-text");
					if (attr) text = attr;
				}
				return text;
			})();
			this.class = this.elem.attr("data-inputdecor-class") || "";
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
			this.list.append('<li>'+this.text+'</li>');
			this.list.append(list);
			this.select.append(this.list);

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

		open()
		{
			this.list.show(this.speed);
			this.label.addClass("active");
			this.active = true;
		}

		close()
		{
			this.list.hide(this.speed);
			this.label.removeClass("active");
			this.active = false;
		}

		toogle()
		{
			if (this.active) this.close();
			else this.open();
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