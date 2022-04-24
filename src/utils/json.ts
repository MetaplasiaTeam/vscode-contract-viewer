export function objectToMap(obj: any): Map<any, any> {
  let map = new Map()
  for (let k of Object.keys(obj)) {
    map.set(k, obj[k])
  }
  return map
}
