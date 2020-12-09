//API的统一根路径
$.ajaxPrefilter(function(option) {
    option.url = 'http://ajax.frontend.itheima.net' + option.url;

    if (option.url.indexOf('/my/')) {
        option.headers = {
            Authorization: localStorage.getItem("token")
        };
    }

    //访问权限控制
    option.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            location.href = "login.html";
        }
    }
});