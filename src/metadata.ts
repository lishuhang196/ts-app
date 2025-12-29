import 'reflect-metadata'

function logType(target: any, propertyKey: string | symbol) {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    Reflect.defineMetadata('custom:validate', () => {
        console.log(122)
    }, target, propertyKey);
    console.log(`${String(propertyKey)}的类型是${type.name}`);
}

class Person {
    @logType
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    @logType
    static sayHello() {
        console.log('hello');
    }
}

const p = new Person('张三');
