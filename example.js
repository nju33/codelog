const codelog = require('.');
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
