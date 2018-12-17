// 这是搜索页的逻辑
$(function(){

    /*
    需求：
    1、点击搜索按钮：将搜索的关键字用数组arr保存,转为json存到localStorage本地存储中，键为historyList
        1.1 进行非空判断（trim()去掉首尾空格），为空就弹出提示框；
            不为空就unshift到数组中（添加到第一个），存到localStorage
        1.2 清空搜索框
        1.3 取出localStorage，遍历数组，利用模版渲染到页面
    2、点击叉叉按钮：删除对应的历史记录
        2.1 给每个叉叉添加自定义属性data-index，将下标存进去
        2.2 删除数组arr中对应下标的元素，再存到localStorage中，重新渲染到页面
    3、点击清空记录：将本地存储这个historyList键用remove删除，重新渲染页面
    */

    

    //1、给搜索按钮注册点击事件  移动端点击事件用zepto里面封装好的tap事件
    $('.btn-search').on('tap',function(){
        // 获取搜索框
        var search = $('.input-search'); 
        //进行非空判断  search.trim() === ''  trim()去掉首尾空格
        if(!search.val().trim()){
            alert('输入内容不能为空，请重新输入商品！');
            return;
        }
        //将本地存储的值取出来
        var arr = JSON.parse(localStorage.getItem('historyList')) || [];
        //判断搜索内容在数组中是否存在
        if(arr.indexOf(search.val()) != -1){ //说明存在
            // 删除这个相同的元素
            arr.splice(arr.indexOf(search.val()),1);
        }
        //加到数组前面
        arr.unshift(search.val());
        // 将数组加到本地存储
        localStorage.setItem('historyList',JSON.stringify(arr));

        queryHistoryList();

        // 跳转到商品列表页面
        location = 'productlist.html?search='+search.val();

        //清空搜索框
        search.val('');
    })

    queryHistoryList();

    //封装一个函数查询本地存储，渲染到页面
    function queryHistoryList(){
        //将本地存储的值取出来
        var arr = JSON.parse(localStorage.getItem('historyList')) || [];
        // 调用模版引擎将arr数据到页面显示
        var html = template('historyTpl',{ data : arr });
        $('.search-history ul').html(html);
    }

    //2、给叉叉按钮注册点击事件，因为叉叉是动态生成的，要父元素注册事件委托
    $('.historyData').on('tap','.historyDel',function(){
        //取出叉叉的自定义属性存储的下标值
        var index = $(this).data('index');
        //取出本地存储historyList数组
        var arr = JSON.parse(localStorage.getItem('historyList'));
        // 删除叉叉对应的内容，也就是数组中的元素
        arr.splice(index,1);
        //重新加到本地存储
        localStorage.setItem('historyList',JSON.stringify(arr));
        //渲染到页面
        queryHistoryList();
    })

    //3、给清空记录注册点击事件
    $('.btn-clear').on('tap',function(){
        //删除本地存储historyList
        localStorage.removeItem('historyList');
        queryHistoryList();
    })






})