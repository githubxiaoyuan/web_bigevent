var layer = layui.layer; //layui的弹出层定义
var form = layui.form; //layui的表单定义
var upload = layui.upload; //layui的上传文件定义
var laytpl = layui.laytpl; //layui的模板引擎定义

// 获取用户信息
var userData = {};
getUserInfo();

var basicInfoFlag = false; //是否渲染基本资料标志

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('请求用户信息失败');
            }
            //将用户信息存入全局变量
            userData = res.data;
            //渲染用户信息
            renderUserInfo(res.data);
        }
    })
}

//渲染用户信息
function renderUserInfo(user) {
    //1.渲染用户名称
    var name = user.nickname || user.username;
    $(".span-username").text(name);
    //2.渲染用户头像
    if (user.user_pic !== null) {
        $(".text-avatar").hide();
        $(".user-header").attr("src", user.user_pic).show();
    } else {
        //如果不存在自定义头像，则使用文字头像
        $(".user-header").hide();
        $(".text-avatar").text(name.charAt(0).toUpperCase()).show();
    }
}

//用户注销功能
$("#logout").on("click", function() {
    logout();
})

function logout() {
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
        //清除本地token
        localStorage.removeItem("token");
        //跳转到登录页
        location.href = "login.html";
        layer.close(index);
    });
}