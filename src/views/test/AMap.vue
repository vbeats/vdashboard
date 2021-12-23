<template>
  <div id="container"></div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
//just some colors
const colors = [
  '#3366cc',
  '#dc3912',
  '#ff9900',
  '#109618',
  '#990099',
  '#0099c6',
  '#dd4477',
  '#66aa00',
  '#b82e2e',
  '#316395',
  '#994499',
  '#22aa99',
  '#aaaa11',
  '#6633cc',
  '#e67300',
  '#8b0707',
  '#651067',
  '#329262',
  '#5574a6',
  '#3b3eac',
]

onMounted(() => {
  //创建地图
  // eslint-disable-next-line no-undef
  const map = new AMap.Map('container', {
    zoom: 5,
    //center:[120.34294,23.992865]
  })

  // eslint-disable-next-line no-undef
  AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier: any, $: any) => {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！')
      return
    }
    init(map, PathSimplifier, $)
  })
})

const init = (map: any, PathSimplifier: any, $: any) => {
  const pathSimplifier = new PathSimplifier({
    //autoSetFitView:false,
    map: map, //所属的地图实例

    getPath: (pathData: any, pathIndex: any) => {
      return pathData.path
    },
    getHoverTitle: (pathData: any, pathIndex: any, pointIndex: any) => {
      if (pointIndex >= 0) {
        //point
        return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length
      }

      return pathData.name + '，点数量' + pathData.path.length
    },
    renderOptions: {
      renderAllPointsIfNumberBelow: 200,
      pathTolerance: 1,
      keyPointTolerance: 10,
      keyPointStyle: {
        fillStyle: '#ccc',
        radius: 1,
        lineWidth: 1,
      },
      startPointStyle: null,
      endPointStyle: null,
      pathLineHoverStyle: {
        strokeStyle: '#000000',
      },
      pathLineSelectedStyle: {
        dirArrowStyle: null,
        strokeStyle: '#000000',
        borderStyle: 'orange',
        borderWidth: 2,
      },
      getPathStyle: (pathItem: any, zoom: any) => {
        const color = colors[pathItem.pathIndex % colors.length],
          lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3))

        return {
          pathLineStyle: {
            strokeStyle: color,
            lineWidth: lineWidth,
          },
          pathLineSelectedStyle: {
            lineWidth: lineWidth + 2,
          },
          pathNavigatorStyle: {
            fillStyle: color,
          },
        }
      },
    },
  })
  ;(window as any).pathSimplifierIns = pathSimplifier

  $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body)

  $.getJSON('https://a.amap.com/amap-ui/static/data/prov-borders.json', (d: any) => {
    $('#loadingTip').remove()
    pathSimplifier.setData(d)
  })

  pathSimplifier.on('selectedPathIndexChanged', (e: any, info: any) => {
    // console.log(e,info)
  })

  pathSimplifier.on('pointClick pointMouseover pointMouseout', (e: any, record: any) => {
    //console.log(e.type, record);
  })

  pathSimplifier.on('pathClick pathMouseover pathMouseout', (e: any, record: any) => {
    //console.log(e.type, record);
  })
}
</script>

<style scoped lang="stylus">
html, body, #container
  width 100%
  height 100%
  margin 0

#loadingTip
  position absolute
  z-index 9999
  top 0
  left 0
  padding 3px 10px
  background red
  color #fff
  font-size 14px
</style>
