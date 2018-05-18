/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getOption = getOption;
exports.wrapCallBack = wrapCallBack;
var DOC = exports.DOC = {
	create: function create(tag, attr, css) {
		var $element = $(document.createElement(tag));
		if (typeof attr == "string") $element.addClass(attr);else if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) == "object") $element.attr(attr);
		if (css) $element.css(css);
		return $element;
	}
};

function getOption(attr, $element, setting, def) {
	var prefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "data-";

	var value = $element.attr(prefix + attr);

	if (value == undefined) value = setting !== undefined ? setting : def;

	if (value === "") value = true;else if (value === "false") value = false;

	return value;
}

function wrapCallBack(callback) {
	if (typeof callback == "string") return new Function("e", callback);else if (typeof callback == "function") return callback;else return function () {};
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Box = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _func = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Box = exports.Box = function () {
	function Box() {
		_classCallCheck(this, Box);
	}

	_createClass(Box, [{
		key: "create",
		value: function create(type) {
			var self = this;

			this.$element.hide();

			this.box = _func.DOC.create("div", "inputdecor-" + type);
			this.button = _func.DOC.create("button", "button " + (this.active ? "active" : ""));
			this.label = _func.DOC.create("span", "label");

			this.$element.before(this.box);
			this.box.append(this.button);
			this.button.append(this.label);
			this.box.append(this.$element);

			this.button.bind("click", function () {
				self.toogle();
			});
		}
	}, {
		key: "activate",
		value: function activate() {
			this.button.addClass("active");
			this.$element.prop({ 'checked': true });
			this.$element.change();
			this.active = true;
		}
	}, {
		key: "deactivate",
		value: function deactivate() {
			this.button.removeClass("active");
			this.$element.prop({ 'checked': false });
			this.$element.change();
			this.active = false;
		}
	}, {
		key: "toogle",
		value: function toogle() {
			if (this.active) this.deactivate();else this.activate();
		}
	}]);

	return Box;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _decorator = __webpack_require__(3);

var _api = __webpack_require__(10);

var output = {},
    methods = ["find", "choose", "addOption", "count", "open", "close", "toogle", "activate", "deactivate", "clear"];

$.fn.inputDecor = function (settings) {
	this.each(function () {
		this._decorator = new _decorator.Decorator($(this), settings);
	});
};

$('[data-inputdecor]').inputDecor();

(0, _api.setAPI)(output, methods);

$.inputDecor = function (query) {
	output.$elements = $(query);
	return output;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Decorator = undefined;

var _checkbox = __webpack_require__(4);

var _radio = __webpack_require__(5);

var _select = __webpack_require__(6);

var _file = __webpack_require__(9);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Decorator = exports.Decorator = function Decorator($element) {
	var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	_classCallCheck(this, Decorator);

	var type = $element.attr("type") || $element[0].tagName.toLowerCase();

	if (type == "ul" || type == "select") this.input = new _select.Select($element, type, settings);else if (type == "checkbox") this.input = new _checkbox.Checkbox($element, settings);else if (type == "radio") this.input = new _radio.Radio($element, settings);else if (type == "file") this.input = new _file.InputFile($element, settings);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Checkbox = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _box = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = exports.Checkbox = function (_Box) {
	_inherits(Checkbox, _Box);

	function Checkbox($element, settings) {
		_classCallCheck(this, Checkbox);

		var _this = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this));

		_this.init($element);
		_this.create("checkbox");
		return _this;
	}

	_createClass(Checkbox, [{
		key: "init",
		value: function init($element) {
			var self = this;
			this.$element = $element;
			this.name = $element.attr("name");
			this.value = $element.val();
			this.active = function () {
				var checked = self.$element.prop("checked") || self.$element.attr("checked");
				if (checked) return true;else return false;
			}();
		}
	}]);

	return Checkbox;
}(_box.Box);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Radio = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _func = __webpack_require__(0);

var _box = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Radio = exports.Radio = function (_Box) {
	_inherits(Radio, _Box);

	function Radio($element, settings) {
		_classCallCheck(this, Radio);

		var _this = _possibleConstructorReturn(this, (Radio.__proto__ || Object.getPrototypeOf(Radio)).call(this));

		var self = _this;

		_this.init($element);
		_this.create("radio");
		_this.button.unbind("click");
		_this.button.bind("click", function () {

			if (!self.remove && !self.active) self.activate();else if (self.remove) self.toogle();
		});
		return _this;
	}

	_createClass(Radio, [{
		key: 'init',
		value: function init($element) {
			var self = this;
			this.$element = $element;
			this.name = $element.attr("name");
			this.value = $element.val();
			this.active = function () {
				var checked = self.$element.prop("checked") || self.$element.attr("checked");
				if (checked) return true;else return false;
			}();
			this.remove = (0, _func.getOption)("remove", $element, undefined, false);
			this.radios = $('input[type=radio][name="' + this.name + '"]');
			this.$element[0].inputstyler = this;
		}
	}, {
		key: 'deactiveOther',
		value: function deactiveOther(current) {
			this.radios.each(function () {
				if (this.inputstyler !== current) this.inputstyler.deactivate();
			});
		}
	}, {
		key: 'activate',
		value: function activate() {
			_get(Radio.prototype.__proto__ || Object.getPrototypeOf(Radio.prototype), 'activate', this).call(this);
			this.deactiveOther(this);
		}
	}]);

	return Radio;
}(_box.Box);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Select = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _func = __webpack_require__(0);

var _list = __webpack_require__(7);

var _search = __webpack_require__(8);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Select = exports.Select = function () {
	function Select($source, type, settings) {
		_classCallCheck(this, Select);

		this.$source = $source.hide();

		this.settings = {
			type: type,
			active: false,
			name: $source.attr("name"),
			speed: (0, _func.getOption)("speed", $source, settings.speed, 250),
			rollup: (0, _func.getOption)("rollup", $source, settings.rollup, false),
			className: (0, _func.getOption)("class", $source, settings.className, " "),
			onChoose: (0, _func.getOption)("on-choose", $source, settings.onChoose, ""),
			onReady: (0, _func.getOption)("on-ready", $source, settings.onReady, ""),
			selectIndex: (0, _func.getOption)("select-index", $source, settings.selectIndex, 0),
			unselected: (0, _func.getOption)("unselected", $source, settings.unselected, false),
			placeholder: (0, _func.getOption)("placeholder", $source, settings.placeholder, "Select value")
		};

		if (this.settings.unselected === true) this.settings.unselected = "-- not selected --";

		var search = (0, _func.getOption)("search", $source, settings.search, false);

		if (search) {
			if (search === true) search = {};
			this.settings.search = {
				textEmpty: (0, _func.getOption)("empty", $source, search.textEmpty, "-- not found --", "data-search-"),
				inButton: (0, _func.getOption)("inbutton", $source, search.inButton, false, "data-search-"),
				caseSense: (0, _func.getOption)("case", $source, search.caseSense, false, "data-search-"),
				wholeWord: (0, _func.getOption)("whole", $source, search.wholeWord, false, "data-search-"),
				beginWord: (0, _func.getOption)("begin", $source, search.beginWord, false, "data-search-")
			};
		}

		this.value = $source.val();
		this.text = this.settings.placeholder;

		this._create();
	}

	_createClass(Select, [{
		key: '_create',
		value: function _create() {
			var self = this,
			    $elements,
			    settings = this.settings;

			// wrap callbacks
			settings.onChoose = (0, _func.wrapCallBack)(settings.onChoose);
			settings.onReady = (0, _func.wrapCallBack)(settings.onReady);

			// create elements
			this.$elements = {
				main: _func.DOC.create("div", "inputdecor-select " + (settings.className ? settings.className : "")),
				buttonCont: _func.DOC.create("div", "button-wrapper"),
				button: _func.DOC.create("button", "button").text(settings.placeholder),
				label: _func.DOC.create("button", "label"),
				hidden: _func.DOC.create("input", { "type": "hidden", "name": settings.name }).val(this.value),
				listCont: _func.DOC.create("div", "list-wrapper", {
					"position": "absolute",
					"width": "100%",
					"transform": "scaleY(0)",
					"transform-origin": "100% 0",
					"transition": settings.speed + "ms"
				})
			};

			$elements = this.$elements;

			// create list
			this.list = new _list.List(this.$source, {
				type: settings.type,
				selected: settings.selected,
				unselected: settings.unselected,
				selectIndex: settings.selectIndex
			});

			this.choose(this.list.selectIndex);

			this.list.onChoose = function (e) {
				self._update(e);

				if (typeof self.settings.onChoose == "function") self.settings.onChoose(e);

				self.close();
			};

			// create search
			if (settings.search) this.search = new _search.Search(this.list, settings.search);

			// append elements
			this.$source.before($elements.main);
			$elements.buttonCont.append($elements.button, $elements.label.append("<span class='marker'></span>"));
			$elements.main.append($elements.hidden, $elements.buttonCont, $elements.listCont.append(this.list.$element));

			if (this.search) {
				if (settings.search.inButton) {
					this.search.setValue(this.text);
					$elements.buttonCont.prepend(this.search.$elements.main);
					$elements.button.remove();
				} else $elements.listCont.prepend(this.search.$elements.main);

				$elements.listCont.append(this.search.$elements.empty);
			}

			// add rollup
			if (settings.rollup) {
				$elements.rollup = _func.DOC.create("button", "rollup");
				$elements.listCont.append($elements.rollup);
				$elements.rollup.click(function (e) {
					self.close();
				});
			}

			// listen events
			var toogle = function toogle(e) {
				e.preventDefault();
				self.toogle();
			};

			$elements.button.click(toogle);
			$elements.label.click(toogle);

			if (this.search && settings.search.inButton) this.search.$elements.input.click(toogle);

			document.body.addEventListener("click", function (e) {
				var parent = $(e.target).closest(".inputdecor-select");
				if (!parent.length) self.close();
			});

			if (self.settings.onReady) self.settings.onReady(this);
		}
	}, {
		key: 'find',
		value: function find(value) {
			this.search.find(value);
		}
	}, {
		key: 'choose',
		value: function choose(index) {
			var data = this.list.choose(index);
			this._update(data);
			this.close();
		}
	}, {
		key: 'addOption',
		value: function addOption(data) {
			this.list.addOption(data);
		}
	}, {
		key: '_update',
		value: function _update(data) {
			this.text = data.unselected ? this.settings.placeholder : data.text;

			this.value = data.value;

			if (this.search) this.search.setValue(this.text);

			this.$elements.button.text(this.text);
			this.$elements.hidden.val(this.value);
		}
	}, {
		key: 'open',
		value: function open() {
			if (this.list.length > 1) {
				this.$elements.listCont.css("transform", "scaleY(1)");
				this.$elements.button.addClass("active");
				this.$elements.label.addClass("active");
				this.settings.active = true;

				if (this.search) this.search.clear(true);
			}
		}
	}, {
		key: 'close',
		value: function close() {
			if (this.list.length > 1) {
				this.$elements.listCont.css("transform", "scaleY(0)");
				this.$elements.button.removeClass("active");
				this.$elements.label.removeClass("active");
				this.settings.active = false;

				if (this.search) {
					this.settings.search.inButton ? this.search.setValue(this.text) : this.search.clear();
				}
			}
		}
	}, {
		key: 'count',
		value: function count() {
			return this.list.length;
		}
	}, {
		key: 'toogle',
		value: function toogle() {
			this.settings.active ? this.close() : this.open();
		}
	}]);

	return Select;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.List = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _func = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = exports.List = function () {
	function List($source, settings) {
		_classCallCheck(this, List);

		this.$source = $source;
		this.settings = settings;

		this.length = 0;
		this.options = [];
		this.onChoose;
		this.$element;
		this.$allElements;
		this.selectIndex = settings.selectIndex || 0;

		this._create();
	}

	_createClass(List, [{
		key: "choose",
		value: function choose(index) {
			return this._choose(this.options[index]);
		}
	}, {
		key: "addOption",
		value: function addOption(data) {
			var self = this,
			    option = this._createOption(data);

			this.$source.append("<option value=" + option.value + ">" + option.text + "</option>");

			if (data.childs) {
				option.$element.addClass("group");

				data.childs.forEach(function (child) {
					child.className = "child";
					self._createOption(child);
					self.$source.append("<option value=" + child.value + ">" + child.text + "</option>");
				});
			}

			this.options.push(option);
		}
	}, {
		key: "_create",
		value: function _create() {
			var self = this;

			this.$element = _func.DOC.create("ul", "list");

			if (this.settings.unselected) {
				var unselected = this.settings.unselected;

				if (this.settings.type == "select") unselected = '<option class="unselected">' + unselected + '</option>';else if (this.settings.type == "ul") unselected = '<li class="unselected">' + unselected + '</li>';

				this.$source.prepend(unselected);
				if (this.selectIndex) this.selectIndex++;
			}

			this.options = this._buildOptions();
			this.$allElements = this.$element.find("li");

			this.$element.click(function (e) {
				var target;

				if ("_decorTarget" in e.target) target = e.target._decorTarget;else target = $(e.target).closest("li")[0]._decorTarget;

				self._choose(target);
			});
		}
	}, {
		key: "_choose",
		value: function _choose(target) {
			var data = {
				value: target.value,
				text: target.text,
				unselected: target.text === this.settings.unselected
			};

			this.$allElements.removeAttr("data-selected");
			target.$element.attr("data-selected", "true");

			this.$source[0].selectedIndex = target.index;
			this.$source.change();

			if (typeof this.onChoose == "function") this.onChoose(data);

			return data;
		}
	}, {
		key: "_buildOptions",
		value: function _buildOptions() {
			var self = this,
			    options = this.$source.find(">"),
			    result = [];

			this.$element._decorLength = 0;

			if (options.length) options.each(function () {
				var data,
				    option = $(this),
				    group = option.attr("data-group");

				if (group) {
					var childs = [];

					data = self._getOptionData(option, "group", group), option.find("ul > li").each(function () {
						childs.push(self._getOptionData($(this), "child"));
					});

					data.childs = childs;
				} else data = self._getOptionData(option);

				result.push(data);
			});

			this.length = result.length;

			return result.length ? result : false;
		}
	}, {
		key: "_getOptionData",
		value: function _getOptionData($option, type, html) {
			var self = this,
			    selected = $option.attr("selected"),
			    cls = $option.attr("class");

			if (type && cls) cls += " " + type;else if (type) cls = type;

			var option = this._createOption({
				value: $option.val() || $option.attr("value"),
				text: type == "group" ? "" : $option.text(),
				html: type == "group" ? html : $option.html(),
				className: cls ? cls : ""
			});

			if (selected) this.selectIndex = option.index;

			return option;
		}
	}, {
		key: "_createOption",
		value: function _createOption(data) {
			var $li = _func.DOC.create("li"),
			    option = {
				$element: $li,
				value: data.value !== undefined ? data.value : "",
				text: data.html && !data.text ? $("<div>" + data.html + "</div>").text() : data.text,
				index: this.$element._decorLength++
			};

			if (data.className) $li.addClass(data.className);

			data.html ? $li.html(data.html) : $li.text(data.text);

			$li[0]._decorTarget = option;

			this.$element.append($li);

			return option;
		}
	}]);

	return List;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Search = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _func = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Search = exports.Search = function () {
	function Search(list, settings) {
		_classCallCheck(this, Search);

		this.settings = settings;
		this.options = list.options;

		this._create();
	}

	_createClass(Search, [{
		key: "getValue",
		value: function getValue() {
			return this.$elements.input.val();
		}
	}, {
		key: "setValue",
		value: function setValue(str) {
			var blur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			this.$elements.input.val(str);

			str ? this.$elements.clear.show() : this.$elements.clear.hide();

			if (blur) {
				this.$elements.clear.hide();
				this.$elements.input.blur();
			}
		}
	}, {
		key: "clear",
		value: function clear(focus) {
			focus ? this.$elements.input.focus().val("") : this.$elements.input.val("").blur();

			this.find("");
		}
	}, {
		key: "find",
		value: function find(text) {
			var found = this._find(this.options, text);

			!found.length ? this.$elements.empty.show() : this.$elements.empty.hide();

			this.setValue(text, false);

			return found;
		}
	}, {
		key: "_create",
		value: function _create() {
			var self = this;

			this.$elements = {
				main: _func.DOC.create("div", "search"),
				input: _func.DOC.create("input", { "type": "text" }),
				clear: _func.DOC.create("button", "clear").hide(),
				empty: _func.DOC.create("span", "empty").text(this.settings.textEmpty).hide()
			};

			this.$elements.input.on("input", function (e) {
				self.find(self.getValue());
			});

			this.$elements.clear.click(function (e) {
				e.preventDefault();
				self.clear(true);
				self.find("");
			});

			this.$elements.main.append(this.$elements.input, this.$elements.clear);
		}
	}, {
		key: "_find",
		value: function _find(options, text) {
			var self = this,
			    result = [];

			options.forEach(function (option) {

				var inside;

				if (option.childs) inside = self._find(option.childs, text);

				if (inside) result.concat(inside);

				if (!self._compare(option.text, text)) {
					if (!inside) option.$element.hide();
				} else {
					result.push(option.index);
					option.$element.show();
				}
			});

			return result;
		}
	}, {
		key: "_compare",
		value: function _compare(value_1, value_2) {
			if (!value_2) return true;

			if (!this.settings.caseSense) {
				value_1 = value_1.toUpperCase();
				value_2 = value_2.toUpperCase();
			}

			if (this.settings.wholeWord) return value_1 == value_2 ? true : false;else {
				var idx = value_1.indexOf(value_2);

				if (this.settings.beginWord) return idx != -1 && (idx == 0 || value_1[idx - 1] == " ") ? true : false;else return idx != -1 ? true : false;
			}

			return;
		}
	}]);

	return Search;
}();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InputFile = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _func = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputFile = exports.InputFile = function () {
	function InputFile($source, settings) {
		_classCallCheck(this, InputFile);

		var self = this;

		this.$source = $source;
		this.$elements = {};

		if (!settings) settings = {};

		this.settings = {
			placeholder: (0, _func.getOption)("placeholder", $source, settings.placeholder, "Select the file"),
			unselected: (0, _func.getOption)("unselected", $source, settings.unselected, "-- is not selected --"),
			className: (0, _func.getOption)("class", $source, settings.className, ""),
			clear: (0, _func.getOption)("clear", $source, settings.clear, true),
			size: (0, _func.getOption)("size", $source, settings.size, false),
			maxCount: (0, _func.getOption)("max-count", $source, settings.maxCount, 3),
			types: (0, _func.getOption)("types", $source, settings.types, false),
			fileList: (0, _func.getOption)("file-list", $source, settings.fileList, false)
		};

		this.errors = {
			maxCount: (0, _func.getOption)("maxcount-error", $source, settings.MaxCountError, "Max count of files - "),
			types: (0, _func.getOption)("types-error", $source, settings.TypesError, "You can only select files of types - ")
		};

		this._create(this.settings);
	}

	_createClass(InputFile, [{
		key: "_create",
		value: function _create(settings) {
			var self = this,
			    $elements = this.$elements;

			this.$source.hide();

			$elements.wrapper = _func.DOC.create("div", "inputdecor-file " + (settings.className ? settings.className : ""));
			$elements.unselected = _func.DOC.create("span", "unselected").text(settings.unselected);
			$elements.list = _func.DOC.create("div", "files-list");
			$elements.clear = _func.DOC.create("button", "clear").hide();
			$elements.clear[0].onclick = function () {
				self.clear();
			};

			$elements.button = _func.DOC.create("button", "button").text(settings.placeholder).click(function (e) {
				e.preventDefault();
				self.$source.click();
			});

			this.$source.after($elements.wrapper);
			$elements.wrapper.append($elements.button);
			$elements.wrapper.append($elements.list);
			$elements.list.append($elements.unselected);
			$elements.wrapper.append($elements.clear);
			$elements.wrapper.append(this.$source);

			if (!settings.fileList) $elements.list.hide();
			if (settings.types && typeof settings.types == "string") settings.types = settings.types.replace(/\s+/g, "").split(",");

			this.$source.change(function (e) {
				if (self.$source[0].files) {
					var files = self._getFiles(self.$source[0].files);
					files ? self._showFiles(files) : self.clear();
				}
			});
		}
	}, {
		key: "_getFiles",
		value: function _getFiles(files) {
			var list = [],
			    settings = this.settings;

			for (var i = 0; i < files.length; i++) {
				if (i >= settings.maxCount) {
					alert(this.errors.maxCount + settings.maxCount + "!");
					return false;
				}

				var type = files[i].name.split(".");
				type = type[type.length - 1].toLowerCase();

				if (settings.types && settings.types.indexOf(type) == -1) {
					alert(this.errors.types + settings.types.join(", ") + "!");
					return false;
				}

				list.push({
					name: files[i].name,
					size: Math.round(files[i].size / 1024),
					type: type
				});
			}

			return list;
		}
	}, {
		key: "_showFiles",
		value: function _showFiles(files) {
			var result = this._printFiles(files);

			this.settings.fileList ? this.$elements.list.html(result) : this.$elements.button.html(result).addClass("choosen");

			if (this.settings.clear) this.$elements.clear.show();
		}
	}, {
		key: "_printFiles",
		value: function _printFiles(files) {
			var _this = this;

			var result = "";

			files.forEach(function (file) {
				result += "<div class='file'><span class='name'>" + file.name + "</span>";
				if (_this.settings.size) result += "<span class='size'>" + file.size + "kb</span>";
				result += "</div>";
			});

			return result;
		}
	}, {
		key: "clear",
		value: function clear() {
			this.$source.val('');

			if (!this.settings.fileList) this.$elements.button.html("<span>" + this.settings.placeholder + "</span>");else {
				this.$elements.list.empty();
				this.$elements.list.append(this.$elements.unselected);
			}

			this.$elements.clear.hide();
		}
	}]);

	return InputFile;
}();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setAPI = setAPI;
function _callMethod(target, name, data) {
	var result = [];

	target.$elements.each(function () {
		if (this._decorator && typeof this._decorator.input[name] == "function") result.push(this._decorator.input[name](data));
	});

	return result.length == 1 ? result[0] : result;
}

function setAPI(target, methods) {
	methods.forEach(function (name) {
		target[name] = function (data) {
			return _callMethod(target, name, data);
		};
	});
}

/***/ })
/******/ ]);