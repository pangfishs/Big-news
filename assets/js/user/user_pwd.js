$(function () {
    let form = layui.form
    form.verify({
        //验证密码
        pwd: [/^[\Sa-zA-Z0-9_-]{6,12}$/, '密码必须位6-12位,不能有特殊字符且为空'],
        samePwd: function (value) {
            pwd = $('.layui-form-item [name=oldPwd]').val()
            if (value === pwd) {
                return '新旧密码不能一致'
            }
        },
        rePwd: function (value) {
            pwd = $('.layui-form-item [name=newPwd]').val()
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    // 设置提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })

    })
})