# zzuwlan-auto-auth
zzuwlan自动认证，需要油猴脚本  
~~第一个版本只是能用而已，写的一坨翔，重构 ing...~~  
重构完毕，增加手动输入账号密码并保存，错误检测等功能。  
用法：  
1.使用现代化浏览器，[点击安装tampermonkey](http://tampermonkey.net/)。  
2.[点击这里安装脚本](https://raw.githubusercontent.com/dangger/zzuwlan-auto-auth/master/zzuwlan-auto-auth.user.js)  
3.enjoy it！  
### 注意事项
安装成功后，需要认证时会自动完成认证流程。  
但第一次需要手动输入一次账号密码以保存 cookies 。  
保存的 cookies 有效期为一年，更改密码会导致认证错误并清除 cookies，重新输入一次正确的账号密码即可。