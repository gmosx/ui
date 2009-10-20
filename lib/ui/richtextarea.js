/**
 * RichTextArea.
 * A rich text editor that allows complex styling and formatting. 
 * https://developer.mozilla.org/en/Rich-Text_Editing_in_Mozilla
 */
var RichTextArea = exports.RichTextArea = function(sel, options) {
    this.selector = sel;
            
    var ta = this.textarea = $(sel);

    ta.before('<div id="' + ta.attr("id") + '-tb" class="richtextarea-toolbar" style="width: ' + ta.css("width") + '">' + renderToolbar() + '</div>');
    ta.after('<iframe id="' + ta.attr("id") + '-if" class="richtextarea" frameborder="0" marginwidth="2px" marginheight="2px" width="' + ta.css("width") + '" height="' + ta.css("height") + '"></iframe>');

    this.frame = $("#" + ta.attr("id") + "-if"); //[0];
    
    this.doc = this.frame[0].contentDocument;
    this.doc.designMode = "on";

    this.setRichView();    

    var self = this;       

    this.doc.addEventListener("keypress", function(e) {
        self.onKeyPress(e);
    }, true);
    
    $(this.selector + "-tb img").click(function() {
        self.execCommand($(this).attr("data-cmd"));
    });
    
    $(this.selector + "-tb .view").click(function(e) {
        self.toggleView();

        e.preventDefault();
        e.stopPropagation();
    });
}

/**
 * Return the content of the editor.
 */
RichTextArea.prototype.content = function() {
    return this.doc.body.innerHTML;
}

RichTextArea.prototype.import = function() {
    this.doc.body.innerHTML = this.textarea[0].value;
}

RichTextArea.prototype.export = function() {
    this.textarea.text(this.content());
}

RichTextArea.prototype.onKeyPress = function(e) {
    if (e.ctrlKey) {
        var cmd, k = String.fromCharCode(e.charCode).toLowerCase();

        if (k == "b")
            cmd = "bold";
        else if (k == "i")
            cmd = "italic";
        else if (k == "u")
            cmd = "underline";
        else if (k == "z")
            cmd = "undo";
        else
            return;

        this.execCommand(cmd);
        
        e.preventDefault();
        e.stopPropagation();
    }
}

RichTextArea.prototype.execCommand = function(cmd, show, arg) {
    this.frame.focus();
    this.doc.execCommand(cmd, show, arg);
    this.frame.focus();
}

RichTextArea.prototype.toggleView = function() {
    if (this.view == "rich") {
        this.setHTMLView();    
    } else {
        this.setRichView();
    }
}

RichTextArea.prototype.setRichView = function() {
    this.frame.show();
    this.import();
    $(this.selector + "-tb img").show();
    $(this.selector + "-tb .view")[0].innerHTML  = "&laquo; HTML view";
    this.textarea.hide();
    this.view = "rich";
}

RichTextArea.prototype.setHTMLView = function() {
    this.export();
    this.frame.hide();
    $(this.selector + "-tb img").hide();
    var view = $(this.selector + "-tb .view")[0].innerHTML  = "&nbsp;Rich view &raquo;";
    this.textarea.show();
    this.view = "html";
}

var COMMANDS = {
    "bold": { label: "Bold", img: "b.png" },
    "italic": { label: "Italic", img: "i.png" },
    "underline": { label: "Underline", img: "u.png" },
    "undo": { label: "Undo" },
    "redo": { label: "Redo" },
    "createLink": { label: "Link" },
    "insertOrderedList": { label: "Numbered List", img: "iol.png" },
    "insertUnorderedList": { label: "Bulleted List", img: "iul.png" },
    "outdent": { label: "Outdent", img: "od.png" },
    "indent": { label: "Indent", img: "id.png" },
    "justifyLeft": { label: "Align left", img: "jl.png" },
    "justifyCenter": { label: "Align center", img: "jc.png" },
    "justifyRight": { label: "Align right", img: "jr.png" },
    "removeFormat": { label: "Remove formatting" }
}

var renderToolbar = function() {
    var buf = [];
    for (var i in COMMANDS) {
        var cmd = COMMANDS[i];
        var img = cmd.img || (i + ".png");
        buf.push('<img src="/ui/img/' + img + '" data-cmd="' + i + '" alt="' + cmd.label + '" title="' + cmd.label + '" class="button" />');
    }
    buf.push('<span class="button view"></span>');
    return buf.join("");
}
