# vdashboard

[后端接口参考](https://github.com/vbeats/vboot)

- vue3
- vue-router@4 vuex@4 vue-i18n-next antV@2

## crypto

`utils`包下`crypto.ts` `encrypt`RSA非对称加密 公钥加密 需要替换

## token验证

`localStorage`存储: `user` `access_token` `refresh_token`

依赖 `store.js` 控制 `access_token`:`7200s` 与 `refresh_token`:`20d`的过期时间

每5分钟校验一次`access_token`过期时间, 如果过期了靠`refresh_token`获取新token

初次访问时, `localStorage`中已存在的`access_token`或`refresh_token`, 直接复用

具体逻辑查看: `router`路由拦截处理 与 `layouts`下相关组件 `checkToken`方法

## ~~store.js~~

`expire`插件 set/getExpiration: 毫秒时间戳

后期替换掉

## axios

`拦截器`: 请求头添加`token`:`access_token`

响应拦截响应码: `401`: `认证失败` --> 重新登录认证

## 国际化

`简体中文`: `zh-CN`

`英文`: `en-US`

使用: `setup`中 `userI18n`

## 布局

`layout`: 导航菜单已适配屏幕 可以自动展开收起

## todo

- [ ] tailwindcss
- [ ] menu菜单改造

## Demo

<table>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/1.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/2.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/3.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/4.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/5.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/6.png"></td>
    </tr>
</table>