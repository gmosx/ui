/**
 *
 */
var RichTextEditor = function(sel) {
    var ta = this.textarea = $(sel);
    
    ta.after('<iframe id="' + ta.attr("id") + '-if" class="rte" frameborder="0" marginwidth="2px" marginheight="2px" width="' + ta.css("width") + '" height="' + ta.css("height") + '"></iframe>');

    this.frame = $("#" + ta.attr("id") + "-if")[0];
    
    this.doc = this.frame.contentDocument;
    this.doc.designMode = "on";
    this.doc.open();
    this.doc.write(ta.text());
    this.doc.close();

    var self = this;       
    this.doc.addEventListener("keypress", function(e) {
        self.onKeyPress(e);
    }, true);
}

/**
 * Convert all textareas in the document to rich text editors.
 */
RichTextEditor.convertTextareas = function() {
    var editors = [];
    
    $("textarea.rte").each(function() {
        editors.push(new RichTextEditor(this));
    });
    
    return editors;
}

RichTextEditor.export = function(editors) {
    for (var i = 0; i < editors.length; i++) editors[i].export();
}

/**
 * Return the content of the editor.
 */
RichTextEditor.prototype.content = function() {
    return this.doc.body.innerHTML;
}

RichTextEditor.prototype.export = function() {
    this.textarea.text(this.content());
}

RichTextEditor.prototype.onKeyPress = function(e) {
    if (e.ctrlKey) {
        var cmd, k = String.fromCharCode(e.charCode).toLowerCase();

        if (k == "b")
            cmd = "bold";
        else if (k == "i")
            cmd = "italic";
        else if (k == "u")
            cmd = "underline";
        else
            return;

        this.execCommand(cmd);
        
        e.preventDefault();
        e.stopPropagation();
    }
}

RichTextEditor.prototype.execCommand = function(cmd, show, arg) {
    this.frame.focus();
    this.doc.execCommand(cmd, show, arg);
    this.frame.focus();
}
