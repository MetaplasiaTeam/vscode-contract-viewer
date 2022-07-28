export function objectToMap(obj: any): Map<any, any> {
  const map = new Map()
  for (const k of Object.keys(obj)) {
    map.set(k, obj[k])
  }
  return map
}
