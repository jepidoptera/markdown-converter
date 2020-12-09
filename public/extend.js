function handlePaste (e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData;
    pastedData = clipboardData.getData('text/html');
    
    // console.log(pastedData);
    // Do whatever with pasteddata
    $('#bufferDiv').html(pastedData);
    // find all links within that data
    function parseLinks (element) {
        let linksList = [];
        $(element).find('*').each(function(index) {
            if (this.nodeName === "A") {
                linksList.push(this);
            }
        })
        return linksList;
    }
    // modify html hyperlinks
    const links = parseLinks($('#bufferDiv'))
    let textPosition = 0;
    console.log(links)
    links.forEach(link => {
        // make sure it is no already bracketed
        let parentText = $(link).parent().text()
        let linkLoc = parentText.indexOf($(link).text(), textPosition);
        textPosition = linkLoc;
        if (parentText[linkLoc-1] === "[" && parentText[linkLoc + $(link).text().length] === "]")
            return;
        // assuming it is not, modify it
        $(link).replaceWith($("<span>")
            .css({'backgroundColor': 'yellow'})
            .addClass('modified')
            .html(`[<a href=${link.href}>${link.text}</a>](${link.href})`)
        )
    })

    $("#editableDiv").html($("#bufferDiv").html())
    // find all text nodes
    var getTextNodesIn = function(el) {
        return $(el).find("*").addBack().contents().filter(function() {
            return this.nodeType == 3;
        });
    };
    // find links that are present in text
    const textNodes = getTextNodesIn($("#bufferDiv"));
    console.log('text contents:')
    const urlexpression = /(http[s]?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(com|org|io|me){1}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(urlexpression);

    function modifyPlaintextLinks(textNodes) {
        textNodes.each(function() {
            // is there a link in here?
            let matchLoc = this.textContent.match(regex)
            
            if (matchLoc) {
                console.log(this);
                console.log("!match");
                if ($(this).parent().hasClass('modified')) {
                    console.log('but already modified.')
                }
                else {
                    // modify it
                    matchLoc.
                }
            } else {
                // console.log("No match");
            } 
        })
    }
    modifyPlaintextLinks(textNodes)
}

jQuery(function($){
    document.getElementById('editableDiv').addEventListener('paste', handlePaste);

    $("[contenteditable]").focusout(function(){
        var element = $(this);        
        if (!element.text().trim().length) {
            element.empty();
        }
    });
});
