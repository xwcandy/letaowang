$(function(){

    // 拿到搜索页传递过来的关键字
    //location.search.split('=')[1] 拿到地址栏URL中=后面那个值 中文会是乱码 decodeURI可以将其转为中文
    // var search = decodeURI(location.search.split('=')[1]);
    // console.log(search);
    //上面这个方法是只有一个参数的时候，有多个参数就不能这样，所以封装了下面有一个获取参数值的函数
    
    //拿到搜索页传递过来的搜索内容
    var search = getQueryString('search');

    //页面一加载，拿到搜索页面的关键字发请求，获取数据显示到页面
    queryProduct();

    // 根据URL参数名获取参数值
    function getQueryString(name){
        //获取URL的参数 并且删掉第一个？ substr(start,length)
        var urlParam = location.search.substr(1);
        console.log(urlParam);
        //将参数按 &符号分割成数组
        urlParam = urlParam.split('&');
        for(var i=0; i < urlParam.length; i++){
            if(name == urlParam[i].split('=')[0]){
                return decodeURI(urlParam[i].split('=')[1]);
            }
        } 
    }
    

    // 将获取商品的请求封装到一个函数
    function queryProduct(){
        //根据搜索内容发请求
        $.ajax({
            url: '/product/queryProduct',
            data: {
                page: 1,
                pageSize: 4,
                proName: search,   
            },
            success: function(obj){
                console.log(obj);
                // 调用模版，生成商品列表li,显示到页面
                var html = template('queryProductTpl',obj);
                $('.product-list ul').html(html);
            }
        })
    }
    

    //给搜索按钮注册点击事件
    $('.btn-search').on('tap',function(){
        //获取搜索框的内容
        search = $('.input-search').val();
        //进行非空判断  search.trim() === ''  trim()去掉首尾空格
        if(!search.trim()){
            alert('输入内容不能为空，请重新输入商品！');
            return;
        }
        //发请求
        queryProduct();
    })

    
    /*
    需求：点击排序字段，根据字段名进行排序
        点击价格，进行排序，默认是1-升序，点一下变成2-降序，点击时就来回切换排序方式
        点击销量，进行排序，默认是1-升序，点一下变成2-降序，点击时就来回切换排序方式
    */
    //给商品详情头部的所有a的排序字段注册点击事件
    $('.productList .head ul li a').on('tap',function(){
        //获取自定义属性data-sort的值-排序方式
        var sort = $(this).data('sort');
        //获取当前排序的字段
        var sortType = $(this).data('sortType');
        //把请求的参数单独声明，为了动态添加排序字段这个参数，因为它是变量，不能在{}里面直接写，只能用[]的方式添加
        var dataParam = {page:1,pageSize:4,proName:search};
        dataParam[sortType] = sort;
        console.log(dataParam);
        //发请求
        $.ajax({
            url: '/product/queryProduct',
            data: dataParam,
            success: function(obj){
                console.log(obj);
                // 调用模版，生成商品列表li,显示到页面
                var html = template('queryProductTpl',obj);
                $('.product-list ul').html(html);
            }
        })
        //每次点击后都要改变排序的值
        sort = (sort == 1) ? 2 : 1;
        $(this).data('sort',sort);
    })


    //定义一个全局变量 page 记录页数
    var page = 1;
    //下拉刷新和上拉加载
    mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          //下拉刷新
          down : {
            height:50,//可选,默认50.触发下拉刷新拖动距离,
            auto: false,//可选,默认false.首次加载自动下拉刷新一次
            contentdown : "下拉可以刷新哟",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新哟",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在拼命刷新哟...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback :function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                //从松手开始执行这个回调函数，即刷新要做的事情
                //发请求，获取最新数据显示到页面  因为本地服务请求很快，为了看到效果加了一个定时器
                setTimeout(function(){
                    queryProduct();
                    //数据显示到页面后 结束下拉刷新
                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                    //重置上拉加载   因为上拉加载可能已经到底部了没数据了，所以当再次下拉刷新时，应该重置上拉加载 
                    mui('#refreshContainer').pullRefresh().refresh(true);
                    //重置page  每次上拉刷新 都应该把页数改成第一页
                    page = 1;
                },1000);
                
            } 
          },
          //上拉加载
          up : {
            height:50,//可选.默认50.触发上拉加载拖动距离
            auto:true,//可选,默认false.自动上拉加载一次
            contentrefresh : "正在拼命加载中...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'在下实在没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback : function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                //每上拉一次 页数+1
                page++ ;
                //根据页数请求新的数据，追加到ul后面   因为本地服务请求很快，为了看到效果加了一个定时器
                setTimeout(function(){
                    $.ajax({
                        url: '/product/queryProduct',
                        data: {
                            page: page,
                            pageSize: 4,
                            proName: search,   
                        },
                        success: function(obj){
                            console.log(obj);
                            
                            //判断还有没有数据，有就追加，没有则结束上拉加载
                            if(obj.data.length > 0){
                                // 调用模版，生成商品列表li,追加到页面
                                var html = template('queryProductTpl',obj);
                                $('.product-list ul').append(html);
                                //数据追加完成后 结束上拉加载 false表示还有数据  就会显示上拉显示更多
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                            }else {
                                //结束上拉加载 true表示没有数据了  就会显示没有更多数据了 也就不能上拉加载了
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                // page = 1;
                            }
                        }
                    })
                },1000);
                  
            } 
          }
        }
    });



    //给立即购买注册点击事件
    $('.product-list').on('tap','.btn-buy',function(){
        //取出当前点击的商品的id
        var id = $(this).data('id');
        // console.log(id);
        //跳转到商品详情页 将参数id带过去
        location = 'detail.html?id='+id;
    })
    
      

    // 根据url参数名获取参数值 另一种方式
    // function getQueryString(name) {
    //     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    //     var r = window.location.search.substr(1).match(reg);
    //     console.log(r);
    //     if (r != null) {
    //         //转码方式改成 decodeURI
    //         return decodeURI(r[2]);
    //     }
    //     return null;
    // }
        

    


})