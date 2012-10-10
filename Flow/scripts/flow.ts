/// <reference path="jquery.d.ts" />

$(document).ready(function () {

    var converter = new Showdown.converter();
    //test
    $('.post .content pre').each((i, elem) => {
        var text = $(elem).html();
        var html = converter.makeHtml(text);
        $(elem).parent().html(html);
    });
    
});