$(function() {
    var layer = layui.layer;
    var laytpl = layui.laytpl;
    var form = layui.form;
    var laypage = layui.laypage;


    // 默认渲染数据
    var qData = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    renderArtList();

    function renderArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: qData,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var getTpl = artListTpl.innerHTML,
                    artListView = document.getElementById('artListView');
                laytpl(getTpl).render(res, function(html) {
                    artListView.innerHTML = html;
                });
                renderPage(res.total);
            }
        });
    }

    // 渲染文章类别选择框
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


    // 实现筛选基本功能
    $("#filterForm").on("submit", function(e) {
        e.preventDefault();
        qData.cate_id = $('[name=cate_id]').val();
        qData.state = $('[name=state]').val();
        renderArtList();
    });


    // 分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到
            limit: qData.pagesize,
            curr: qData.pagenum,
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                qData.pagenum = obj.curr;
                qData.pagesize = obj.limit;
                if (!first) {
                    renderArtList();
                }
            }
        });
    }

    //删除文章
    $(".layui-table").on("click", ".del-art", function() {
        var len = $(".del-art").length;
        var id = $(this).attr("data-id");
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            ////根据ID删除文章类别
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    //删除失败
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    //删除成功
                    layer.msg(res.message);
                    if (len === 1) {
                        qData.pagenum = qData.pagenum == 1 ? 1 : qData.pagenum - 1;
                    }
                    //重新渲染文章列表
                    renderArtList();
                }
            })
            layer.close(index);
        });
    });

    // 编辑文章
    $(".layui-table").on("click", ".edit-art", function() {
        var id = $(this).attr("data-id");
        location.href = 'publish_article.html?' + id;
    });


});