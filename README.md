# Codelog

wip.

## Example

```js
const codelog = require('codelog');
const foocodelog = codelog('foo')

foocodelog('string', `
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  toString() { return this.name; }
}
new Person('tarou', 24);
  `.trim());

foocodelog('object', {foo: 1, bar: 2, 'baz': 3});
foocodelog('array', ['foo', 'bar', 'baz']);

```

Run.

```bash
$ NODE_DEBUG=foo node ***.js
```

Output like this.

![Node codelog](https://raw.github.com/nju33/node-codelog/master/screenshot.png)

## License

MIT © nju33
