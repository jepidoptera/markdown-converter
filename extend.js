function handlePaste (e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('text/html');
    
    console.log(pastedData);
    // Do whatever with pasteddata
    $('#bufferDiv').html(pastedData);
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
