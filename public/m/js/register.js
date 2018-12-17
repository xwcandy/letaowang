$(function () {


    //取到传递过来的url
    var url = getQueryString('returnUrl');


    // 定义一个全局变量获取验证码
    var vCode = null;


    // 给注册按钮添加点击事件
    $('.btn-register').on('tap', function () {
        //对表单中的每个字段进行非空判断 (用的是MUI提供的js代码)
        var check = true;
        mui(".mui-input-group input").each(function () {
            //若当前input为空，则alert提醒 
            if (!this.value || this.value.trim() == "") {
                //获取上一个兄弟元素lable
                var label = this.previousElementSibling;
                //将lable里的内容拼接来提示
                mui.alert(label.innerText + "不允许为空");
                check = false;
                return false;
            }
        });

        //只有当check为true，也就是每个字段都输入了内容后才会执行这里面
        if (check) {
            //判断手机号是否合法
            var mobile = $('.mobile').val();
            if (!(/^1[34578]\d{9}$/.test(mobile))) {
                //如果不合法，则提示
                mui.toast('手机号码有误，请重填！', { duration: 'long', type: 'div' });
                return false;
            }
            //判断用户名长度不能超过十位
            var username = $('.username').val();
            if (username.length > 10) {
                mui.toast('用户名长度不能超过十位，请重新输入！', { duration: 'long', type: 'div' });
                return false;
            }
            //判断两次密码是否一致
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            if (password1 != password2) {
                mui.toast('两次密码输入不一致，请重新输入！', { duration: 'long', type: 'div' });
                return false;
            }

            //判断用户输入验证码和返回的验证码是否一致
            var vcode = $('.vcode').val();
            if (vcode != vCode) {
                //验证码不一致，提示错误
                mui.toast('验证码有误！', { duration: 'long', type: 'div' });
                return false;
            } else {
                //说明注册信息都无误，发注册的请求
                $.ajax({
                    url: ' /user/register',
                    type: 'post',
                    data: {username : username, password : password1, mobile : mobile, vCode : vcode},
                    success: function(obj){
                        console.log(obj);
                        //根据响应体判断注册是否成功
                        if(obj.error){
                            mui.toast(obj.message, { duration: 'long', type: 'div' });
                        }else { 
                            // 注册成功，跳转到登录页
                            location = 'login.html?returnUrl='+url;
                        }
                    }
                })
            }



        }
    })

    
    //给获取验证码注册点击事件
    $('.btn-getVcode').on('tap', function () {
        //发送请求获取验证码，这里是后台返回的一个6位数的验证码，实际工作是要发送到用户手机拿到验证码的
        //手机号非空判断
        if (!$('.mobile').val().trim()) {
            mui.alert("手机号不允许为空");
        } else {
            $.ajax({
                url: '/user/vCode',
                success: function (obj) {
                    console.log(obj);
                    vCode = obj.vCode;
                }
            })
        }

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