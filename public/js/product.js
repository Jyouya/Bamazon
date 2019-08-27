const params = new URLSearchParams(window.location.search);
const product = $.get('/api/products/' + params.get('id'));

$(window).ready(function () {
    // Render product information to the page
    product.then(function (result) {
        console.log(result);
        $('#product-image').append(
            $('<img>').attr('src', result.img)
        );
        $('#product-info').append(
            $('<h1 class="is-1 title">').text(result.name),
            $('<p>').text('Price: $' + result.price),
            $('<p>').append(
                $('<a>').attr('href', './?dpt=' + result.Department.name).text(result.Department.name)
            )
        );
        let stockMessage;
        if (result.stock > 10) {
            stockMessage = 'In Stock'
        } else if (!result.stock) {
            $('#add-to-cart-button').prop('disabled', true);
            $('#qty').prop('disabled', true);
            stockMessage = 'Out of Stock'
        } else {
            stockMessage = `${result.stock} left in stock.`
        }
        const stock = Math.min(result.stock, 30);
        for (let i = 1; i <= stock; i++) {
            $('#qty').append(
                $('<option>').val(i).text(i)
            )
        }
        $('#stock-message').text(stockMessage);
    });
});

$('#add-to-cart').submit(async function(event) {
    event.preventDefault();
    console.log($(this).serialize());
    const subOrder = {
        id: (await product).id,
        quantity: $('#qty').val()
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(subOrder);
    localStorage.setItem('cart', JSON.stringify(cart));
});