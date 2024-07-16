$(document).ready(function() {
  // Collection sorting
  Shopify.queryParams = {};
  if (location.search.length) {
    var params = location.search.substr(1).split('&');
    $.each(params, function(index, param) {
      var keyValue = param.split("=");
      if (keyValue.length) {
        Shopify.queryParams[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
      }
    });
  }

  $('#sort-by').on("change", function() {
    var value = $(this).val();
    Shopify.queryParams.sort_by = value;
    location.search = $.param(Shopify.queryParams);
  });

  // Collection filtering
  function updateCollection() {
    var queryString = $("#collection-filter-form").serialize();
    updateSection(queryString);
  }

  function updateSection(query) {
    fetch("?section_id=collection-template&" + query)
      .then((response) => response.text())
      .then((colData) => {
        var coll_html = $(colData);
        var coll_items = $(".collection-product", coll_html);
        $(".collection-product").replaceWith(coll_items);
      })
      .catch((error) => {
        console.log(error);
      });

      var baseUrl = window.location.pathname;
      var queryUrl = baseUrl + '?' + query
      window.history.pushState({path: queryUrl}, '', queryUrl)
  }

  // Event delegation for dynamically added elements
  $("#collection-filter-form").on('change', 'input[type=checkbox], input[type=number]', function() {
    updateCollection();
  });
});
