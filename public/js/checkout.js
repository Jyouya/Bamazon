const cart = JSON.parse(localStorage.getItem('cart'));
let items;

if (!cart) {
    $('#items').append($('<h1 class="title is-1">').text('Cart is empty'));
} else {
    items = new Promise().all(cart.map(item => {
        $.get('/api/products/' + item.id)
    }));
}


$(window).ready(function() {
    if (items) {
        (await items).forEach(appendItem);
    }
});