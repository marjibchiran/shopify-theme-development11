$(document).ready(function(){
  if($('button[name="add"]').length > 0){
      $(document).on("click", "button[name='add']", function(e){
          e.preventDefault();
          var formData = $(this).closest('.product-form[action="/cart/add"]').serialize();           
          $.ajax({
              type: 'POST',
              url: '/cart/add.js',
              dataType: 'json',
              data: formData,
              success: function(data){
                  console.log('data:', data);
                  $('#offcanvasRight').offcanvas('show');
                  getCartDetails();
              },
              error: 'Add to cart error!'
          })
      })
  }
});

function getCartDetails(){
fetch("?section_id=cart-drawer")
.then((response) => response.text())
.then((cartData) =>{
  var cart_html = $(cartData);
  var cart_items = $('cart-items', cart_html);
  $('.cart-items').replaceWith(cart_items);
  var drawer_header = $('#offcanvasRightLabel', cart_html);
  $('#offcanvasRightLabel').replacewith(drawer_header);
  var subtotal = $('.subtotal', cart_html);
  $('.subtotal').replaceWith(subtotal);

})
fetch("?section_id=header")
.then((response) => response.text())
.then((headerData) => {
  var cart_html = $(headerData);
  var cart_count = $('.header-cart-count', cart_html);
  $('.header-cart-count').replaceWith(cart_count)
})
}