// This file manages the nav bar

$(window).ready(function () {
    $('#search').submit(function (event) {
        event.preventDefault();
        const params = new URLSearchParams($(this).serialize());
        console.log(params.toString());
        window.location.href = './?' + params.toString();
    });


    updateCart();

});

async function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    $('.cart').text(cart.length);
    const cards = await Promise.all(cart.map(async function (item) {
        const info = await $.get('./api/products/' + item.id);
        // return $('<div class="card">').append(
            return $('<div class="card-content columns">').append(
                $('<div class="column is-one-fifth">').append(
                    $('<div class="image">').append(
                        $('<img>').attr('src', info.img)
                    )
                ),
                $('<div class="column is-three-fifths">').append(
                    $('<h3 class="subtitle is-3">').text(info.name)
                ),
                $('<div class="column is-one-fifth">').append(
                    $('<h3 class="subtitle is-3">').text(item.quantity)
                )
            )
        // )
    }));
    console.log(cards);
    $('.cart-preview').empty().append(...cards);
}