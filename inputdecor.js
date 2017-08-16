;(function(){
	function getUrlParams()
	{
		var search = location.search;
		if(search)
		{
			result = {};
			search = search.replace("?", "");
			search = search.split("&");
			search.forEach(function(p){
				p = p.split("=");
				result[p[0]] = p[1];
			});
			return result;
		}
		else return false;
	}

	function setUrlParams(options)
	{
		var request = "?";
		for (var i in options) request += i + "=" + options[i] + "&";
			return request.slice(0, -1);
	}

	function Decorator(options)
	{
		this.init(options);
	}
	Decorator.prototype.init = function(options)
	{
		var type = options.elem.attr("type") || options.elem[0].tagName.toLowerCase();
		if (type == "ul" || type == "select")
			this.input = new Select(options);
		else if (type == "checkbox")
			this.input = new Checkbox(options);
		else if (type == "calendar")
			this.input = new Calendar(options);
	}

	function Calendar(options)
	{
		var self = this;
		this.elem = options.elem;
		this.active = false;
		this.text = (function(){
			var attr = self.elem.attr("data-inputdecor-text");
			if (attr) return attr;
			else return "Выберите дату";
		})();
		this.from = (function(){
			var attr = self.elem.attr("data-inputdecor-from");
			if (attr)
			{
				attr = attr.split(".");
				return +new Date(attr[2], attr[1], attr[0]);
			}
			else return null;
		})();
		this.to = (function(){
			var attr = self.elem.attr("data-inputdecor-to");
			if (attr)
			{
				attr = attr.split(".");
				return +new Date(attr[2], attr[1], attr[0]);
			} 
			else return null;
		})();
		this.init(options);
	}
	Calendar.prototype.init = function(options)
	{
		var self = this;

		this.elem.hide();

		var date = new Date();

		this.now = {
			year  : date.getFullYear(),
			month : date.getMonth(),
			day   : date.getDate()
		}

		this.used = {
			year  : self.now.year,
			month : self.now.month,
			day   : self.now.day
		}

		this.box = $(document.createElement("div"));
		this.box.addClass("inputdecor-box");
		this.box.attr("id", this.elem.attr("id"));
		this.elem.before(this.box);

		this.calendar = $(document.createElement("div"));
		this.calendar.addClass("inputdecor-calendar");

		this.clear = $(document.createElement("button"));
		this.clear.addClass("inputdecor-clear");
		this.clear.text("Очистить");

		this.apply = $(document.createElement("button"));
		this.apply.addClass("inputdecor-apply");
		this.apply.text("Применить");

		this.button = $(document.createElement("p"));
		this.button.addClass("inputdecor-button");
		this.button.text(this.text);
		this.box.append(this.button);

		//-------------------------------------------------------
		this.monthesList = $(document.createElement("select"));
		var monthesList = "";
		var monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
		monthes.forEach(function(month, i){
			var selected = "";
			if (self.now.month == i) selected = "selected";
			monthesList += '<option value="' + i + '" ' + selected + '>' + month + '</option>';
		});
		this.monthesList.append(monthesList);
		this.monthesList.change(function(){
			self.build({ month : $(this).val() });
		});
		this.calendar.append(this.monthesList);

		//-------------------------------------------------------
		this.yearsList = $(document.createElement("select"));
		var yearsList = "";
		for (var i = this.now.year; i >= this.now.year - 17; i--)
		{
			var selected = "";
			if (i == this.now.year) selected = "selected";
			yearsList += '<option value="' + i + '" ' + selected + '>' + i + '</option>';
		}
		this.yearsList.append(yearsList);
		this.yearsList.change(function(){
			self.build({ year : $(this).val() });
		});
		this.calendar.append(this.yearsList);
		//-------------------------------------------------------

		this.table = $(document.createElement("table"));
		this.table[0].onselectstart = function(){ return false; };
		this.calendar.append(this.table);

		this.box.append(this.calendar);
		this.calendar.append(this.clear);
		this.calendar.append(this.apply);

		this.elem.remove();

		this.clear.click(function(e){
			self.from = null;
			self.to = null;
			self.button.text(self.text);
			self.build(self.used);
		});

		this.apply.click(function(e){
			self.appendDate();	
			if(self.from && self.to)
			{
				var from = self.getTextDate(self.from);
				var to = self.getTextDate(self.to);

				var loc = location.pathname;
				var url = getUrlParams();
				if (url)
				{
					url.from = from;
					url.to = to;
					loc += setUrlParams(url);
				}
				else loc += setUrlParams({ from : from, to : to });

				location.href = loc;
			}
			else
			{
				var url = getUrlParams();
				delete url.from;
				delete url.to;
				location.href = location.pathname + setUrlParams(url);
			}
		});

		this.table.click(function(e){
			var day = parseInt(e.target.innerText);
			if (day)
			{
				var current = +new Date(self.used.year, self.used.month, day);
				if (!self.from)
				{
					self.from = current;
				}
				else if (!self.to)
				{
					self.to = current;
					self.build(self.used);
				}
				else
				{
					var center = (self.to - self.from)/2;
					if (current - self.from < center) self.from = current;
					else self.to = current;
					self.build(self.used);
				}
			}
		});

		this.button.click(function(){
			self.toogle();
		});

		this.appendDate();
		this.build(this.now);
	}
	Calendar.prototype.appendDate = function()
	{
		if (this.from && this.to)
		{
			var from = this.getTextDate(this.from);
			var to = this.getTextDate(this.to);

			this.button.text(from + "-" + to);
			this.close();
		}
	}
	Calendar.prototype.getTextDate = function(num)
	{
		var date = new Date(num);
		var result = date.getDate() + ".";
			result += date.getMonth() + ".";
			result += date.getFullYear();
		return result;
	}
	Calendar.prototype.build = function(d)
	{

		if (d.year) this.used.year = d.year;
		if (d.month) this.used.month = d.month;
		if (d.day) this.used.day = d.day;

		var date = new Date(this.used.year, this.used.month);

		var body = '<tr class="title"><td>пн</td><td>вт</td><td>ср</td><td>чт</td><td>пт</td><td>сб</td><td>вс</td></tr><tr>';

		for (var i = 0; i < getDay(date); i++) body += '<td></td>';

		while (date.getMonth() == this.used.month)
		{
			var curDay = date.getDate();

			var className = "default";
			if (this.used.year == this.now.year && this.used.month == this.now.month && curDay == this.now.day) className = "today";

			if (this.from && this.to)
			{
				var current = +new Date(this.used.year, this.used.month, curDay);
				if (current > this.from && current < this.to) className += " range";
				if (current == this.from || current == this.to) className += " limit";
			}

			body += '<td class="' + className + '">' + curDay + '</td>';
			if (getDay(date) % 7 == 6) body += '</tr><tr>';
			date.setDate(curDay + 1);
		}

		if (getDay(date) != 0)
		for (var i = getDay(date); i < 7; i++) body += '<td></td>';

		body += '</tr>'

		this.table.empty();
		this.table.append(body);
		
		function getDay(date)
		{
			var day = date.getDay();
			if (day == 0) day = 7;
			return day - 1;
		}
	}
	Calendar.prototype.open = function()
	{
		this.calendar.show(250);
		this.active = true;
	}
	Calendar.prototype.close = function()
	{
		this.calendar.hide(250);
		this.active = false;
	}
	Calendar.prototype.toogle = function()
	{
		if (this.active) this.close();
		else this.open();
	}

	function Checkbox(options)
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
		this.create();
	}
	Checkbox.prototype.create = function()
	{
		var self = this

		this.elem.hide();

		this.box = $(document.createElement("div"));
		this.box.addClass("inputdecor-box");
		this.elem.before(this.box);

		this.button = $(document.createElement("div"));
		this.button.addClass("inputdecor-checkbox");
		if (this.active) this.button.addClass("active");
		this.box.append(this.button);

		this.box.append(this.elem);

		this.button.click(function(){
			self.toogle();
		});
	}
	Checkbox.prototype.activate = function()
	{
		this.button.addClass("active");
		this.elem.prop({ 'checked': true });
		this.active = true;
	}
	Checkbox.prototype.deactivate = function()
	{
		this.button.removeClass("active");
		this.elem.prop({ 'checked': false });
		this.active = false;
	}
	Checkbox.prototype.toogle = function()
	{
		if (this.active) this.deactivate();
		else this.activate();
	}

	function Select(options)
	{
		var self = this;
		this.elem = options.elem;
		this.name = options.elem.attr("name");
		this.value = options.elem.val();
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
		this.create();
	}
	Select.prototype.create = function()
	{
		var self = this;

		this.elem.hide();

		this.box = $(document.createElement("div"));
		this.box.addClass("inputdecor-box");
		this.elem.before(this.box);

		this.button = $(document.createElement("p"));
		this.button.addClass("inputdecor-button");
		this.button.text(this.text);
		this.box.append(this.button);

		this.label = $(document.createElement("span"));
		this.label.addClass("inputdecor-label");
		this.box.append(this.label);

		this.hidden = $(document.createElement("input"));
		this.hidden.attr("type", "hidden");
		if (this.name) this.hidden.attr("name", this.name);
		this.hidden.val(this.value);
		this.box.append(this.hidden);

		this.list = $(document.createElement("ul"));
		this.list.addClass("inputdecor-list");
		var list = this.elem[0].innerHTML;
			list = list.replace(/option+/g, "li");
		this.list.append(list);
		this.box.append(this.list);

		this.elem.remove();

		this.button.click(function(){
			self.toogle();
		});

		this.list.click(function(e){
			var target = $(e.target);
			self.hidden.val(target.attr("value"));
			self.button.text(target.text());
		});

		document.body.addEventListener("click", function(e){
			if (e.target.parentNode != self.box[0]) self.close();
		});
	}
	Select.prototype.open = function()
	{
		this.list.show(250);
		this.label.addClass("active");
		this.active = true;
	}
	Select.prototype.close = function()
	{
		this.list.hide(250);
		this.label.removeClass("active");
		this.active = false;
	}
	Select.prototype.toogle = function()
	{
		if (this.active) this.close();
		else this.open();
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