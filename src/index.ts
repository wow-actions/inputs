import * as core from '@actions/core'
import uniq from 'lodash.uniq'
import camelCase from 'lodash.camelcase'
import kebabCase from 'lodash.kebabcase'
import * as parser from './parser'

type TypeMap = {
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
  json: any
}

type Types = keyof TypeMap

interface Options<T extends Types = Types> extends core.InputOptions {
  type: T
  defaultValue?: TypeMap[T]
}

function getNames(raw: string) {
  const candidates: string[] = [raw, camelCase(raw), kebabCase(raw)]
  const names: string[] = uniq(candidates)
  return names
}

function getBooleanInput<T extends Types>(key: string, options: Options<T>) {
  const type = options.type
  const names = getNames(key)
  const errors: Error[] = []
  let value: boolean | boolean[] | undefined

  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    if (type === 'boolean') {
      try {
        value = core.getBooleanInput(name, options)
        if (typeof value === 'boolean') {
          return value
        }
      } catch (error) {
        errors.push(error)
      }
    } else {
      try {
        const raw = core.getInput(name, options)
        if (raw) {
          value = parser.booleanArray(raw)
          return value
        }
      } catch (error) {
        errors.push(
          new TypeError(
            `Input does not meet YAML 1.2 "Core Schema" specification: ${key}\n` +
              `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``,
          ),
        )
      }
    }
  }

  if (options.defaultValue != null) {
    return options.defaultValue
  }

  if (errors.length) {
    throw errors[0]
  }
}

function getMultilineInput<T extends Types>(key: string, options: Options<T>) {
  const names = getNames(key)
  const errors: Error[] = []
  let value: string[]
  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    try {
      value = core.getMultilineInput(name, options)
      if ((value as string[]).length) {
        return value
      }
    } catch (error) {
      errors.push(error)
    }
  }

  if (options.defaultValue != null) {
    return options.defaultValue as string[]
  }

  if (errors.length) {
    throw errors[0]
  }
}

function getInput<T extends Types>(
  key: string,
  options: Options<T>,
): TypeMap[T] | undefined {
  const type = options.type

  if (type === 'boolean' || type === 'booleanArray') {
    return getBooleanInput(key, options) as TypeMap[T]
  }

  if (type === 'stringArray') {
    return getMultilineInput(key, options) as TypeMap[T]
  }

  const names = getNames(key)
  const errors: Error[] = []

  const ntype = options.type as keyof Omit<
    TypeMap,
    'boolean' | 'booleanArray' | 'stringArray'
  >

  for (let i = 0; i < names.length; i++) {
    try {
      const name = names[i]
      const raw = core.getInput(name, options)
      if (raw) {
        return parser[ntype](raw) as TypeMap[T]
      }
    } catch (error) {
      errors.push(error)
    }
  }

  if (options.defaultValue != null) {
    return options.defaultValue as TypeMap[T]
  }

  if (errors.length) {
    throw errors[0]
  }

  return undefined
}

export function parseInputs<S extends Record<string, Options>>(schema: S) {
  return Object.keys(schema).reduce<{
    [K in keyof S]: TypeMap[S[K]['type']]
  }>((memo, key) => {
    const options = schema[key]
    memo[key as keyof S] = getInput(key, options) as any
    return memo
  }, {} as any)
}

export default parseInputs
