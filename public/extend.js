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
    const links = parseLinks($('#bufferDiv'));
    links.forEach(link => {
        // let beforeAndAfter = link.parent.textContent;
        // console.log(beforeAndAfter)
        $(link).replaceWith($("<span>")
            .css({'backgroundColor': 'yellow'})
            .addClass('modified')
            .html(`[<a>${link.text}</a>](${link.href})`)
        )
    })

    console.log(links)
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
    const urlexpression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(urlexpression);

    function modifyPlaintextLinks(textNodes) {
        textNodes.each(function() {
            // is there a link in here?
            console.log(this);
            
            if (this.textContent.match(regex)) {
                console.log("!match");
            } else {
                console.log("No match");
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
