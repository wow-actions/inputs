# parse-inputs

Utility method to parse action's inputs

## Installation

```shell
$ npm install @wow-actions/parse-inputs --save
```

## Usage

```ts
import parseInputs from '@wow-actions/parse-inputs';

const inputs = parseInputs({
  foo: { type: 'boolean' },
  bar: { type: 'stringArray', required: true}
}); // => { foo: true, bar: ['Hello, Action', 'GitHub Action is cool']}
```


## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
