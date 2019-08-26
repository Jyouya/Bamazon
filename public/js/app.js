// request data immediately on page load, then display it when window.ready
const url = window.location.search;
const params = new URLSearchParams(url);


if (!params.get('department')) {
    params.delete('department');
}
console.log('./api/products/?' + params.toString());

//TODO set options value to department

const products = $.get('./api/products/?' + params.toString());

$(window).ready(function () {
    products.then(function (results) {
        results.forEach(appendProduct);
    })



});

function appendProduct(product) {
    $('.products').append(
        // $('<a class="product-link">').attr('href', './products?id=' + product.id).append(
            $('<a class="card columns is-horizontal">').attr('href', './product?id=' + product.id).append(
                $('<div class="card-image column is-one-fifth">').append(
                    $('<figure class="image is-square">').append(
                        $('<img>').attr('src', product.img)
                    )
                ),
                $('<div class="card-content column is-four-fifths">').append(
                    $('<h2 class="is-2 title">').text(product.name),
                    $('<p>').text(product.price),
                    $('<p>').text(product.department)
                )
            )
        )
    // )
}