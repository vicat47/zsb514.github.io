const log = console.log.bind(console);

/**
 * Ajax的启动方法.
 * @param {*} RequestUrl 请求的URL链接,统一写为根目录
 * @param {*} data 请求的数据,以JSON对象的形式传入
 * @param {*} LoadingFun 读取时函数
 * @param {*} ReturnFun 回调函数,成功时执行
 */
const AjaxPost = function (RequestUrl, JsonData, LoadingFun, ReturnFun) {
	$.ajax({
        type: "post",
        url: RequestUrl,
        data: JsonData,
        dataType: 'json',
        async: 'true',
        beforeSend: LoadingFun,
        //error: function () { AjaxErro({ "Status": "Erro", "Erro": "500" }); },
        success: ReturnFun
    });
};
/**
 * 此方法是缩放图片大小的方法
 * @param {*} images 传入要修改的图片
 * @param {*} width 传入要修改的图片宽
 * @param {*} height 传入要修改的图片高
 */
const imgSizeChangerBind = function (images, width, height) {
    images.bind("load", function () {
        let image = $(this)
        if (image.width() > image.height()){
            if(image.width()>width){
              image.width(width);
              image.height(width/image.width()*image.height());
            }
        }else{
            if(image.height()>height){
                image.height(height);
                image.width(height/image.height()*image.width());
            }
        }
    })
}

/**
 * 此函数是获取存入的cookie,通过unescape解密
 * @param {string} name 
 * @return 搜索成功返回cookie的值,搜索失败返回null
 */
const getCookie = function (name) {
    name = escape(name);
    //读cookie属性，这将返回文档的所有cookie     
    let allCookies = document.cookie;
    //查找名为name的cookie的开始位置     
    name += "=";
    let pos = allCookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值     
    if (pos !== -1) {    //如果pos值为-1则说明搜索"version="失败
        let start = pos + name.length;   //cookie值开始的位置     
        let end = allCookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置     
        if (end === -1) end = allCookies.length; //如果end值为-1说明cookie列表里只有一个cookie
        let value = allCookies.substring(start, end);  //提取cookie的值     
        return unescape(value);       //对它解码
    }
    else return null;    //搜索失败，返回null 
};

/**
 * @param {string} name 传入的cookie名
 * @param {string} value 传入的cookie值,会调用escape进行转换
 * @param {number} hours 传入的时间名,hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,
 * @param {string} path 传入的cookie路径
 * 这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。
 */
const setCookie = function (name, value, hours, path) {
    name = escape(name);
    value = escape(value);
    let expires = new Date();
    expires.setTime(expires.getTime() + hours * 3600000);
    path = path === "" ? "" : ";path=" + path;
    let _expires = (typeof hours) === "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
};
/**
 * 强制保留两位小数的方法
 */
const toDecimal2 = function (x) { 
    let f = parseFloat(x);
    if (isNaN(f)) { 
      return false; 
    } 
    f = Math.round(x*100)/100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) { 
      rs = s.length; 
      s += '.'; 
    } 
    while (s.length <= rs + 2) { 
      s += '0'; 
    } 
    return s; 
 };