// 装饰器执行顺序

/**
 * 实例方法参数装饰器
 * 实例方法装饰器
 * 实例属性装饰器
 * 静态方法参数装饰器
 * 静态方法装饰器
 * 静态属性装饰器
 * 构造函数装饰器
 * 类装饰器
 */

function order(_name: string) {
    return function (target: any, propertyKey?: string | symbol, descriptorOrIndex?: PropertyDescriptor | number) {
        if (propertyKey !== undefined && typeof descriptorOrIndex === 'number') {
            // 装饰参数
            const value = target[propertyKey];
            console.log(value);
            Object.defineProperty(target, propertyKey, {
                enumerable: false,
                writable: true,
                value: function (...args: any[]) {
                    return value.apply(this, args);
                }
            })
        }
    }
}

@order('class')
class Foo {
    constructor() {}

    @order('static method')
    static staticMethod(@order('static method parameter') _param: string) {
    }

    @order('class method')
    method(@order('method parameter') _param: string) {
    }
}

new Foo()

export {}