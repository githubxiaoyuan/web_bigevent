$(function() {
    //API的统一根路径
    $.ajaxPrefilter(function(option) {
        option.url = 'http://ajax.frontend.itheima.net' + option.url;
    });
})