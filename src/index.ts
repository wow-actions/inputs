import * as core from '@actions/core'
import * as parser from './parser'
import { getNames } from './util'
import { Options, TypeMap, Types, NTypes, ArrayTypes } from './types'

function getInput<T extends Types>(
  key: string,
  options: Options<T>,
): TypeMap[T] | undefined {
  const type = options.type
  const names = getNames(key)

  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    const raw = core.getInput(name, { ...options, required: false })
    if (raw) {
      if (type === 'stringArray') {
        return core.getMultilineInput(name, options) as TypeMap[T]
      }

      const ntype = type as NTypes
      return parser[ntype](raw, key) as TypeMap[T]
    }
  }

  if (options.required) {
    throw new Error(`Input required and not supplied: ${key}`)
  }

  if (options.defaultValue != null) {
    return options.defaultValue as TypeMap[T]
  }

  if (type.endsWith('Array')) {
    return [] as TypeMap[T]
  }
}

export function parseInputs<S extends Record<string, Options>>(schema: S) {
  return Object.keys(schema).reduce<{
    [K in keyof S]: S[K]['required'] extends true
      ? TypeMap[S[K]['type']]
      : S[K]['type'] extends ArrayTypes
      ? TypeMap[S[K]['type']]
      : TypeMap[S[K]['type']] | undefined
  }>((memo, key) => {
    memo[key as keyof S] = getInput(key, schema[key]) as any
    return memo
  }, {} as any)
}

export default parseInputs
