import Vue from 'vue'
import Resource from 'vue-resource'
Vue.use(Resource)
/* resource默认设置 */
Vue.http.interceptors.push(function (request, next) {
  /* 超时设置 */
  if (!request._timeout) {
    request._timeout = 90000
  }
  var timeout
  if (request._timeout) {
    timeout = setTimeout(() => {
      next(request.respondWith(request.body, {
        status: 408,
        statusText: 'Request Timeout'
      }))
    }, request._timeout)
  }
  let Dis = request.DisableLoading
  let RootComp = this.$root
  /* Loading动画设置 */
  if (!request.DisableLoading) {
    RootComp.Loading(true)
  }
  next((response) => {
    if (!Dis) {
      if (this.$root !== null) {
        RootComp.Loading(false)
      }
    }
    clearTimeout(timeout)
    if (response.data) {
      if (typeof response.data.errorMessage !== 'undefined' && typeof response.data.errorCode !== 'undefined') {
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          return response
        } else {
          response.ok = false
          response.status = 411
          response.statusText = 'serverError'
          return response
        }
      }
    }
    switch (response.status) {
      case 808: window.alert('网络受限无法访问')
        break
      case 500: window.alert('内部错误')
        break
      case 503: window.alert('您无权访问该业务')
        break
      case 400: window.alert('请求参数格式错误')
        break
      case 406: window.alert('该用户不存在')
        break
      case 408: window.alert('请求超时，请重试')
        break
      case 0: window.alert('网络访问失败，请检查网络状态')
        break
    }
  })
})
