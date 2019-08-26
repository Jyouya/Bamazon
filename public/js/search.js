{
    const params = new URLSearchParams();

    $(window).ready(function () {
        $('#search').submit(function (event) {
            const params = new URLSearchParams($(this).serialize());
            console.log(params.toString());
        });

        // TODO: Read local storage, get how many items are in cart
    });

}