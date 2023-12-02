import { isDate } from 'util/types'

interface SetUnset<T> {
    $set: Partial<T>
    $unset: {
      [key: string]: number
    }
}

interface FlattenObj {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any
    delimiter?: string
    parent?: unknown
    res?: Record<string, string>
    parseArray?: boolean
}

export const flattenObj = ({
    obj,
    delimiter,
    parent,
    res,
    parseArray,
  }: FlattenObj): Record<string, string | boolean> => {

    parseArray = parseArray === false ? parseArray : true
    parent = parent || undefined
    res = res || {}
    const del = delimiter ?? '>'

    Object.keys(obj).forEach(key => {
      const propName = parent ? parent + del  + key : key
      const isArray = Array.isArray(obj[key])
      const isObject = obj[key] && typeof obj[key] == 'object' && !isDate(obj[key])
      const shouldReflat = parseArray ? isArray || isObject : isObject && !isArray
      if (shouldReflat) {
        flattenObj({ obj: obj[key], parent: propName, res, delimiter, parseArray })
      } else {
        Object.assign(res || {}, { [propName]: obj[key] })
      }
    })

    return res
}

export const buildSetAndUnsetOperators = <T>(source: Partial<T>): SetUnset<T> => {
    const flatSource = flattenObj({
      obj: source,
      delimiter: '.',
      parseArray: false,
    })

    const $set = {}
    const $unset = {}

    Object.keys(flatSource).forEach(key => {
      flatSource[key] || flatSource[key] === false
        ? Object.assign($set, { [key]: flatSource[key] })
        : Object.assign($unset, { [key]: 1 })
    })

    return { $set, $unset }
}
