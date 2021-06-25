$(function () {

    var layer = layui.layer
    var form = layui.form
    inintArticleList()

    // 为添加按钮设置点击事件
    // 获取open方法的返回值
    var index = null
    var indexEdit = null
    var indexDel = null
    $('#btnAddCate').on('click', function () {
        index = layer.open({
            //去除弹出层的按钮
            type: 1,
            //指定弹出城的宽高
            area: ['500px', '250px'],
            title: '在线调试',
            content: $('#dialog-add').html()
        });

    })

    // 添加类别操作
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                inintArticleList()
                layer.msg('新增分类成功')
                //根据索引关闭对应的弹出层
                layer.close(index)
            }
        })
    })

    //修改类别内容
    $('#cateBody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            //去除弹出层的按钮
            type: 1,
            //指定弹出城的宽高
            area: ['500px', '250px'],
            title: '在线修改',
            content: $('#dialog-edit').html()
        });

        let id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改类别操作
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败')
                }
                inintArticleList()
                layer.msg('修改分类成功')
                //根据索引关闭对应的弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 删除类别操作
    $('#cateBody').on('click', '.btn-del',  function () {
        let id =  $(this).attr('data-id')
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id ,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')

                    }
                    inintArticleList()
                    layer.msg('删除文章分类成功！')
                }
            })

            layer.close(index);
        });
    })

    //获取文章列表
    function inintArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求失败')

                }
                // 将获取的内容渲染到模板当中
                var htmlStr = template('tpl', res)
                $('#cateBody').html(htmlStr)
            }
        })
    }
})