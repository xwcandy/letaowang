// 使用的是zepto的js库
$(function(){

    // 初始化轮播图
    mui('#slide').slider({
        interval: 5000
    });

    // 初始化内容滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false, //是否显示滚动条
    });

})