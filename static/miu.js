var jquery = require('jquery')
var MiuSet = function () {}
MiuSet.prototype = {
  /**
   * 全局返回参数
   */
  Data: {
    // 登陆状态：
    // 0.未登录（默认）
    // 1.登陆
    IsLogin: 0,
    // MiuToken
    Token: '',
    // 高德地图Token
    MapTkn: '044b81192c73bcc31b455796d703fc18',
    // 订车状态
    Taxi: {
      // 滴滴订车状态
      DDStatus: {
        1: '等待接单',
        30: '已取消',
        35: '司机已接单',
        37: '司机已到达',
        39: '计费中',
        43: '待支付',
        45: '结算中',
        50: '等待付款/未全部支付',
        51: '已支付',
        54: '没有司机可发单',
        55: '没有司机接单',
        60: '重新改派',
        61: '另派订单没有司机',
        65: '订单过期',
        99: '订单失败未知异常',
        113: '下单失败',
        311: '订单超时',
        610: '行程异常结束'
      }
    },
    // 用户信息
    UserInfo: {},
    // API环境
    ApiURL: 'http://192.168.0.108',
    // 默认生产环境： ApiDATA[0]
    WeChat: 'http://192.168.0.108:8090',
    ApiDATA: [
      'http://wechat.miutrip.com:9991', /* 生产环境 */
      'http://192.168.0.108:100' /* 测试环境 */
    ],
    Store: 'http://192.168.0.108:8090/H5_Store',
    StoreDATA: [
      'http://wx.miutrip.com:8090/H5_Store',
      'http://192.168.0.108:8090/H5_Store'
    ]
  },
  /**
   * 设置页面title
   * @param {[string]} t [title内容]
   */
  SetTitle (t) {
    document.title = t
    var i = document.createElement('iframe')
    i.src = '//m.baidu.com/favicon.ico'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  },
  /**
   * 查看登录状态
   * 检测本地Token
   */
  LoginStatus: function () {
    if (window.localStorage.getItem('MIUTKN')) {
      this.Data.Token = JSON.parse(window.localStorage.getItem('MIUTKN')).authTkn
    } else {
      console.log('未登录')
    }
    if (window.localStorage.getItem('USERINFO')) {
      this.Data.UserInfo = JSON.parse(window.localStorage.getItem('USERINFO'))
      console.log('userinfo')
    }
  },
  /**
   * 登出
   * 清除所有本地状态
   */
  Logout: function () {
    window.localStorage.clear()
    this.IsLogin = 0
  },

  /**
   * 测试环境切换
   */
  TestStatus: function () {
    if (window.localStorage.getItem('isTest')) {
      this.Data.ApiURL = this.Data.ApiDATA[1]
      this.Data.Store = this.Data.StoreDATA[1]
    } else {
      this.Data.ApiURL = this.Data.ApiDATA[0]
      this.Data.Store = this.Data.StoreDATA[0]
    }
  },
  /**
   * 微信环境切换
   */
  WechatStatus: function () {
  },
  /**
   * 初始化
   */
  init: function () {
    this.TestStatus()
    this.LoginStatus()
   // this.getUserInfo()
    // this.getWechatSDK()
  },

  /**
   * 身份证验证
   */
  checkID: function (ID) {
    if (typeof ID !== 'string') {
      return '非法字符串'
    }
    var city = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    }
    var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2))
    var d = new Date(birthday)
    var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate())
    var currentTime = new Date().getTime()
    var time = d.getTime()
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    var sum = 0
    var i = 0
    var residue = 0
    if (!/^\d{17}(\d|x)$/i.test(ID)) { return '非法身份证' }
    if (city[ID.substr(0, 2)] === undefined) {
      return '非法地区'
    }
    if (time >= currentTime || birthday !== newBirthday) {
      return '非法生日'
    }
    for (i = 0; i < 17; i++) {
      sum += ID.substr(i, 1) * arrInt[i]
    }
    residue = arrCh[sum % 11]
    if (residue !== ID.substr(17, 1)) return '非法身份证'
    return 'pass'
  },
  /* json转URL */
  UrlFormat (json) {
    let s = ''
    let name
    let key
    for (let p in json) {
      if (!json[p]) {
        return null
      }
      if (json.hasOwnProperty[p]) {
        key = json[p]
        s += '&' + name + '=' + encodeURIComponent(key)
      }
      return s.substring(1, s.length)
    }
  },
  /* 去除首尾空格 */
  Trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },
  readBlobAsText (blob, callback) {
    var a = new window.FileReader()
    a.onload = function (e) { callback(e.target.result) }
    a.readAsText(blob)
  },
  /**
   * base64解码
   * @param {Object} str
   */
  base64decode (str) {
    var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1]
    var c1, c2, c3, c4
    var i = 0
    var len = str.length
    var out = ''
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c1 === -1)
      if (c1 === -1) {
        break
      }
      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c2 === -1)
      if (c2 === -1) {
        break
      }
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 === 61) {
          return out
        }
        c3 = base64DecodeChars[c3]
      }
      while (i < len && c3 === -1)
      if (c3 === -1) {
        break
      }
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))
      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 === 61) {
          return out
        }
        c4 = base64DecodeChars[c4]
      }
      while (i < len && c4 === -1)
      if (c4 === -1) {
        break
      }
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return out
  }
}
;(function ($) {
  var xExtend = {}
  xExtend.data = {
    apprData: {}
  }
  xExtend.fn = {
    getAppr: function () {
      return this.Data.apprData
    },
    setAppr: function (x) {
      if (typeof x === 'object') {
        this.Data.apprData = x
      } else {
        throw new Error('输入类型错误')
      }
    },
    getData: function (obj) {
      obj.type = obj.type || 'get'
      obj.data = obj.data || {}
      obj.successFn = obj.successFn || function (data) { console.log(data) }
      obj.errorFn = obj.errorFn || function () { console.log('Error') }
      $.ajax({
        url: obj.url,
        data: obj.data,
        type: obj.type,
        success: function (data) {
         /* if (false) {
            obj.self.showA = true
          } else {
            obj.successFn()
          }*/
          obj.successFn(data)
        },
        error: function () {
          obj.errorFn()
        }

      })
    },
    dateFormat: function (date) { // date格式转换为 yy-MM-dd hh:mm
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      var minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute
    }
  }
  $.extend(MiuSet.prototype.Data, xExtend.data)
  $.extend(MiuSet.prototype, xExtend.fn)
})(jquery)

/* 时间格式化 */
window.Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/* 重组 */
window.Array.prototype.unique = function () {
  this.sort()
  var res = [this[0]]
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== res[res.length - 1]) {
      res.push(this[i])
    }
  }
  return res
}
/* 去重复 */
window.Array.prototype.removeRepeatAttr = function () {
  var tmp = {}
  var a = this.slice()
  for (var i, j = 0; i < a.length; i++) {
    if (!tmp[a[i].id]) {
      tmp[a[i].id] = !0
      j++
    } else {
      this.splice(j, 1)
    }
  }
}
window.Miu = new MiuSet()
window.Miu.init()
