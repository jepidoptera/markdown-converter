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
    let parentText = null;
    console.log(links)
    links.forEach(link => {
        // make sure it is not already bracketed
        let parent = $(link).parent();
        if ($(link).parent().text() != parentText) {
            parentText = $(link).parent().text();
            textPosition = 0;
        }
        let linkLoc = parentText.indexOf($(link).text(), textPosition);
        textPosition = linkLoc;
        if (parentText[linkLoc-1] === "[" && parentText[linkLoc + $(link).text().length] === "]")
            return;
        // assuming it is not, modify it
        $(link).replaceWith($("<span>")
            .addClass('modified')
            .html(`[<a href=${link.href}>${link.text}</a>](${link.href})`)
        )
        parentText = $(parent).text()
    })

    // find all text nodes
    var getTextNodesIn = function(el) {
        return $(el).find("*").addBack().contents().filter(function() {
            return this.nodeType == 3;
        });
    };
    // find links that are present in text
    const textNodes = getTextNodesIn($("#bufferDiv"));
    const urlexpression = /(http[s]?:\/\/)?[-a-z0-9@:%._\+~#=]{1,256}\.(com|org|io|me){1}\b([-a-z0-9()@:%_\+.~#?&//=]*)[^.\s]/gi;
    const regex = new RegExp(urlexpression);

    function modifyPlaintextLinks(textNodes) {
        textNodes.each(function() {
            // is there a link in here?
            let matches = this.textContent.matchAll(regex)
            let newHTML = ''
            let textPosition = 0

            for (match of matches) {
                newHTML += this.textContent.slice(textPosition, match.index)
                newHTML += `<span class='modified'>[<a href='${match[0]}'>${match[0]}</a>](${match[0]})</span>`
                textPosition = match.index + match[0].length
            }

            if (newHTML) {
                newHTML += this.textContent.slice(textPosition)
                $(this).replaceWith($("<span>").html(newHTML))
            }

            // if (matchLoc) {
            //     console.log(this);
            //     console.log("!match");
            //     if ($(this).parent().hasClass('modified')) {
            //         console.log('but already modified.')
            //     }
            //     else {
            //         // modify it
            //     }
            // } else {
            //     // console.log("No match");
            // } 
        })
    }
    // modifyPlaintextLinks(textNodes)

    $("#editableDiv").html($("#bufferDiv").html())
}


function handleCopy() {
    $('#bufferDiv').html($('#editableDiv').html())
    // get rid of 'modified' tags
    $('#editableDiv').find(".modified").each(function() {
        $(this).replaceWith($(this).contents())
    })
    /* Select the text field */
    var doc = document;
    var element = document.getElementById("editableDiv");
    console.log(this, element);

    var selection = window.getSelection();        
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);

    /* Copy the text inside the text field */
    document.execCommand("copy");

    // change it back (re-assert highlights)
    setTimeout(() => $("#editableDiv").html($("#bufferDiv").html()), 1000)
}

jQuery(function($){
    document.getElementById('editableDiv').addEventListener('paste', handlePaste);
    // document.addEventListener('copy', handleCopy);

    $("[contenteditable]").focusout(function(){
        var element = $(this);        
        if (!element.text().trim().length) {
            element.empty();
        }
    });
});

