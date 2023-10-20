import {
    ArrayMethods
} from "./arr"
import Dep from './dep'
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
            configurable: true,
            value: this
        })
        // console.log(value,"this is value")
        this.dep =new Dep() //1.给所有对象类型增加一个dep []
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
        // console.log(this.dep)
    }
    walk(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {

            //对象我们的每个属性进行劫持
            let key = keys[i]
            let value = data[key]
            // console.log(data,"||data")
            // console.log(key,"||key")
            // console.log(value,"||value")
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
    let childDep = observer(value) //深度代理
    // console.log(childDep)
    let dep = new Dep() //给每一个对象添加dep
    Object.defineProperty(data, key, {
        get() {
            // console.log('获取')
            // console.log(Dep,"||this is Dep")
            // console.log(Dep.target,"||this is Dep.target")
            if(Dep.target){
                // console.log("dep.depend()被触发")
                dep.depend()
                if(childDep.dep){
                    childDep.dep.depend() //数组收集
                }
            }
            // console.log(dep,"||this is dep")
            return value
        },
        set(newValue) {
            // console.log('设置')
            if (newValue == value) {
                return;
            }
            observer(newValue)
            value = newValue
            dep.notify()
        }
    })

}

//vue2   Object.defineProperty 缺点 对象中的一个属性

//{a:{}},list[]}

//数组{list:[1,2,3],arr:[{a:1}]}
//ipo切片思想 
// 方法函数劫持,重写数组方法 arr.push()
