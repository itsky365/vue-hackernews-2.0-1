// 这里使用了一个新东西 firebase ,一种实时性云数据库
// 推荐阅读： http://blog.csdn.net/u013400743/article/details/52346593
// 还有第二篇： http://blog.csdn.net/u013400743/article/details/52352930
// npm 官方介绍：https://www.npmjs.com/package/firebase

import Firebase from 'firebase/app'
import 'firebase/database'

const config = {
  databaseURL: 'https://hacker-news.firebaseio.com'
}
const version = '/v0'

Firebase.initializeApp(config)
const api = Firebase.database().ref(version)
export default api
