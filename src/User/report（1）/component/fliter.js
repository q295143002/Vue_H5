/**
 * Created by gxia on 2016/8/5.
 */
Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
