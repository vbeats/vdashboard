# vdashboard

## token验证

`localStorage`存储: `user` `access_token` `refresh_token`

依赖 `store.js` 控制 `access_token`:`7200s` 与 `refresh_token`:`2d`的过期时间

每5分钟校验一次`access_token`过期时间, 如果过期了靠`refresh_token`获取新token

初次访问时, `localStorage`中已存在的`access_token`或`refresh_token`, 直接复用: `refresh_token`过期时间至少要>`4h`

## axios

`拦截器`: 请求头添加`token`:`access_token`

响应拦截响应码: `401`: `认证失败` --> 重新登录认证
