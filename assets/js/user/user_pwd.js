$(function() {
    var form = layui.form

    // 设置密码验证规则
    form.verify({
        pwd:[/^[\Sa-zA-Z0-9-_]{6,12}$/,'密码必须6到12位且不能位空格和特殊字符'],
        samePwd: function(value) {
            let pwd = $('.layui-form [name=oldPwd]').val() 
            if(value === pwd) {
                return '新旧密码不能相同'
            }
        },
        repwd: function(value) {
            let pwd = $('.layui-form [name=newPwd]').val()
            if(value !== pwd) {
                return '两次密码输入不一致'
            }
        }
    })
   
    //重置密码功能
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            //serialize()是jquery封装的快速获取表单里的值的方法
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                $('.layui-form')[0].reset()
            }
        })


    })
})