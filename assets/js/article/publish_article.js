// 初始化TinyMCE
tinymce.init({
    selector: '#myTinyMce',
    language: 'zh_CN',
    plugins: 'code,lists,advlist,image,imagetools,preview,codesample,searchreplace,visualchars,visualblocks,link,template,table,charmap,hr,pagebreak,nonbreaking,anchor,insertdatetime,spellchecker',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | preview | forecolor | codesample fontsizeselect |',
    height: 350,
    statusbar: false,
    color_cols: 8,
    color_map: [
        "000000", "Black",
        "993300", "Burnt orange",
        "333300", "Dark olive",
        "003300", "Dark green",
        "003366", "Dark azure",
        "000080", "Navy Blue",
        "333399", "Indigo",
        "333333", "Very dark gray",
        "800000", "Maroon",
        "FF6600", "Orange",
        "808000", "Olive",
        "008000", "Green",
        "008080", "Teal",
        "0000FF", "Blue",
        "666699", "Grayish blue",
        "808080", "Gray",
        "FF0000", "Red",
        "FF9900", "Amber",
        "99CC00", "Yellow green",
        "339966", "Sea green",
        "33CCCC", "Turquoise",
        "3366FF", "Royal blue",
        "800080", "Purple",
        "999999", "Medium gray",
        "FF00FF", "Magenta",
        "FFCC00", "Gold",
        "FFFF00", "Yellow",
        "00FF00", "Lime",
        "00FFFF", "Aqua",
        "00CCFF", "Sky blue",
        "993366", "Red violet",
        "FFFFFF", "White",
        "FF99CC", "Pink",
        "FFCC99", "Peach",
        "FFFF99", "Light yellow",
        "CCFFCC", "Pale Green",
        "CCFFFF", "Pale cyan",
        "99CCFF", "Light sky blue",
        "CC99FF", "Plum"
    ]
});

//初始化layui模块
var form = layui.form;
var layer = layui.layer;
var laytpl = layui.laytpl;


renderArticleCategorySelect();
// 监听点击选择文章类别事件
$(".article-select-input .layui-unselect").on("click", function() {
    renderArticleCategorySelect();
});

function renderArticleCategorySelect() {
    //请求文章类别
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.status);
            }
            //渲染选择框的文章类别
            var tplData = res.data;
            var getTpl = articleCategoryTpl.innerHTML,
                view = document.getElementById('selectArticleCategoryView');
            laytpl(getTpl).render(tplData, function(html) {
                view.innerHTML = html;
            });
            //更新渲染选择列表
            form.render('select');
        }
    });
}

// 文章封面
//初始化cropper插件
initCropper();

function initCropper() {
    $('.cropper-box>img').cropper({
        aspectRatio: 16 / 9, //裁剪框的宽高比
        viewMode: 1, //定义cropper的视图模式
        dragMode: 'move', //定义cropper的拖拽模式
        dragCrop: false,
        autoCropArea: 0.8,
        minContainerWidth: 400,
        minContainerHeight: 280,
        minCanvasWidth: 400,
        minCanvasHeight: 280,
        crop: function() {
            preAvatat();
        }
    });
}

function preAvatat() {
    var cas1 = $('.cropper-box>img').cropper('getCroppedCanvas', {
        width: 200,
        height: 140,
        maxWidth: 200,
        maxHeight: 140,
        imageSmoothingQuality: 'high'
    });
    $(".pre-avatar1").html(cas1);
}


// 选择封面
$("#choseCoverBtn").on("click", function(e) {
    e.preventDefault();
    $("#selectCover").click();
});

$("#selectCover").on("change", function(e) {
    var files = e.target.files;
    if (files.length === 0) {
        return;
    }
    var newImgURL = URL.createObjectURL(files[0]);
    // 重构cropper图片
    $(".upload-avatar-area").cropper('replace', newImgURL, true);
    $('.cropper-box>img').cropper('destroy');
    $('.cropper-box>img').attr("src", newImgURL);
    initCropper();


});

// 定义文章状态
var artState = '已发布';

$("#saveAtrBtn").on("click", function(e) {
    e.preventDefault();
    artState = '草稿';
});

// 监听表单提交
$("#pubAtrForm").on("submit", function(e) {
    // 阻止表单默认事件
    e.preventDefault();
    // 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0]);
    // 将文章的发布状态，存到 fd 中
    fd.append('state', artState);
    // 将封面裁剪过后的图片，输出为一个文件对象
    $(".upload-avatar-area").cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    }).toBlob(function(blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象，存储到 fd 中
        fd.append('cover_img', blob);
        fd.forEach(function(i, item) {
            console.log(i, item);
        });
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
            }
        })
    });
})