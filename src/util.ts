import uniq from 'lodash.uniq'
import camelCase from 'lodash.camelcase'
import kebabCase from 'lodash.kebabcase'
import snakecase from 'lodash.snakecase'

export function getNames(raw: string) {
  const candidates: string[] = [
    raw,
    camelCase(raw),
    kebabCase(raw),
    snakecase(raw),
  ]
  const names: string[] = uniq(candidates)
  return names
}
