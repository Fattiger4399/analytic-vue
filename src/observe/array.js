//函数劫持
// 1 获取到数组原型上的方法（原来的方法）
let oldArrayProtoMethods = Array.prototype;

//2继承一下
export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
    'push',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(item => {
    //进行函数劫持 push
    arrayMethods[item] = function (...args) { //我自己的逻辑
        //调用原来数组的方法
        // console.log('数组被调用')
        //当调用数组我们劫持后的这个7个方法 页面应该更新
        //我们要知道数组对应那个dep
        let result = oldArrayProtoMethods[item].apply(this, args)//this 就是  observer里的value
        // 数组添加对象情况 ，给添加的对象，进行劫持
        let inserted; // arr.push({a:1})
        switch (item) {
            case 'push': // arr.push({a:1},{b:2})
            case 'unshift': // 这里是两个追加   追加的内容可能是对象类型，应该被再次进行 劫持
                inserted = args
                break;
            case "splice":
                args.splice(2); // arr.splice(0,1,{a:4})
                break;
        }
        //判断一下 {}
        let ob = this.__ob__
        if(inserted) ob.obserArray(inserted); //给数组新增的值也要进行观测 {}
        ob.dep.notify() //通知数组更新
        return result
    }
})


