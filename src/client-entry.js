// ????？
import 'es6-promise/auto'

// 引入了一个 Vue 实例，该实例已经包含了 vuex 和 router 等基本信息，但是这个实例还没有
// 被添加装载，因为无论是客户端渲染还是服务端渲染都需要一个基本的实例，只不过不同的
// 渲染方式装载的方式不同而已。为了公用该实例，所以单独抽离出去。不信，你可以去 server-entry.js
// 中去看看是不是也引用这个 Vue 实例了，并且装载了。
import { app, store } from './app'

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
// 服务端初始化 state 来添加到主要的 store上。
// 这个 state 在服务端初始化并且内嵌到返回的页面时确定下来的。
//
// 再说的直白点就是：客户端渲染的时候 上面引入的 vue 实例（已包括 Vuex 和 router 信息）
// 在服务端被创建并且初始化了，然后就将这个 vue 实例装载到页面上，下面 app.$mount('#app')就是在干这个事。
// 但是客户端来渲染的时候需要把 state 内的状态内嵌到客户端的全局变量上。
//
store.replaceState(window.__INITIAL_STATE__)

// actually mount to DOM
// 实际装载到 DOM 上
app.$mount('#app')

// service worker
// 目前它首先要具备的功能是拦截和处理网络请求，包括可编程的响应缓存管理。
// 推荐阅读： https://www.w3ctech.com/topic/866
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}
