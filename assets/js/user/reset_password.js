var layer = layui.layer; //layui的弹出层定义
var form = layui.form; //layui的表单定义

//密码规则验证
form.verify({
    newpass: function(value) {
        if ($(".new-password").val() !== $(".pre-newpassword").val()) {
            return '两次输入的密码不一致！';
        }
    },

    pass: function(value) {
        if (/^[\S]{6,12}$/.test(value) == false) {
            return '密码长度在6-12位，且不能使用空格';
        }
        if ($(".old-password").val() === $(".new-password").val()) {
            return '新密码不能与原密码相同！'
        }
    }
});
//修改密码请求API
form.on('submit(modifyPasswordBtn)', function(data) {
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: {
            oldPwd: data.field.oldPassword,
            newPwd: data.field.newPassword
        },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $(".reset-password").click();
        }
    })
    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
});