import yml from 'js-yaml'
import parseJson from 'parse-json'
import stripJsonComments from 'strip-json-comments'

export const string = (input: string) => input
export const int = (input: string) => parseInt(input, 10)
export const float = (input: string) => parseFloat(input)

export function boolean(input: string, key: string) {
  const trueValue = ['true', 'True', 'TRUE']
  const falseValue = ['false', 'False', 'FALSE']

  if (trueValue.includes(input)) return true
  if (falseValue.includes(input)) return false
  throw new TypeError(
    `Input does not meet YAML 1.2 "Core Schema" specification: ${key}\n` +
      `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``,
  )
}

export function booleanOrString(input: string, key: string) {
  try {
    return boolean(input, key)
  } catch (error) {
    return input
  }
}

export function words(input: string) {
  return input
    .replace(/[\n\r\s\t]+/g, ',')
    .split(',')
    .map((n) => n.trim())
    .filter((n) => n.length > 0)
}

export const intArray = (input: string) => words(input).map(int)

export const floatArray = (input: string) => words(input).map(float)

export function booleanArray(input: string, key: string) {
  return words(input).map((word) => boolean(word, key))
}

export function yaml<T>(input: string) {
  return yml.load(input) as T
}

export function json<T>(input: string) {
  return parseJson(stripJsonComments(input)) as T
}

export function object<T>(input: string) {
  const raw = input.trim()
  if (raw.startsWith('{') || raw.startsWith('[')) {
    return json<T>(input)
  }

  return yaml<T>(input)
}
