// ==UserScript==
// @name         zzuwlan-auto-auth
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description   zzuwlan 自动认证
// @author       dangge
// @match        http://202.196.64.132/*
// @match        http://202.196.64.6/*
// @match        https://edu3.v.zzu.edu.cn/*
// @match        https://edu.v.zzu.edu.cn/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @homepageURL       https://github.com/dangger/zzuwlan-auto-auth
// @supportURL        https://github.com/dangger/zzuwlan-auto-auth/issues
// ==/UserScript==

//首页面跳转
function jump(){
    var host = window.location.host;
    //北区
   if(host=="202.196.64.132" && document.title=="郑州大学统一身份认证平台")
    {
        window.location.href="http://202.196.64.132:8080/";
    }

    //新区
    else if(host=="202.196.64.6" && document.title=="郑州大学统一身份认证平台")
    {
        window.location.href="http://202.196.64.6:8080/";
    }
}
//cookie框架
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

//检测是否写入了账号和密码
function checkCookies(){
    if(docCookies.hasItem('username') || docCookies.hasItem('password')){
        console.log(docCookies.getItem('username'));
        console.log(docCookies.getItem('password'));
    }
    else{
        username=prompt('输入学号:',"")
        password=prompt('输入密码:',"")
        docCookies.setItem("username", username, 3153600)
        docCookies.setItem("password", password, 3153600)
    }
}

//清除 cookies
function delCookies(){
    docCookies.removeItem("username");
    docCookies.removeItem("password");
}
function error(){
var error =document.getElementById("mt_5").innerHTML;
var left = error.indexOf("登录失败，原因是：");
var right = error.indexOf("。");
error = error.substring(left,right);
if(error=="登录失败，原因是：未检索到你输入的账号，或密码错误"){
    alert("检查下是不是账号密码打错了！");
    delCookies();
    window.location.href="http://www.163.com";
}
//欠费这个暂时没法测，等我欠费了再说
}
//ocr 页面的验证码然后吐出来用
function ocr(){
        var image = document.querySelector("#myimg6");
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        var numbers = [                           //模板,依次是0-9十个数字对应的明暗值字符串
            "0",
            "0",
            "1100001111100000011110011000110011110011111111001111111001111111001111111001111111001111111001111111000000001100000000011111111111111111111111111111111111111111",
            "1100001111000000011100111100111111110011111110001111000001111100000111111110001111111100111111110011000000011110000011111111111111111111111111111111111111111111",
            "1111000111111100011111100001111111100111110010011110011001110011100111000000001100000000111111100111111000001111100000011111111111111111111111111111111111111111",
            "0000000011100000111110011111111001111111100000111110000001111001100011111111001111111100110011100011000000011110000011111111111111111111111111111111111111111111",
            "1111000011110000001110001111111001111111000000111100000001110001100011001111001100111100111001100011100000011111000011111111111111111111111111111111111111111111",
            "0000000011000000001100111000111111100011111110011111111001111111000111111100111111110011111110001111111001111111100111111111111111111111111111111111111111111111",
            "0100001111100110011100111100110011110011000110001110000001111000000111001111001100111100110011110011100000011111000011111111111111111111111111111111111111111111",
            "1100001111110000011100011000110011110011001111001100011000111000000011110000001111111001111111000111000000111100001111111111111111111111111111111111111111111111",
            "1111111111111111111111111111111100000111100000001111111100111100000011000000001100011100110011100011000000000110000100011111111111111111111111111111111111111111",
            "0011111111001111111100111111110010000111000000001100011100010011111001001111100100111110010001110001000000001100100001111111111111111111111111111111111111111111",
            "1111111111111111111111111111111100000011100000000100011110010011111001001111111100111111110001111001100000000111100000111111111111111111111111111111111111111111",
            "1111110001111111000111111110011100001001100000000100011100010011111001001111100100111110010001110000100000000011000010001111111111111111111111111111111111111111",
            "1111111111111111111111111111111100000111000000001100111110010000000000000000000100111111110001111001100000000111000000111111111111111111111111111111111111111111",
            "1110000001100000000111001111110000000011000000001111001111111100111111110011111111001111111000111111000000001100000000111111111111111111111111111111111111111111",
            "1111111111111111111111111111111100001000100000000100011100010011111001001111100100111110010001110001100000000111000010011111111001111111100111000000111100000111",
            "0001111111000111111110011111111001000011100000000110001110011001111001100111100110011110011001111001000011000000001100001111111111111111111111111111111111111111",
            "1111001111111100111111111111111000001111100000111111110011111111001111111100111111110011111111001111100000000110000000011111111111111111111111111111111111111111",
            "1111001111111100111111111111110000000111000000011111111001111111100111111110011111111001111111100111111110011111111001111111100111111110011100000011110000001111",
            "0001111111000111111100011111111001100001100110000110010011111000011111100001111110010011111001100111000111000000011100001111111111111111111111111111111111111111",
            "0",
            "1111111111111111111111111111110000110001000000000000110010000011001100001100110000110011000011001100000100010000010001001111111111111111111111111111111111111111",
            "1111111111111111111111111111110001000011000000000110001110011000111001100111100110001110010001111001000011000000000100001111111111111111111111111111111111111111",
            "0",
            "1111111111111111111111111111110010000111000000000100011100010011111001001111100100111110010001110001000000001100100001110011111111001111111100001111110000111111",
            "1111111111111111111111111111111100001000100000000000011100010011111001001111100100111110010001111001100000000111000010011111111001111111100111111000001111100000",
            "1111111111111111111111111111110000100011000000000111000110011100111111110011111111001111111100111111000000001100000000111111111111111111111111111111111111111111",
            "1111111111111111111111111111111110000001100000000110011110011000011111110000001111111000010001111001100000000110000001111111111111111111111111111111111111111111",
            "1100111111110011111111001111110000000011000000001111001111111100111111110011111111001111111100110001110000000111100001111111111111111111111111111111111111111111",
            "1111111111111111111111111111110001110001000111000110011110011001111001100111100110011110011001110001100000000011001110001111111111111111111111111111111111111111",
            "1111111111111111111111111111110000110000000111000000111110011001110011100111001111001001111100100111111000111111100011111111111111111111111111111111111111111111",
            "1111111111111111111111111111110001110000000111000000111110010011111001001000100110001000111000100011100111001110011100111111111111111111111111111111111111111111",
            "1111111111111111111111111111110000110000000011000011001100111110001111111100111111100001111100110011000011000000001100001111111111111111111111111111111111111111",
            "1111111111111111111111111111110001110000000111000000111110011001111001100111001111001001111100100011110000011111100011111110001111111001111100000001110000000111",
            "1111111111111111111111111111111000000001100000000110001100111111100111111100011111100111111000111001100000000110000000011111111111111111111111111111111111111111"
        ];
        var captcha = "";                         //存放识别后的验证码
        canvas.width = image.width;
        canvas.height = image.height;
        document.body.appendChild(canvas);
        ctx.drawImage(image, 0, 0);
        for (var i = 0; i < 4; i++) {
            var pixels = ctx.getImageData(14 * i + 4, 5, 10, 16).data;
            var ldString = "";
            for (var j = 0,length = pixels.length; j < length; j += 4) {
                ldString = ldString + (+(pixels[j] * 0.3 + pixels[j + 1] * 0.59 + pixels[j + 2] * 0.11 >= 140));
            }
            var comms = numbers.map(function (value) {                      //为了100%识别率,这里不能直接判断是否和模板字符串相等,因为可能有个别0被计算成1,或者相反
                return ldString.split("").filter(function (v, index) {
                    return value[index] === v;
                }).length;
            });
            captcha += comms.indexOf(Math.max.apply(null, comms))<=9?comms.indexOf(Math.max.apply(null, comms)):String.fromCharCode(comms.indexOf(Math.max.apply(null, comms))+87);          //添加到识别好的验证码中
        }
    document.querySelector("input[name=ver6]").value = captcha;
}
//欢迎界面和 cookies 清除按钮
function welcome(){
    console.log("认证完毕");
}


//init
(function(){
    jump();

    var host = window.location.host;
    if(host=="202.196.64.132:8080"||host=="202.196.64.6:8080"){
        checkCookies();
 function ready(fin) {
    if (document.readyState != 'loading'){
      fin();
    } else {
      document.addEventListener('DOMContentLoaded', fin);
    }
  }
  ready(function() {
    document.querySelector("#myimg6").onload = function(e){
      e.stopPropagation();
      ocr();
    };
  });
    document.querySelector("input[name=uid]").value = docCookies.getItem('username');
    document.querySelector("input[name=upw]").value = docCookies.getItem('password');
    setTimeout(function(){ document.getElementsByName("smbtn")[0].click(); }, 3000);
}
    error();
    zzjGotoWlan();
    welcome();
})();
