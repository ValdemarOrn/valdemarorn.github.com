$(document).ready(function () {
    var converter = new Showdown.converter();
    $('.post .content pre').each(function (i, elem) {
        var text = $(elem).html();
        var html = converter.makeHtml(text);
        $(elem).parent().html(html);
    });
});
