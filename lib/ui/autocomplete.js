/*
	// Set default values for required options
	options.inputClass = options.inputClass || "ac_input";
	options.resultsClass = options.resultsClass || "ac_results";
	options.lineSeparator = options.lineSeparator || "\n";
	options.cellSeparator = options.cellSeparator || "|";
	options.minChars = options.minChars || 1;
	options.delay = options.delay || 400;
	options.matchCase = options.matchCase || 0;
	options.matchSubset = options.matchSubset || 1;
	options.matchContains = options.matchContains || 0;
	options.cacheLength = options.cacheLength || 1;
	options.mustMatch = options.mustMatch || 0;
	options.extraParams = options.extraParams || {};
	options.loadingClass = options.loadingClass || "ac_loading";
	options.selectFirst = options.selectFirst || false;
	options.selectOnly = options.selectOnly || false;
	options.maxItemsToShow = options.maxItemsToShow || -1;
	options.autoFill = options.autoFill || false;
	options.width = parseInt(options.width, 10) || 0;
*/

/**
 * Transforms a standard input box to an autocompleting input box.
 */
var AutocompleteInput = exports.AutocompleteInput = function(el, options) {
    this.input = $(sel);
    this.selected = -1;
        
    this.input.attr("autocomplete", "off");
    
	var results = document.createElement("div");
	var $results = $(results);
	$results.hide().addClass(options.resultsClass).css("position", "absolute");
	if (options.width) results.css("width", options.width);
	$("body").append(results);    
	
	
    $input.keydown(function(e) {
		// track last key pressed
		lastKeyPressCode = e.keyCode;
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
				if( selectCurrent() ){
					// make sure to blur off the current field
					$input.get(0).blur();
					e.preventDefault();
				}
				break;
			default:
				active = -1;
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(function() { onChange(); }, options.delay);
				break;
		}
	});	
}

AutocompleteInput.prototype.moveSelect = function(step) {
	var lis = $("li", results);
	if (!lis) return;

	active += step;

	if (active < 0) {
		active = 0;
	} else if (active >= lis.size()) {
		active = lis.size() - 1;
	}

	lis.removeClass("ac-hover");
	
	$(lis[active]).addClass("ac-hover");
};
