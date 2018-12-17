$(function () {

    //获取列表页传过来的id
    var id = getQueryString('id');
    console.log(id);
    // 根据获取的商品id发请求
    $.ajax({
        url: '/product/queryProductDetail',
        data: { id: id },
        success: function (obj) {
            // 将size尺码转为数组（例如：30-40）
            var min = obj.size.split('-')[0] - 0;
            var max = obj.size.split('-')[1];
            obj.size = [];
            for (var i = min; i <= max; i++) {
                obj.size.push(i);
            }
            // console.log(obj.size);

            console.log(obj);
            //调用模板，生成商品详情，显示到页面
            var html = template('queryProductDetailTpl', obj);
            $('#product-detail').html(html);

            // 初始化内容滚动
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                indicators: false, //是否显示滚动条
            });

            //轮播图初始化
            mui('#slide').slider({
                interval: 1000,
            });

            //尺码点击事件(如果这个事件不放在响应体回调函数，就应该注册父元素事件委托)
            $('.btn-size').on('tap',function(){
                $(this).addClass('active').siblings().removeClass('active');
            })

            //手动初始化数字输入框 (MUI的一个组件，因为动态添加的，所以需要手动初始化一下)
            mui('.mui-numbox').numbox();

        }
    })




    //给加入购物车按钮注册点击事件
    $('.btn-add-cart').on('tap',function(){
        //进行尺码和数量的非空判断
        var size = $('.btn-size.active').data('size'); //老师说-js取值都用自定义属性保存值
        var num = $('.btn-num').val();
        if(!size){
            mui.toast('请选择尺码！',{ duration:'long', type:'div' });
            return false;
        }
        if(num <= 0){
            mui.toast('请选择数量！',{ duration:'long', type:'div' });
            return false;
        }

        //到这里说明尺码和数量都选择了
        //发送添加购物车的请求，根据响应体判断有没有登录，没有登录，就要跳到登录页面
        $.ajax({
            url: ' /cart/addCart',
            type: 'post',
            data: { productId : id, num : num, size : size},
            success: function(obj){
                console.log(obj);
                //如果响应体是error，代表没登录，将跳到登录页
                if(obj.error){
                    //只要是跳到登录页的，都要带上本页地址作为参数传递过去，方便用户登录完后返回这页
                    location = 'login.html?returnUrl='+location.href;
                }else {
                    //显示success表示登录过了，就显示消息框，询问用户是否要去购物车查看
                    mui.confirm( '商品添加成功，是否要去购物车查看？', '温馨提示', ['去看','不去'], function(){

                    } )
                }
            }
        })
        

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

