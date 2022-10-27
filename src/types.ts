import { InputOptions } from '@actions/core'

export type TypeMap = {
  string: string
  int: number
  float: number
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

export type NTypes = keyof Omit<
  TypeMap,
  'boolean' | 'booleanArray' | 'stringArray'
>

export interface Options<T extends Types = Types> extends InputOptions {
  type: T
  defaultValue?: TypeMap[T]
}
