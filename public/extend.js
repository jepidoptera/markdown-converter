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

    function getTextNodesIn(node) {
        var textNodes = []
    
        function getTextNodes(node) {
            if (node.nodeType == 3) {
                textNodes.push(node);
            } else {
                for (let i = 0, len = node.childNodes.length; i < len; ++i) {
                    getTextNodes(node.childNodes[i]);
                }
            }
        }
    
        getTextNodes(node);
        return textNodes;
    }

    // find links that are present in text
    const textNodes = getTextNodesIn($("#bufferDiv")[0]);
    const urlRegex = new RegExp(/(http[s]?:\/\/)?[-a-z0-9@:%._\+~#=]{1,256}\.(com|org|io|me){1}\b([-a-z0-9()@:%_\+.~#?&//=]*)[^.\s]/gi)
    const markdownRegex = new RegExp(/(\[.*?\]\(.*?\))/gi)
    const markdowns = Array.from($("#bufferDiv").text().matchAll(markdownRegex))
    let elementPosition = 0;

    function modifyPlaintextLinks(textNodes) {
        textNodes.forEach(function(node) {
            // get the length of the element's text before we modify it
            let elementLength = node.textContent.length;
            // is there a link in here?
            let urls = Array.from(node.textContent.matchAll(urlRegex))
            let newHTML = ''
            let textPosition = 0

            // furthermore, if this element itself is inside a link, we must consider that
            let ancestors = ((node) => {
                return $(node).parent().length 
                    ? [$(node)].concat(ancestors($(node).parent())) 
                    : [$(node)]
                })
            let ancestralLink = ancestors(node).filter(node => node[0].nodeName === "A")[0]
            if (ancestralLink) {
                urls.push({
                    0: ancestralLink[0].href,
                    text: ancestralLink.text(),
                    index: 0
                })
                //
                node = ancestralLink[0]
            }
            for (url of urls) {
                if (!url.text) url.text = url[0]
                // but is it in markdown format already?
                for (markdown of markdowns) {
                    if (url.index + elementPosition > markdown.index && url.index + elementPosition < markdown.index + markdown[0].length) {
                        // url within markdown - ignore
                        url.ignore = true;
                        break;
                    }
                }
                if (!url.ignore) {
                    newHTML += node.textContent.slice(textPosition, url.index)
                    newHTML += `<span class='modified'>[<a href='${url[0]}'>${url.text}</a>](${url[0]})</span>`
                    textPosition = url.index + url[0].length
                }
            }

            if (newHTML) {
                newHTML += node.textContent.slice(textPosition)
                $(node).replaceWith($("<span>").html(newHTML))
            }

            elementPosition += elementLength;
            // console.log(node.textContent)
        })
    }
    modifyPlaintextLinks(textNodes)

    $("#editableDiv").html($("#bufferDiv").html())
}


function handleCopy() {
    $('#bufferDiv').html($('#editableDiv').html())
    // get rid of 'modified' tags
    $('#editableDiv').find(".modified").each(function() {
        $(this).replaceWith($(this).contents())
    })
    /* Select the text field */
    let element = document.getElementById("editableDiv");
    console.log(this, element);

    let selection = window.getSelection();        
    let range = document.createRange();
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

