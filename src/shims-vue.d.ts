/* eslint-disable */
declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.png'
declare module '*.svg'

// 百度地图
declare const BMapGL: any
declare const BMapGLLib: any
declare const BMAP_DRAWING_MARKER: any
declare const BMAP_DRAWING_POLYLINE: any
declare const BMAP_DRAWING_RECTANGLE: any
declare const BMAP_DRAWING_POLYGON: any
declare const BMAP_DRAWING_CIRCLE: any

// 高德地图
declare const AMap: any
declare const AMapUI: any
declare const PathSimplifier: any
