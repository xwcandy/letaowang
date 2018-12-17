$(function () {


    //取到传递过来的url
    var url = getQueryString('returnUrl');

    //给登录按钮注册点击事件
    $('.btn-login').on('tap', function () {
        //获取用户名和密码
        var username = $('.username').val();
        var password = $('.password').val();
        //非空判断
        if (!username.trim()) {
            mui.alert('用户名不允许为空！', '温馨提示', '知道了', function () {

            });
            return false;
        }
        if (!password.trim()) {
            mui.alert('密码不允许为空', '温馨提示', '知道了', function () {

            });
            return false;
        }

        //到这里说明用户名和密码都输入了
        //发登录的请求 : 根据响应体判断是否可以登录，根据报错的信息做处理
        $.ajax({
            url: ' /user/login',
            type: 'post',
            data: { username : username, password : password},
            success: function(obj){
                console.log(obj);
                //如果返回error，说明登录失败，根据报错信息，做相应提示
                if(obj.error){
                    mui.alert( obj.message, '提示', '确定' );
                }else { 
                    //说明登录成功 跳到用户来登录页的上一页
                    location = url;
                }
            }
        })
    })



    //给免费注册按钮添加点击事件
    $('.btn-register').on('tap',function(){
        //跳转到注册页面，跳到注册页应该要把上一页带过来的地址参数带到注册页，方便用户注册完后能把这个地址返回到登录页，待用户登录后就可以返回这页
        location = 'register.html?returnUrl='+url;
    })




    // 根据url参数名获取参数值 另一种方式
    function getQueryString(name) {
       var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
       var r = window.location.search.substr(1).match(reg);
       console.log(r);
       if (r != null) {
           //转码方式改成 decodeURI
           return decodeURI(r[2]);
       }
       return null;
    }




})