import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'

Vue.use(Router)
const router = new Router({
  transitionOnLoad: true
})
const max = require('./router/max.js')
max.mapRoute(router)

const weiliyan = require('./router/weiliyan.js')
weiliyan.mapRoute(router)

router.afterEach(function (transition) {
  console.log(window.history.state)
  router.app.loadList = []
  router.app.Loading(false)
  if (transition.to.name) {
    window.Miu.SetTitle(transition.to.name)
  }
  console.log('成功浏览到: ' + transition.to.path)
})
router.start(App, '#app')
