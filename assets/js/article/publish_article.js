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