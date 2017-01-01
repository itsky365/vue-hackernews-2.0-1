import { app, router, store } from './app'

const isDev = process.env.NODE_ENV !== 'production'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
// 这个导出函数叫 bundleRenderer，是我们在实际的 render 之前执行数据预取来确定我们应用程序的状态的。
// 因为数据的获取是异步的，所以这个函数将返回解决 vue 实例的 Promise 对象。
// 对于该入口导出函数的配置，在 vue-server-renderer 的 npm 包中有说明
// 地址：https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle
export default context => {
  const s = isDev && Date.now()

  // set router's location
  router.push(context.url)
  //返回目标位置或是当前路由匹配的组件数组（是数组的定义/构造类，不是实例）。通常在服务端渲染的数据预加载时时候。
  const matchedComponents = router.getMatchedComponents()

  // no matched routes
  // 没有匹配到路由，返回一个包含 404 的 Promise 对象
  if (!matchedComponents.length) {
    return Promise.reject({ code: '404' })
  }

  // Call preFetch hooks on components matched by the route.
  // A preFetch hook dispatches a store action and returns a Promise,
  // which is resolved when the action is complete and store state has been
  // updated.
  // 通过匹配路由来调用预存取得钩子组件
  // 每个预存取得钩子组件都会派发一个 store action 并且返回一个 action 已经完成并且 store 里面的 state 已经更新的 Promise 对象，

  return Promise.all(matchedComponents.map(component => {
    if (component.preFetch) {
      return component.preFetch(store)
    }
  })).then(() => {
    isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
    // After all preFetch hooks are resolved, our store is now
    // filled with the state needed to render the app.
    // Expose the state on the render context, and let the request handler
    // inline the state in the HTML response. This allows the client-side
    // store to pick-up the server-side state without having to duplicate
    // the initial data fetching on the client.
    context.initialState = store.state
    return app
  })
}
