$(function() {

    var layer = layui.layer;
    var laytpl = layui.laytpl;
    var form = layui.form;
    //获取文章类别
    getArticleCategory();

    function getArticleCategory() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.status);
                }
                //渲染文章类别数据
                renderArticleCategory(res.data);
            }
        });
    }


    //渲染文章类别
    function renderArticleCategory(articleCategoryData) {
        var data = articleCategoryData;
        var getTpl = articleCategoryModule.innerHTML,
            view = document.getElementById('articleCategoryView');
        laytpl(getTpl).render(data, function(html) {
            view.innerHTML = html;
        });
    }

    //删除文章类别
    $(".layui-table").on("click", ".del-article-category", function() {
        var id = $(this).siblings(".article-category-id").text();
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            ////根据ID删除文章类别
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    //删除失败
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    //删除成功
                    layer.msg(res.message);
                    //重新渲染文章分类
                    getArticleCategory();
                }
            })
            layer.close(index);
        });
    });

    //添加文章类别
    //定义添加文章类别弹窗的索引
    var addLayerIndex = null;
    //添加分类按钮触发事件
    $(".add-category-btn").on("click", function() {
        addLayerIndex = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '250px'],
            content: $('#addArticleCategoryForm') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    });
    //监听提交添加的文章类别
    form.on('submit(addArticleCategoryBtn)', function(data) {
        var submitData = {
            name: data.field.name,
            alias: data.field.alias
        };
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: submitData,
            success: function(res) {
                console.log(res);
                //添加失败
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //添加成功
                layer.msg(res.message);
                //重新渲染文章分类
                getArticleCategory();
                //关闭弹出层
                layer.close(addLayerIndex);
            }
        });
        return false;
    });

    //编辑文章分类
    var editLayerIndex = null;
    $(".layui-table").on("click", ".edit-article-category", function() {
        var categoryName = $(this).parent().siblings("td")[0].innerText;
        var categoryNickName = $(this).parent().siblings("td")[1].innerText;
        $(".article-category-form-id").val($(this).siblings(".article-category-id").text());
        editLayerIndex = layer.open({
            type: 1,
            title: '修改文章类别',
            area: ['500px', '250px'],
            content: $('#editArticleCategoryForm'),
            success: function(layero, index) {
                    $(".edit-category-name").val(categoryName);
                    $(".edit-category-nickname").val(categoryNickName);
                } //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    });
    //监听编辑文章的提交
    form.on('submit(editArticleCategoryBtn)', function(data) {
        var submitData = {
            Id: data.field.Id,
            name: data.field.name,
            alias: data.field.alias
        };
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: submitData,
            success: function(res) {
                //请求失败
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //请求成功
                layer.msg(res.message);
                //关闭弹出层
                layer.close(editLayerIndex);
                //重新渲染文章分类
                getArticleCategory();
            }
        })
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

})