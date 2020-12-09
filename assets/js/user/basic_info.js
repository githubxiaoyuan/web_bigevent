$(function() {
    var layer = layui.layer; //layui的弹出层定义
    var form = layui.form;

    // 获取用户信息

    getUserInfo();

    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('请求用户信息失败');
                }
                //渲染基本资料
                renderBasicInfo(res.data);

            }
        });
    }

    //渲染基本资料
    function renderBasicInfo(user) {
        $(".user-id-input").val(user.id);
        $(".basic-info .login-name").val(user.username);
        if (user.nickname) {
            $(".basic-info .user-nickname").val(user.nickname);
        }
        if (user.email) {
            $(".basic-info .user-email").val(user.email);
        }
    }

    //修改基本资料
    form.on('submit(basicUserInfo)', function(data) {
        //获取表单数据
        var modifyData = {
            id: data.field.id,
            nickname: data.field.nickname,
            email: data.field.email
        }

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: modifyData,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //渲染基本资料
                getUserInfo();
                //渲染全局用户信息
                window.parent.getUserInfo();
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //重置基本资料
    $("#resetUserInfoBtn").on("click", function() {
        getUserInfo();
    });
})