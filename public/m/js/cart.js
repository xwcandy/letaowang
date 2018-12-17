$(function () {


    //页面一加载，发送查询购物车的请求（需要登录）
    queryCart();


    //定义一个全局变量记录页数
    var page = 1;

    //初始化下拉刷新和上拉加载
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            //下拉刷新
            down: {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    //下拉一松手就执行的回调函数，显示最新的数据，设置定时器为了模拟网络延时
                    setTimeout(function () {
                        //发请求
                        queryCart();
                        //结束下拉刷新
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        //重置上拉加载效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        //重置page=1 
                        page = 1;
                        
                    }, 1000);
                }
            },
            //上拉加载
            up: {
                height: 50,//可选.默认50.触发上拉加载拖动距离
                auto: true,//可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    setTimeout(function () {
                        //每上拉加载一次，页数就++
                        page++;
                        //发请求，获取分页的购物车商品，将商品追加到ul
                        $.ajax({
                            url: '/cart/queryCartPaging',
                            data: { page: page, pageSize: 3, },
                            success: function (obj) {
                                //后台返回数据时，有数据是一个对象，data数组在对象里面，没有数据时返回的是一个空数组[],
                                // 所以我们要把[]转为 { data:[]} 这种格式，方便处理数据
                                if(obj instanceof Array){
                                    obj = { data: [] };
                                }
                                console.log(obj);
                                //调用模版追加到页面
                                var html = template('queryCartTpl', obj);
                                $('#main .cartList').append(html);
                                //判断还有没有数据
                                if(obj.data.length > 0){
                                    //结束上拉加载 有数据，结束下拉加载时写一个参数false，
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                }else {
                                    //结束上拉加载 没有数据了，写true，就会提示没有更多数据了
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        })
                        
                    }, 1000);
                }
            }
        }
    });




    //将查询购物车的请求封装起来
    function queryCart() {
        $.ajax({
            url: '/cart/queryCartPaging',
            data: { page: 1, pageSize: 3, },
            success: function (obj) {
                console.log(obj);
                //根据响应体判断是否有登录
                if (obj.error) {
                    //显示error代表未登录，跳转到登录，带上本页的路径作为参数
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    //有登录，响应体是我们需要的数据，调用模版渲染到页面
                    var html = template('queryCartTpl', obj);
                    $('#main .cartList').html(html);
                }
            }
        })
    }

})