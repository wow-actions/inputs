import { InputOptions } from '@actions/core'

export type TypeMap = {
  int: number
  float: number
  string: string
  boolean: boolean
  booleanOrString: boolean | string
  words: string[]
  intArray: number[]
  floatArray: number[]
  stringArray: string[]
  booleanArray: boolean[]
  object: any
  yaml: any
  json: any
}

export type Types = keyof TypeMap

export type ArrayTypes =
  | 'words'
  | 'intArray'
  | 'floatArray'
  | 'stringArray'
  | 'booleanArray'

export type NTypes = keyof Omit<TypeMap, 'stringArray'>

export interface Options<T extends Types = Types> extends InputOptions {
  type: T
  defaultValue?: TypeMap[T]
}
