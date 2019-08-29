const params = new URLSearchParams(window.location.search);
if (params.get('id')) {
    $('#message').text(`Order #${params.get('id')} Placed Successfully`);
} else {
    $('#message').text(`Order failed with error: ${params.get('err')}`)
}