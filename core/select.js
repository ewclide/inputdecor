import { DOC, checkBoolean, wrapCallBack } from './func';
import { List } from './list';
import { Search } from './search';

export class Select
{
	constructor($source, type, settings)
	{
		var self = this,
			search = settings.search;

		this.$source = $source.hide()

		this.settings = {
			type       : type,
			active     : false,
			name       : $source.attr("name"),
			speed      : settings.speed      || parseInt($source.attr("data-speed")) || 250,
			rollup     : settings.rollup     || checkBoolean($source.attr("data-rollup"), false),
			className  : settings.className  || $source.attr("data-class") || "",
			onChoose   : settings.onChoose   || $source.attr("data-on-choose"),
			onReady    : settings.onReady    || $source.attr("data-on-ready"),
			selected   : settings.selected   || parseInt($source.attr("data-selected")) || 0,
			unselected : settings.unselected || checkBoolean($source.attr("data-unselected"), false),
			textButton : settings.textButton || $source.attr("data-text-button") || "Select value",
			textUnselected : settings.textUnselected || $source.attr("data-text-unselected") || "-- not selected --",
		}

		if (search || checkBoolean($source.attr("data-search"), false))
			this.settings.search = {
				textEmpty : search && search.textEmpty || $source.attr("data-search-empty") || "-- not found --",
				inButton  : search && search.inButton  || checkBoolean($source.attr("data-search-inbutton"), false),
				caseSense : search && search.caseSense || checkBoolean($source.attr("data-search-case"), false),
				wholeWord : search && search.wholeWord || checkBoolean($source.attr("data-search-whole"), false),
				beginWord : search && search.beginWord || checkBoolean($source.attr("data-search-begin"), false)
			}

		this.value = $source.val();
		this.text = this.settings.textButton;

		console.log(this)

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
	        button     : DOC.create("button", "button").text(settings.textButton),
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
	        	textUnselected : settings.textUnselected
	        }
	    );

        // create search
        if (settings.search)
        	this.search = new Search(this.list, settings.search);

		// append elements
		this.$source.before($elements.main);
		$elements.buttonCont.append(
			$elements.button,
			$elements.label.append("<span class='marker'></span>")
		);
		$elements.main.append(
			$elements.hidden,
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

		this.list.onChoose = function(e)
		{
			self._update(e);

			if (typeof self.settings.onChoose == "function")
				self.settings.onChoose(e);

			self.close();
		};

		document.body.addEventListener("click", function(e){
			var parent = $(e.target).closest(".inputdecor-select");
			if (!parent.length) self.close();
		});

		// first select
		this.list.choose(this.list.selected);

		if (self.settings.onReady)
			self.settings.onReady(this);
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
		if (data.unselected) this.text = this.settings.textButton;
		else this.text = data.text;

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
				if (this.settings.search.inButton)
					this.search.setValue(this.text);

				else this.search.clear();
			}
		}
	}

	toogle()
	{
		if (this.settings.active) this.close();
		else this.open();
	}	
}