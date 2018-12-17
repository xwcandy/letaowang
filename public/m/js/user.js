$(function(){

    // 页面一加载，发送查询个人信息的请求（需要登录）
    $.ajax({
        url: ' /user/queryUserMessage',
        success: function(obj){
            console.log(obj);
            //根据响应体判断是否登录，如果是error，就是未登录，应该跳到登录页
            if(obj.error){
                //跳到登录页
                location = 'login.html?returnUrl='+location.href;
            }else {
                //说明登录过，将用户名和手机号显示到页面上
                $('.username').text(obj.username);
                $('.mobile').text(obj.mobile);
            }
        }
    })


    //给退出登录按钮注册点击事件
    $('.btn-exit').on('tap',function(){
        // 发送退出登录的请求，因为登录信息是用cookie记录的，要发请求后台操作删除cookie
        $.ajax({
            url: ' /user/logout',
            success: function(obj){
                console.log(obj);
                if(obj.success){
                    //一般用户退出登录是要换账户，所以跳转到登录页
                    location = 'login.html?returnUrl='+location.href;
                }
                
            }
        })
        //不能只是这样单纯的跳转到登录页，因为退出后就应该删除登录记录，如果只是单纯跳转页面，用户依然可以进入到任何页面，因为登录信息还是存在，不是真正的退出
        // location = 'login.html?returnUrl='+location.href;
    })



})