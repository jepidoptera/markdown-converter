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
    const links = parseLinks($('#bufferDiv'));
    links.forEach(link => {
        $(link).replaceWith($("<span>")
            .css({'backgroundColor': 'yellow'})
            .text(`[${link.text}](${link.href})`)
        )
    })
    console.log(links)
    $("#editableDiv").html($("#bufferDiv").html())
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
