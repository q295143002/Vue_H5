export const PinYin = function () {
  return new RegExp('^([\u4e00-\u9fa5]{2,})|([\u4e00-\u9fa5]+a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))$')
}

export const EnglishNameReg = function () {
  return new RegExp('^([A-Za-z]+\\s{1}[A-Za-z]+\\s?[A-Za-z]+)$')
}

export const PassportReg = /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/
// export const PassportReg = /^[a-zA-Z]{5,17}|[a-zA-Z0-9]{5,17}$/
export const OfficerReg = /^南字第(\d{8})号|北字第(\d{8})号|沈字第(\d{8})号|兰字第(\d{8})号|成字第(\d{8})号|济字第(\d{8})号|广字第(\d{8})号|海字第(\d{8})号|空字第(\d{8})号|参字第(\d{8})号|政字第(\d{8})号|后字第(\d{8})号|装字第(\d{8})号$/

const city = {11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 '}

export const CnameVaild = function (name, err) {
  if (!name.match(PinYin())) {
    err = '中文名格式不正确'
    return err
  } else if (name.length > 26) {
    err = '中文名长度最多为26个字符'
    return err
  } else {
    return true
  }
}

export const EnameVaild = function (name, err) {
  if (!name.match(EnglishNameReg())) {
    err = '英文名格式不正确'
    return err
  } else if (name.length > 57) {
    err = '英文名长度最多55个字符'
    return err
  } else {
    return true
  }
}

const EighteenIDVaild = function (id, birth) {
  let identStr = id
  identStr = identStr.split('')
  /**
   * ∑(ai×Wi)(mod 11)
   * factor 加权因子
   * parity  校验码
   */
  let [factor, parity, sum, ai, wi] = [
  [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ],
  [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ], 0, 0, 0]
  for (let i = 0; i < 17; i++) {
    ai = id[i]
    wi = factor[i]
    sum += (ai * wi)
  }
  console.log(parity[sum % 11])
  console.log(id[17])
  if (parity[sum % 11] === 'X' && id[17] === 'X') {
    console.log(typeof id)
    birth = id.slice(6, 14)
    return birth
  } else {
    if (Number(parity[sum % 11]) !== Number(id[17])) {
      // err = '校验码不正确'
      return false
    } else {
      birth = id.slice(6, 14)
      return birth
    }
  }
}

export const IDVaild = function (id, birth) {
  let identStr = id
  if (!city[identStr.substr(0, 2)]) {
    // err = '地址编码不正确'
    return false
  } else {
    return EighteenIDVaild(id, birth)
  }
}
