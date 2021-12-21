# vdashboard

[后端接口参考](https://github.com/vbeats/vcloud)

- `vue3` `typescript` `vuex` `i18n` `ant-design-vue` `webpack`
- `dev`模式下为了加快编译速度 未做`chunk`分割
- `webpack`仅在`build production`时优化资源大小 详见`vue.config.js`配置
- `vue.config.js`默认开启`cdn`, 不需要的可以自行去掉 & 处理好相关资源依赖

### run

```bash
yarn install

yarn serve 

yarn build
```

### next plan

- [ ] 大量object属性深拷贝不优雅
- [ ] 整合map示例, 图表示例

### FAQ

1. 页面初次渲染时 `localStorage`中`user`加载到`store` 见: `bootstrap.ts`
2. `authUtil.ts`包含定时任务 , 定时检查&刷新`token`
3. `routerAuth.ts`:路由守卫
4. `route` `meta`: 包含`title` `breads` `actions`

### Contact

![battery_wx](https://cdn.jsdelivr.net/gh/boot-vue/pics@main/wechat.jpg)

### demo

<table>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/1.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/10.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/42.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/43.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/44.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/45.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/46.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/48.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/2.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/9.png"></td>
    </tr>
    <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/49.png"></td>
        <td><img src="https://cdn.jsdelivr.net/gh/boot-vue/pics@main/vdashboard/next/12.png"></td>
    </tr>
</table>

