/**
 * RichTextArea.
 * A rich text editor that allows complex styling and formatting. 
 */
var RichTextArea = exports.RichTextArea = function(sel) {
    var ta = this.textarea = $(sel);
    
    ta.after('<iframe id="' + ta.attr("id") + '-if" class="richtextarea" frameborder="0" marginwidth="2px" marginheight="2px" width="' + ta.css("width") + '" height="' + ta.css("height") + '"></iframe>');

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
 * Return the content of the editor.
 */
RichTextArea.prototype.content = function() {
    return this.doc.body.innerHTML;
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

