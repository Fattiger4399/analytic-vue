import { arrayMethods } from './array'
import Dep from './dep';
class observe {
    constructor(value) {
        //1 给所有的对象类型添加一个dep 属性
        this.dep = new Dep() // 注意 （1）{}  (2) [] 不是给里面属性添加dep
        // console.log(data)
        //使用defineProperty 重新定义属性 作用用来观测数据已经劫持过来
          //判断一个对象是否被观察过看他有没有 __ob__这个属性
          Object.defineProperty(value,"__ob__",{
           enumerable:false, //不能枚举
           configurable:false, //控制属性描述符是否能改变
           value:this
          })

        if (Array.isArray(value)) { //注意对数组中的数据进行劫持 方法 劫持 修改数据的方法
            //我希望调用push  shift unshift splice sort reverse pop 这七个方法，那么我们就可以对
            //你这个方法进行劫持
            // 函数劫持，切片编程 []._ 
            value.__proto__ = arrayMethods // 对象__proto__属性：
            //监听数组中的值时对象
            this.obserArray(value)
        } else {
            this.walk(value)
        }

    }
    obserArray(value) {
        //进行循环
        value.forEach(item => {
            Observer(item)
        })
    }
    walk(data) { //数据是对象的的{a:{b:{}}}
        //循环
        let keys = Object.keys(data) //获取对象的key  注意这个key 只是 对象的最外层的
        keys.forEach(item => {
            defineReactive(data, item, data[item]) //Vue.util 中有的
        })
    }
}
//对数据进行劫持
function defineReactive(data, key, value) {
    // Object.defineProperty
  let chilidDep =  Observer(value) //获取到数组对应的dep 
    //1给我们的每个属性添加一个dep
    let dep = new Dep();
    //2将dep 存放起来，当页面取值时，说明这个值用来渲染，在将这个watcher和这个属性对应起来
    Object.defineProperty(data, key, {
        get() { //依赖收集
            // console.log('获取数据', data, key, value)
            if(Dep.targer){ //让这个属性记住这个watcher
                dep.depend()
                //3当我们对arr取值的时候 我们就让数组的dep记住这个watcher
                if(chilidDep){
                    chilidDep.dep.depend() //数组收集watcher
                }
            }
            //检测一下 dep
            //获取arr的值，会调用get 方法 我希望让当前数组记住这个渲染watcher

            // console.log(dep.subs)
            return value
        },
        set(newValue) { //依赖更新
            //注意设置的值和原来的值是一样的
            // console.log('设置值', data, key, value)
            if (newValue == value) return;
            Observer(newValue) //如果用户将值改为对象继续监控
            value = newValue
            dep.notify()
        }
    })
}
export function Observer(data) {
    // data 我们需要进行判断 typeof  object null
    //不能不是对象 并且不是null
    if (typeof data !== 'object' || data == null) {
        return;
    }
    //判断用户是否已经观测
    if(data.__ob__){
        return data;
    }
    //对这个是数据进行劫持 我们通过一个类
    return new observe(data)
}