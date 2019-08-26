{
    const params = new URLSearchParams();

    $(window).ready(function () {
        $('#search').submit(function (event) {
            const params = new URLSearchParams($(this).serialize());
            console.log(params.toString());
        });

        const cart = JSON.parse( localStorage.getItem('cart') || '[]');
        $('.cart').text(cart.length);
    });

}