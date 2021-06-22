$(function () {
    // 导入layui里的form对象
    var form = layui.form
    // 添加验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度必须在1-6个字符之间"
            }
        }
    })

    initUserinfo()

    // 重置功能
    $('.layui-btn-primary').on('click', function (e) {
        // 阻止表单默认提交信息
        e.preventDefault()
        initUserinfo()
    })

    //提交功能
    $('#form-user').on('submit', function (e) {
        e.preventDefault();
        //提交修改后的数据
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                window.parent.getUserinfo()
            }

        })

    })


    // 初始化用户的基本信息
    function initUserinfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                /* $('.layui-form-item [name=username]').val(data.username)
                $('.layui-form-item [name=nickname]').val(data.nickname)
                $('.layui-form-item [name=email]').val(data.email) */

                // 使用layui里的方法赋值表单内容，前提表单需要有lay-filter自定义属性后用form.val()方法快速赋值
                // form.val('接受值的表单', '传入值的对象')
                form.val('formUserinfo', res.data)

            }
        })
    }


})