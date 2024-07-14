$(document).ready(function(){
  Shopify.queryParams = {};
  if (location.search.length) {
    var params = location.search.substr(1).split('&');
    $.each(params, function(index, param){
        var keyValue = param.split("=");
        if (keyValue.length) {
            Shopify.queryParams[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1])
        }
    })
  }
  $('#sort_by').on("change", function(){
    var value = $(this).val();
    Shopify.queryParams.sort_by = value;
    location.search = $.param(Shopify.queryParams);
  })  
})