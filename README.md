# vdashboard

Sponsor [![paypal.me/bootvue](https://cdn.jsdelivr.net/gh/boot-vue/pics@main/icon/paypal.svg)](https://www.paypal.me/bootvue)
☕☕☕

[后端接口参考](https://github.com/vbeats/vboot)

- vue3
- vue-router@4 vuex@4 vue-i18n-next antV@2

## FAQ

- `vite build`打包, router中动态路由引入的方式要改, `import.meta.global`

## crypto

`utils`包下`crypto.ts` `encrypt`RSA非对称加密 公钥加密

## token验证

`localStorage`存储: `user` `access_token` `refresh_token`

依赖 `@vbeats/vstore` 控制 `access_token`:`7200s` 与 `refresh_token`:`180d`的过期时间

`expire`字段: `refresh_token`有效时长(秒)

每5分钟校验一次`access_token`过期时间, 如果过期了靠`refresh_token`获取新token

初次访问时, `localStorage`中已存在的`access_token`或`refresh_token`(未过期), (看具体业务情况 可以直接复用)

具体逻辑查看: `router`路由拦截处理 与 `layouts`下相关组件 `checkToken`方法

## ~~store.js~~

已经替换为`@vbeats/vstore`

## axios

`拦截器`: 请求头添加`token`:`access_token`

响应拦截响应码: `401`: `认证失败` --> 重新登录认证

## 国际化

`简体中文`: `zh-CN`

`英文`: `en-US`

使用: `setup`中 `userI18n`

## 布局

`layout`: 导航菜单已适配屏幕 可以自动展开收起

## 菜单权限

## 菜单权限

> 一个用户只能属于一个role, 我定的, 咋的了

> permissions 字段格式 ["按钮:add,list,update,delete"]或["list"] (菜单是否可以查看),`util`包下有`permsUtil`工具类处理权限字段

> 按钮非特指, 对应前端当前页面下同类型的所有按钮, 需要前后端约定好

- 二级菜单 父一级 `permissions` ["list"]或者没有, 对应 `role_menu_action actions`字段, 0(有查看权限)/-1(没有查看权限)

```json
{
  "menus": [
    {
      "key": "index",
      "icon": "HomeOutlined",
      "title": "首页",
      "default_select": true,
      "default_open": false,
      "permissions": [
        "index:list"
      ]
    },
    {
      "key": "setting",
      "icon": "SettingOutlined",
      "title": "系统设置",
      "default_select": false,
      "default_open": true,
      "permissions": [
        "list"
      ],
      "children": [
        {
          "key": "login",
          "title": "用户管理",
          "default_select": false,
          "default_open": false,
          "permissions": [
            "role:update,list",
            "login:add,update,list,delete"
          ]
        },
        {
          "key": "role",
          "title": "角色管理",
          "default_select": false,
          "default_open": false,
          "permissions": [
            "action:update,list",
            "role:add,update,list,delete"
          ]
        }
      ]
    }
  ]
}
```

## Demo

<table>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/1.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/2.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/11.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/22.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/33.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/44.png"></td>
    </tr>
</table>