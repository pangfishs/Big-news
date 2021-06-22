$(function () {
    $('#link-login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    var form = layui.form
    form.verify({
        // 自定义密码验证规则
        pwd: function (value) {
            if (!/^[\Sa-zA-Z0-9_-]{6,12}$/.test(value)) {
                return '密码必须为6到12位且不能有空格以及特殊字符'
            }
        },
        //自定义检查两次密码是否一致规则
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) {
                return '两次密码输入不一致'
            }
        }

    })
    //layui的内置提示对象
    let layer = layui.layer
    // 监听class为reg-form的form表单的提交事件
    $('.reg-form').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg-form .user-ipt').val().trim(),
                password: $('.reg-form .pwd-ipt').val().trim()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                $('#link-login').click()
            }
        })
    })

    $('.login-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                setTimeout(() => {
                    location.href = 'index.html'
                }, 1000)
            }
        })
    })

  

})