var layer = layui.layer; //layui的弹出层定义
var form = layui.form; //layui的表单定义
var upload = layui.upload; //layui的上传文件定义


//初始化cropper插件
initCropper();

function initCropper() {
    $('.cropper-box>img').cropper({
        aspectRatio: 1, //裁剪框的宽高比
        viewMode: 1, //定义cropper的视图模式
        dragMode: 'move', //定义cropper的拖拽模式
        dragCrop: false,
        crop: function() {
            preAvatat();
        }
    });
}
// 预览头像区域

function preAvatat() {
    var cas1 = $('.cropper-box>img').cropper('getCroppedCanvas', {
        width: 100,
        height: 100,
        maxWidth: 100,
        maxHeight: 100,
        imageSmoothingQuality: 'high'
    });
    var cas2 = $('.cropper-box>img').cropper('getCroppedCanvas', {
        width: 50,
        height: 50,
        maxWidth: 50,
        maxHeight: 50,
        imageSmoothingQuality: 'high'
    });
    $(".pre-avatar1").html(cas1);
    $(".pre-avatar2").html(cas2);
}


//上传图片模块初始化
var uploadInst = upload.render({
    elem: '#selectAvatarImg' //绑定元素
        ,
    auto: false, //不自动上传
    accept: 'images', //校验是否为图片
    acceptMime: 'image/*', //只显示图片文件
    done: function(res) {
        //上传完毕回调
    },
    error: function() {
        //请求异常回调
    },
    choose: function(obj) {
        //选择文件后回调

        //将每次选择的文件追加到文件队列
        var files = obj.pushFile();
        //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
        obj.preview(function(index, file, result) {
            console.log(index); //得到文件索引
            console.log(file); //得到文件对象
            console.log(result); //得到文件base64编码，比如图片

            // 重构cropper图片
            $(".upload-avatar-area").cropper('replace', result, true);
            $('.cropper-box>img').cropper('destroy');
            $('.cropper-box>img').attr("src", result);
            initCropper();
        });
    }


});

//监听上传头像按钮
$("#uploadAvatarImg").on("click", function() {
    uploadAvatar();
})

//上传头像请求
function uploadAvatar() {
    var dataURL = $(".upload-avatar-area").cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    }).toDataURL();
    if (dataURL) {
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //渲染全局用户信息
                window.parent.getUserInfo();
            }
        })
    } else {
        layer.msg('上传失败！请选择正确的图片');
    }
}