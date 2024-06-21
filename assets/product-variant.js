$(document).ready(function(){
    function selectedVariant(param, value){
        var url = new URL(window.location.href);
        url.searchParams.set(param, value);
        window.history.replaceState({}, '', url);
    }
    function updateSelection(){
        var selectedValues = "";
        $('.product_options input[type="radio"]:checked').each(function(){
            selectedValues += (selectedValues ? " / " : "") + $(this).val();
        });
        
        //Select the main variant
        $('.variant option').each(function(){
            if($(this).text() == selectedValues){
                $(this).prop("selected", true);
                return false;
            }
        })
    }
    $('.product_options input[type="radio"]').change(function(){
        updateSelection();

        var currentVariant = $('.variant').val();
        console.log(currentVariant);
        selectedVariant('variant', currentVariant);
    });
    updateSelection();
});
