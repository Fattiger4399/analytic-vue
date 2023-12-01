import { Observer } from "./observe/index.js";
import { nextTick } from "./utils/nextTick.js";
import Watcher from './observe/watcher'
export function initState(vm) {
    // console.log(vm)
    //
    const opts = vm.$options
    if (opts.data) {
        initData(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
    if (opts.props) {
        initProps(vm);
    }
  
 
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
}

function initComputed(vm) {

}
function initMethod(vm) {

}
//实现代理  将data中属性代理到 vm (this)
function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key]// vm._data.a
        },
        set(newValue) {
            vm[data][key] = newValue
        }
    })
}
function initData(vm) { //数据进行初始化
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data
    // console.log(data)
    //数据的劫持方案对象Object.defineProperty
    //将data中的属性代理到vm  上
    for (let key in data) {
        proxy(vm, "_data", key)
    }
    Observer(data)
}
function initProps(vm) {

}
function initWatch(vm) {
    //1 获取watch
    let watch = vm.$options.watch
    console.log(watch)
    //2 遍历  { a,b,c}
    for (let key in watch) {
        //2.1获取 他的属性对应的值 （判断)
        let handler = watch[key] //数组 ，对象 ，字符，函数
        if (Array.isArray(handler)) {//数组  []
            handler.forEach(item=>{
                createrWatcher(vm,key,item) 
            })
        } else {//对象 ，字符，函数
           //3创建一个方法来处理
           createrWatcher(vm,key,handler)
        }
    }
}

//vm.$watch(()=>{return 'a'}) // 返回的值就是  watcher 上的属性 user = false
//格式化处理
//vm 实例
//exprOrfn key
//hendler key对应的值
//options 自定义配置项 vue自己的为空,用户定义的才有
function createrWatcher(vm,exprOrfn,handler,options){
   //3.1 处理handler
   if(typeof handler ==='object'){
       options = handler; //用户的配置项目
       handler = handler.handler;//这个是一个函数
   }
   if(typeof handler ==='string'){// 'aa'
       handler = vm[handler] //将实例行的方法作为 handler 方法代理和data 一样
   }
   //其他是 函数
   //watch 最终处理 $watch 这个方法
//    console.log(vm,"||vm")
//    console.log(exprOrfn,"||exprOrfn")
//    console.log(handler,"||handler")
//    console.log(options,"||options")

   return vm.$watch(vm,exprOrfn,handler,options)
}

export function stateMixin(vm) {
    // console.log(vm,6666)
    //列队 :1就是vue自己的nextTick  2用户自己的
    vm.prototype.$nextTick = function (cb) { //nextTick: 数据更新之后获取到最新的DOM
        //  console.log(cb)
        nextTick(cb)
    },
    vm.prototype.$watch =function(Vue,exprOrfn,handler,options={}){ //上面格式化处理
        //   console.log(exprOrfn,handler,options)
          //实现watch 方法 就是new  watcher //渲染走 渲染watcher $watch 走 watcher  user false
         //  watch 核心 watcher
         let watcher = new Watcher(Vue,exprOrfn,handler,{...options,user:true})
          
         if(options.immediate){
            handler.call(Vue) //如果有这个immediate 立即执行
         }
    }
    
}

//nextTick 原理 

// watch 基本使用  init
