<template>
  <ul class="drawing-panel">
    <li class="bmap-btn bmap-marker" id="marker" @click="draw"></li>
    <li class="bmap-btn bmap-polyline" id="polyline" @click="draw"></li>
    <li class="bmap-btn bmap-rectangle" id="rectangle" @click="draw"></li>
    <li class="bmap-btn bmap-polygon" id="polygon" @click="draw"></li>
    <li class="bmap-btn bmap-circle" id="circle" @click="draw"></li>
  </ul>
  <div id="container"></div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'

let drawingManager: any = undefined // drawing manager

onMounted(() => {
  //加载地图
  // eslint-disable-next-line no-undef
  const map = new BMapGL.Map('container', {enableMapClick: false}) // 创建Map实例,GL版命名空间为BMapGL(鼠标右键控制倾斜角度)
  // eslint-disable-next-line no-undef
  map.centerAndZoom(new BMapGL.Point(117.030927, 36.674522), 12) // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

  const styleOptions = {
    strokeColor: '#5E87DB', // 边线颜色
    fillColor: '#5E87DB', // 填充颜色。当参数为空时，圆形没有填充颜色
    strokeWeight: 2, // 边线宽度，以像素为单位
    strokeOpacity: 1, // 边线透明度，取值范围0-1
    fillOpacity: 0.2, // 填充透明度，取值范围0-1
  }
  const labelOptions = {
    borderRadius: '2px',
    background: '#FFFBCC',
    border: '1px solid #E1E1E1',
    color: '#703A04',
    fontSize: '12px',
    letterSpacing: '0',
    padding: '5px',
  }

  // 实例化鼠标绘制工具
  // eslint-disable-next-line no-undef
  drawingManager = new BMapGLLib.DrawingManager(map, {
    // isOpen: true,        // 是否开启绘制模式
    enableCalculate: false, // 绘制是否进行测距测面
    enableSorption: true, // 是否开启边界吸附功能
    sorptiondistance: 20, // 边界吸附距离
    circleOptions: styleOptions, // 圆的样式
    polylineOptions: styleOptions, // 线的样式
    polygonOptions: styleOptions, // 多边形的样式
    rectangleOptions: styleOptions, // 矩形的样式
    labelOptions: labelOptions, // label样式
  })
})

// 鼠标绘图事件
const draw = (e: any) => {
  const arr = document.getElementsByClassName('bmap-btn')
  for (let i = 0; i < arr.length; i++) {
    ;(arr[i] as HTMLElement).style.backgroundPositionY = '0'
  }

  e.target.style.backgroundPositionY = '-52px'
  let drawingType = ''
  switch (e.target.id) {
    case 'marker': {
      // eslint-disable-next-line no-undef
      drawingType = BMAP_DRAWING_MARKER
      break
    }
    case 'polyline': {
      // eslint-disable-next-line no-undef
      drawingType = BMAP_DRAWING_POLYLINE
      break
    }
    case 'rectangle': {
      // eslint-disable-next-line no-undef
      drawingType = BMAP_DRAWING_RECTANGLE
      break
    }
    case 'polygon': {
      // eslint-disable-next-line no-undef
      drawingType = BMAP_DRAWING_POLYGON
      break
    }
    case 'circle': {
      // eslint-disable-next-line no-undef
      drawingType = BMAP_DRAWING_CIRCLE
      break
    }
  }
  // 进行绘制
  if (drawingManager._isOpen && drawingManager.getDrawingMode() === drawingType) {
    drawingManager.close()
  } else {
    drawingManager.setDrawingMode(drawingType)
    drawingManager.open()
  }
}
</script>

<style scoped lang="stylus">
body,html,#container
  width 100%
  height 100%
  overflow hidden
  margin 0
  font-family "微软雅黑"

ul li
  list-style none

.info
  z-index 999
  width auto
  min-width 22rem
  padding 0.75rem 1.25rem
  margin-left 1.25rem
  position fixed
  top 1rem
  background-color #fff
  border-radius 0.25rem
  font-size 14px
  color #666
  box-shadow 0 2px 6px 0 rgba(27, 142, 236, 0.5)


.drawing-panel
  z-index 999
  position fixed
  top 10rem
  right 3rem
  padding-left 0
  border-radius 0.25rem
  height 47px
  box-shadow 0 2px 6px 0 rgba(27, 142, 236, 0.5)

.bmap-btn
  border-right 1px solid #d2d2d2
  float left
  width 64px
  height 100%
  background-image url(//api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png)
  cursor pointer


.drawing-panel .bmap-marker
  background-position -65px 0

.drawing-panel .bmap-polyline
  background-position: -195px 0

.drawing-panel .bmap-rectangle
  background-position: -325px 0

.drawing-panel .bmap-polygon
  background-position -260px 0

.drawing-panel .bmap-circle
  background-position: -130px 0
</style>
