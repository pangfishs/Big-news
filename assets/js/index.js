$(function () {
    // 获取layui里的layer对象
    var layer = layui.layer

    getUserinfo()
    //隐藏所有头像
    $('.avatar').hide()

    // 实现退出功能
    $('.btn-exit').on('click', function () {
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //清空localStroage里的token
            localStorage.removeItem('token')
            location.href = 'login.html'
            //关闭弹出层
            layer.close(index);
        });
    })
})

// 调用用户的基本信息方法
function getUserinfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败!')
            }
            renderAvatar(res.data)
        }
        
    })
}
//渲染用户头像的方法
function renderAvatar(user) {
    var name =  user.nickname || user.username 
    $('#welcome').html('欢迎' + name)
    //渲染图片头像
    if (user.user_pic !== null) {
        $('.').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()
        //渲染文字图像
    }
}