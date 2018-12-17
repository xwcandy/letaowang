// 使用的是zepto的js库
$(function(){

    // 初始化内容滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false, //是否显示滚动条
    });

    //发一个请求，获取分类左侧的数据
    $.ajax ({
        url: ' /category/queryTopCategory',
        success: function(obj){
            // console.log(obj);
            // 调用模版，生成分类,并显示到页面
            var html = template('queryTopCategoryTpl',obj);
            $('.category-left ul').html(html);
        }
    })

    //点击左侧分类a : 发请求，获取对应的数据显示到分类右侧
    //分类左侧的li是动态生成的，所以要用父元素委托注册
    $('.category-left ul').on('tap','a',function(){
        
        // 通过自定义属性获取当前点击的a的id
        var id = $(this).data('id');
        // console.log(id);
        // 发请求
        querySecondCategory(id);
        //给当前点击的a的父元素li加上类名active，其他兄弟元素删除active
        $(this).parent().addClass('active').siblings().removeClass('active');
    })

    // 页面一加载，请求分类默认为一个的数据
    querySecondCategory(1);

    // 用一个函数将获取分类右侧数据的请求封装起来
    function querySecondCategory(id){
        $.ajax({
            url: ' /category/querySecondCategory',
            data: { id : id },
            success: function(obj){
                // console.log(obj);
                // 调用模版，生成分类,并显示到页面
                var html = template('querySecondCategoryTpl',obj);
                $('.category-right ul').html(html);
            }
        })
    }

})