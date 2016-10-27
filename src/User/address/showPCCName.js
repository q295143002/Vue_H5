export default function (value, list) {
  let rs = Array.map(value, (one, index) => {
    return Array.find(list, item => {
      return item.value === one
    })
  })
  return Array.map(rs, one => {
    return one.name
  }).join(' ').replace('--', '')
}
