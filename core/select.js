import { DOC, getOption, wrapCallBack } from './func';
import { List } from './list';
import { Search } from './search';

export class Select
{
	constructor($source, type, settings)
	{
		this.$source = $source.hide();

		this.settings = {
			type        : type,
			active      : false,
			name        : $source.attr("name"),
			speed       : getOption("speed", $source, settings.speed, 250),
			rollup      : getOption("rollup", $source, settings.rollup, false),
			className   : getOption("class", $source, settings.className, " "),
			onChoose    : getOption("on-choose", $source, settings.onChoose, ""),
			onReady     : getOption("on-ready", $source, settings.onReady, ""),
			selectIndex : getOption("select-index", $source, settings.selectIndex, 0),
			unselected  : getOption("unselected", $source, settings.unselected, false),
			placeholder : getOption("placeholder", $source, settings.placeholder, "Select value")
		}

		if (this.settings.unselected === true)
			this.settings.unselected = "-- not selected --";

		var search = getOption("search", $source, settings.search, false);

		if (search)
		{
			if (search === true) search = {}
			this.settings.search = {
				textEmpty : getOption("empty", $source, search.textEmpty, "-- not found --", "data-search-"),
				inButton  : getOption("inbutton", $source, search.inButton, false, "data-search-"),
				caseSense : getOption("case", $source, search.caseSense, false, "data-search-"),
				wholeWord : getOption("whole", $source, search.wholeWord, false, "data-search-"),
				beginWord : getOption("begin", $source, search.beginWord, false, "data-search-")
			}
		}

		this.value = $source.val();
		this.text = this.settings.placeholder;

		this._create();
	}

	_create()
	{
		var self = this,
			$elements,
			settings = this.settings;

		// wrap callbacks
		settings.onChoose = wrapCallBack(settings.onChoose);
		settings.onReady  = wrapCallBack(settings.onReady);

        // create elements
        this.$elements = {
        	main       : DOC.create("div", "inputdecor-select " + (settings.className ? settings.className : "" )),
	        buttonCont : DOC.create("div", "button-wrapper"),
	        button     : DOC.create("button", "button").text(settings.placeholder),
	        label      : DOC.create("button", "label"),
	        hidden     : DOC.create("input", { "type" : "hidden", "name" : settings.name }).val(this.value),
	       	listCont   : DOC.create(
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
        }

        $elements = this.$elements;

        // create list
        this.list = new List(
        	this.$source,
	        {
	        	type : settings.type,
	        	selected : settings.selected,
	        	unselected : settings.unselected,
	        	selectIndex : settings.selectIndex
	        }
	    );

	    this.choose(+this.list.selectIndex);

	    this.list.onChoose = function(e)
		{
			self._update(e);

			if (typeof self.settings.onChoose == "function")
				self.settings.onChoose(e);

			self.close();
		};

        // create search
        if (settings.search)
        	this.search = new Search(this.list, settings.search);

		// append elements
		this.$source.before($elements.main);
		$elements.buttonCont.append(
			$elements.button,
			$elements.label.append("<span class='marker'></span>")
		);
		
		if (this.settings.type == "ul")
			$elements.main.append($elements.hidden);

		$elements.main.append(
			$elements.buttonCont,
			$elements.listCont.append(this.list.$element)
		);

		if (this.search)
		{
			if (settings.search.inButton)
			{
				this.search.setValue(this.text);
				$elements.buttonCont.prepend(this.search.$elements.main);
				$elements.button.remove();
			}
			else $elements.listCont.prepend(this.search.$elements.main);

			$elements.listCont.append(this.search.$elements.empty);
		}

		// add rollup
		if (settings.rollup)
		{
			$elements.rollup = DOC.create("button", "rollup");
			$elements.listCont.append($elements.rollup);
			$elements.rollup.click(function(e){
				self.close();
			});
		}

		// listen events
		var toogle = function(e){
			e.preventDefault();
			self.toogle();
		}

		$elements.button.click(toogle);
		$elements.label.click(toogle);

		if (this.search && settings.search.inButton)
			this.search.$elements.input.click(toogle);

		document.body.addEventListener("click", function(e){
			var parent = $(e.target).closest(".inputdecor-select");
			if (!parent.length) self.close();
		});

		if (self.settings.onReady)
			self.settings.onReady(this);
	}

	find(value)
	{
		this.search.find(value);
	}

	choose(index)
	{
		var data = this.list.choose(index);
		this._update(data);
		this.close();
	}

	addOption(data)
	{
		this.list.addOption(data);
	}

	_update(data)
	{
		this.text = data.unselected ? this.settings.placeholder : data.text;

		this.value = data.value;

		if (this.search)
			this.search.setValue(this.text);

		this.$elements.button.text(this.text);
		this.$elements.hidden.val(this.value);
	}

	open()
	{
		if (this.list.length > 1)
		{
			this.$elements.listCont.css("transform", "scaleY(1)");
			this.$elements.button.addClass("active");
			this.$elements.label.addClass("active");
			this.settings.active = true;

			if (this.search) this.search.clear(true);
		}
	}

	close()
	{
		if (this.list.length > 1)
		{
			this.$elements.listCont.css("transform", "scaleY(0)");
			this.$elements.button.removeClass("active");
			this.$elements.label.removeClass("active");
			this.settings.active = false;

			if (this.search)
			{
				this.settings.search.inButton
				? this.search.setValue(this.text)
				: this.search.clear();
			}
		}
	}

	count()
	{
		return this.list.length;
	}

	toogle()
	{
		this.settings.active ? this.close() : this.open();
	}	
}