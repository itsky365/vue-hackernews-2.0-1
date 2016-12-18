import ItemList from '../components/ItemList.vue'

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.

// 这是一个动态创建根级别的 list views 的工厂函数，因为list views 共享了大部分的逻辑除了显示的项目类型。
// 从本质上说，它们是一个包装了 ItemList.vue 的高阶组件
export function createListView (type) {
  return {
    name: `${type}-stories-view`,
    // this will be called during SSR to pre-fetch data into the store!
    // 下面是在服务端渲染时从 store 中预取数据。
    preFetch (store) {
      return store.dispatch('FETCH_LIST_DATA', { type })
    },
    render (h) {
      return h(ItemList, { props: { type }})
    }
  }
}
