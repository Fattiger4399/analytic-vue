let oldArrayProtoMethods = Array.prototype

export let ArrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice"
]

methods.forEach(item => {
    ArrayMethods[item] = function (...args) {
        // console.log(args)
        let result = oldArrayProtoMethods[item].apply(this, args)
        console.log(args) //[{b:6}]
        //问题:数组追加对象的情况
        let inserted;
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.splice(2);
                break;
        }
        console.log(inserted)
        let ob = this.__ob__ //
        if (inserted) {
            ob.observeArray(inserted)
            //对添加的对象进行劫持
        }
        return result
    }
})

// 当我们调用该方法时，可以传入多个参数，并且这些参数将会被传递给 oldArrayProtoMethods[item] 中对应的方法进行处理。让我们以一个简单的例子来说明这个过程：

// 假设 methods 数组中有一个元素为 'push'，即 methods = ['push']。代码会将 push 方法添加到 ArrayMethods 对象中，并创建一个相应的函数，这个函数实际上是 oldArrayProtoMethods.push 的包装函数。

// 当我们调用 ArrayMethods.push(1, 2, 3) 时，这里的参数 1, 2, 3 将会作为 args 的值，被传递给这个函数。在函数中，我们可以通过 console.log(args) 来打印参数，这将会输出 [1, 2, 3]。

// 接下来，我们调用 oldArrayProtoMethods.push.apply(this, args)，这里的 this 表示当前的上下文。apply 方法将会把 args 数组解包成独立的参数，并传递给 oldArrayProtoMethods.push 方法。因此，我们实际上是调用了 oldArrayProtoMethods.push(1, 2, 3)。

// 最后，在包装函数中，将会返回 oldArrayProtoMethods.push 方法的返回值。

// 所以，args 的作用是接收传入的参数，并将其传递给原始方法进行处理。这样就实现了在调用 ArrayMethods 对象的方法时，会先将参数打印出来，并将这些参数传递给原始的方法进行处理的功能。