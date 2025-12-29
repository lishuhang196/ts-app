import 'reflect-metadata'

function foo() {
  console.log('foo(): evaluated');
  return function (_target: any) {
    console.log('foo(): called');
  };
}

function bar() {
  console.log('bar(): evaluated');
  return function (_target: any) {
    console.log('bar(): called');
  };
}

@foo()
@bar()
class Person {
  constructor() {}
}

const p = new Person();

console.log(Object.getOwnPropertySymbols(p))

export {}