const cart = JSON.parse(localStorage.getItem('cart'));
let items;

if (!(cart && cart.length) ) {
    $('#items').append($('<h1 class="has-text-centered title is-1">').text('Cart is empty'));
} else {
    console.log(cart);
    items = Promise.all(cart.map(item => {
        console.log(item.id);
        return $.get('/api/products/' + item.id);
    }));
    $('#checkout-bar').toggle();
    total();
}


$(window).ready(async function () {
    if (items) {
        (await items).forEach((item, i) => appendItem(item, i));
        $('#checkout-bar').detach().appendTo('#items');
    }
});

function appendItem(item, i) {
    $('#items').append(
        $(`<div class="card columns is-horizontal" id="item-${i}">`).append(
            $('<div class="card-image column is-2">').append(
                $('<figure class="image is-square">').append(
                    $('<img>').attr('src', item.img)
                )
            ),
            $('<div class="card-content column is-8">').append(
                $('<a>').attr('href', './product?id=' + item.id).append(
                    $('<h2 class="is-2 title">').text(item.name)
                ),
                $('<p>').text(item.Department.name)
            ),
            $('<div class="card-content column is-2">').append(
                buildQuantityBox(item, i)
            ),
            $(`<a class="delete-item" data-index=${i}>`).text('x')
        )
    )
}

function buildQuantityBox(item, index) {
    const dom = $(
        `<form>
            <div class="field is-horizontal">
                <div class="field-label">
                    <label class="label">Price:</label>
                </div>
                <div class="field-body">
                    <label class="label price">${parseFloat(item.price).toFixed(2)}</label>
                </div>
            </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label for="Qty" class="label">Qty:</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <div class="select">
                            <select name="Qty" id="qty-${index}"></select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">
                Subtotal:
                </label>
            </div>
            <div class="field-body">
                <div class="field">

                        <label class="label subtotal" id="subtotal-${index}">${(item.price * cart[index].quantity).toFixed(2)}</label>

                </div>
            </div>
        </div>
    </form>`
    )
    const qty = dom.find(`#qty-${index}`);
    const stock = Math.min(item.stock, 30);

    for (let i = 1; i <= stock; i++) {
        qty.append(
            $('<option>').val(i).text(i)
        )
    }

    qty.change(function (event) {
        // const index = $(this).attr('id')
        $(`#subtotal-${index}`).text((item.price * $(this).val()).toFixed(2));
        // call the function to recalculate the total for the cart as well
    });

    return dom;
}

$(document).on('click', '.delete-item', function(event) {
    const i = $(this).attr('data-index');
    $(`#item-${i}`).remove();
    cart[i] = null;
    const newCart = cart.filter(x => x);
    localStorage.setItem('cart', JSON.stringify(newCart));
    $('.cart').text(newCart.length);
    total();
});

async function total() {
    const resItems = await items;
    console.log(resItems);
    console.log(cart);
    // TODO: sum is incorrect
    $('#total').text(cart.reduce((a, item, index) => a + item ? item.quantity * parseFloat(resItems[index].price) : 0 , 0).toFixed(2));
}