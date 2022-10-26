import yaml from 'js-yaml'
import parseJson from 'parse-json'
import stripJsonComments from 'strip-json-comments'

export function string(input: string) {
  return input
}

export function int(input: string) {
  return parseInt(input, 10)
}

export function float(input: string) {
  return parseFloat(input)
}

export function boolean(input: string) {
  const trueValue = ['true', 'True', 'TRUE']
  const falseValue = ['false', 'False', 'FALSE']

  if (trueValue.includes(input)) return true
  if (falseValue.includes(input)) return false
  throw new Error()
}

export function booleanOrString(input: string) {
  try {
    return boolean(input)
  } catch (error) {
    return input
  }
}

export function words(input: string): string[] {
  return input
    .replace(/[\n\r\s\t]+/g, ',')
    .split(',')
    .map((n) => n.trim())
    .filter((n) => n.length > 0)
}

export function intArray(input: string) {
  return words(input).map(int)
}

export function floatArray(input: string) {
  return words(input).map(float)
}

export function booleanArray(input: string) {
  return words(input).map(boolean)
}

export function json(input: string) {
  const raw = input.trim()
  if (raw.startsWith('{') || raw.startsWith('[')) {
    return parseJson(stripJsonComments(input))
  }

  return yaml.load(input)
}
