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