// 每次调用$.ajax 或$.get 或$.post 的时候都会先调用ajaxPrefilter这个函数
//这个函数可以获取到我们给Ajax的配置对象
$.ajaxPrefilter(function (option) {
     //发起真正的ajax请求前，同一拼接根路径
     option.url = 'http://api-breakingnews-web.itheima.net' + option.url

     if (option.url.indexOf('/my/') != -1) {
          //统一为有权限的接口，设置headers 请求头
          option.headers = {
               Authorization: localStorage.getItem('token') || []
          }
     }

     //全局统一挂载complete回调函数
     //无论成功或失败都会调用complete函数
     option.complete = function (res) {
          if (res.responseJSON.status === 1 && res.responseJSON.message == "身份认证失败！") {
               //清空localStroage里的token
               localStorage.removeItem('token')
               location.href = 'login.html'
          }
     }
})