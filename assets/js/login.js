$(function() {

    //实现登录框和注册框切换
    $("#reg_link").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#login_link").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });

    //使用layui进行表单验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^([\S]){6,12}$/,
            '密码长度在6-12位，且不能使用空格'
        ],
        repwd: function(value) {
            if ($(".reg-box .confirm-password").val() !== $(".reg-box .password").val()) {
                return '两次输入的密码不一致！'
            }
        },
        username: [
            /^[a-zA-Z0-9]{6,16}$/,
            '用户名长度在6-16位，且只能是数字和字母组合！'
        ]
    });

    //注册API请求
    form.on('submit(reg)', function(data) {
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: data.field.username,
                password: data.field.password
            },
            success: function(res) {
                console.log(res);
                switch (res.status) {
                    case 0:
                        layer.msg(res.message);
                        $("#login_link").click();
                        break;
                    case 1:
                        layer.msg(res.message);
                        break;
                    default:
                        layer.msg('注册失败，原因未知！');
                        break;
                }
            }
        });
        return false;
    });

    //登录API请求
    form.on('submit(login)', function(data) {
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: {
                username: data.field.username,
                password: data.field.password
            },
            success: function(res) {
                console.log(res);
                switch (res.status) {
                    case 0:
                        layer.msg(res.message);
                        //记住用户名和密码
                        saveAccount(data.field.username, data.field.password);
                        //保存token
                        localStorage.setItem("token", res.token)
                        location.href = 'index.html'
                        break;
                    case 1:
                        layer.msg('用户名或密码错误！');
                        break;
                    default:
                        layer.msg('登陆失败，原因未知！');
                        break;
                }
            }
        });
        return false;
    });


    //保存用户名和密码
    function saveAccount(username, password) {
        if ($("#saveAccount").prop("checked")) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            localStorage.setItem("isSaveAccount", true);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.removeItem("isSaveAccount");
        }
    }

    orderAccount();
    //渲染用户名和密码
    function orderAccount() {
        if (localStorage.getItem("isSaveAccount") === "true") {
            $(".login-box .username").val(localStorage.getItem("username"));
            $(".login-box .password").val(localStorage.getItem("password"));
            $(".layui-form-checkbox").click();
        }
    }


})