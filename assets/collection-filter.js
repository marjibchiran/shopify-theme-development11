$(document).ready(function(){
  //collection sorting
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
  $('#sort-by').on("change", function(){
    var value = $(this).val();
    Shopify.queryParams.sort_by = value;
    location.search = $.param(Shopify.queryParams);
  }) 
  
  //collection filtering
  function updateCollection(){
    var queryString = $("#collection-filter-form").serialize();
  }
  function updateSection(query){
    fetch("?section_id=collection-template&"+query)
    .then((response) => response.text())
    .then((colData) => {
      var coll_html = $(colData);
      var coll_items = $(".collection-product", coll_html);
      $(".collection-product").replaceWith(coll_items);
    })
    .catch((error) =>{
      console.log(error);
    })
  }
  $("#collection-filter-form input[type=checkbox], #collection-filter-form input[type=number]").on('change', function(e){
    updateCollection();
  });
})