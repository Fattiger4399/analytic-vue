import {
    ArrayMethods
} from "./arr"
export function observer(data) {
    // console.log(data)

    //判断数据
    if (typeof data != 'object' || data == null) {
        return data
    }
    //对象通过一个类
    return new Observer(data)
}

class Observer {
    constructor(value) {
        Object.defineProperty(value, "__ob__", {
            enumerable: false,
            value: this
        })
        //判断数据
        // console.log(value)
        if (Array.isArray(value)) {
            value.__proto__ = ArrayMethods
            // console.log("shuzhu")
            //如果你是数组对象
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }
    walk(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {

            //对象我们的每个属性进行劫持
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }

    }
    observeArray(value) { //[{a:1}]
        for (let i = 0; i < value.length; i++) {
            observer(value[i])
        }
    }
}
//对对象中的属性进行劫持
function defineReactive(data, key, value) {
    observer(value) //深度代理
    Object.defineProperty(data, key, {
        get() {
            // console.log('获取')
            return value
        },
        set(newValue) {
            // console.log('设置')
            if (newValue == value) {
                return;
            }
            observer(newValue)
            value = newValue
        }
    })

}

//vue2   Object.defineProperty 缺点 对象中的一个属性

//{a:{}},list[]}

//数组{list:[1,2,3],arr:[{a:1}]}
//ipo切片思想 
// 方法函数劫持,重写数组方法 arr.push()
