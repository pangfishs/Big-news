$(function () {
    var form = layui.form
    //定义一个查询的参数对象,将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码数, 默认请求第一页的数据
        pagesize: 2, //每页显示几条数据,默认为每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }

    var layer = layui.layer
    var laypage = layui.laypage;
    // 美化时间格式
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(str) {
        return str < 10 ? '0' + str : str
    }
    initTable()
    initCate()
    //获取文章分类数据的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类失败!')
                }
                //使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-cate', res)
                $('#cate_id').html(htmlStr)
                // 使用layui从新渲染表单区域的UI结构
                form.render()
            }

        })
    }
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败!')
                }
                //使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-tab', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 监听分类表单的提交事件
    $('#list-form').on('submit', function (e) {
        e.preventDefault()
        //获取表单项中的值
        let cate_id = $('#cate_id').val()
        let state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，从新赋值表格
        initTable()

    })

    // 编辑按钮点击事件
    $('tbody').on('click', '.btn-edit', function () {
        let id = $(this).attr('data-id')
        location.href = 'art_update.html?id=' + id

        /*  $.ajax({
             method: 'POST',
             url: '/my/article/edit',
             data: fd,
             // 注意：如果向服务器提交的是 FormData 格式的数据，
             // 必须添加以下两个配置项
             contentType: false,
             processData: false,
             success: function (res) {
                 if (res.status !== 0) {
                     return layer.msg('发布文章失败！')
                 }
                 layer.msg('发布文章成功！')
                 // 发布文章成功后，跳转到文章列表页面
                 location.href = 'art_list.html'
             }
         }) */
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染分页的结构
        laypage.render({
            elem: 'pageBox', //渲染页面的div的id

            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //一页显示多少数据
            curr: q.pagenum, //当前显示数据的内容
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump函数的触发方式有两种
            // 1：点击页码的时候，会触发jump回调
            // 2：只要调用了laypage.render()发法就会触发jump回调
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 得到当前页为查询参数对象q中对应的属性赋值
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 首次不执行
                if (!first) {
                    initTable()
                }
            }
        });
    }

    $('tbody').on('click', '.btn-del', function() {
        // 获取当前页面中删除按钮的个数
        var len = $('.btn-del').length
        // 获取该文章的id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功')
                    //当前数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余的数据了，则让页码值-1之后，
                    // 再重新调用initTable方法
                    if(len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上就没有如何数据

                        // 页码值最小值不能小于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
          });
    })


})