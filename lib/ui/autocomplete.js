/**
 * Transforms a standard input box to an autocompleting input box.
 */
var AutocompleteInput = exports.AutocompleteInput = function(sel, options) {
    var input = this.input = $(sel); 
    input.attr("autocomplete", "off");
    input.addClass("autocomplete");

	var results = this.results = $(document.createElement("div"));
	results.hide().css("position", "absolute");
	if (options.resultsClass) results.addClass(options.resultsClass);
	if (options.width) results.css("width", options.width);
	
	$("body").append(results);    
	
    input.keydown(function(e) {
		lastKeyCode = e.keyCode;
		switch(e.keyCode) {
			case 38: // up
				e.preventDefault();
				moveSelect(-1);
				break;
			case 40: // down
				e.preventDefault();
				moveSelect(1);
				break;
			case 9:  // tab
			case 13: // return
				if (selectCurrent()) {
					e.preventDefault();
					input[0].blur();
				}
				break;
			default:
				active = -1;
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(function() { onChange(); }, options.delay || 400);
				break;
		}
	});
	
    input.focus(function() {
		hasFocus = true;
	});
	
	input.blur(function() {
		hasFocus = false;
		hideResults();
	});

    this.active = -1;
}

AutocompleteInput.prototype.showResults = function() {
	var input = this.input,
	    pos = position(input),
	    width = this.options.width || parseInt(input.offsetWidth);
		
	$(this.results).css({
		width: width + "px",
		top: (pos.y + input.offsetHeight) + "px",
		left: pos.x + "px"
	}).show();
};
	
var position = function(el) {
	var left = el.offsetLeft || 0,
	    top = el.offsetTop || 0;
	
	while (el = el.offsetParent) {
		left += el.offsetLeft;
		top += el.offsetTop;
	}
	
	return {x:left, y:top};
}
		
AutocompleteInput.prototype.onChange = function(keyCode) {
	if (keyCode == 46 || (keyCode > 8 && keyCode < 32)) return $(this.results).hide();

    var input = $(this.input),
	    v = input.val();
/*
	if (v == prev) return;
	prev = v;*/
	if (v.length >= options.minChars) {
		$(this.input).addClass(options.loadingClass);
		requestData(v);
	} else {
		$(this.input).removeClass(options.loadingClass);
		$(this.results).hide();
	}
};
	
AutocompleteInput.prototype.moveSelect = function(step) {
	var lis = $("li", results);
	
	if (!lis) return;

	this.active += step;

	if (this.active < 0) {
		this.active = 0;
	} else if (this.active >= lis.size()) {
		this.active = lis.size() - 1;
	}

	lis.removeClass("ac_over");
	$(lis[this.active]).addClass("ac_over");
};

