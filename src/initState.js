import {
    observer
} from "./observe/index.js"
import { nextTick } from "./utils/nextTicks.js"

import Watcher from './observe/watcher'
export function initState(vm) {
    let opts = vm.$options
    // console.log(opts)
    //判断
    if (opts.props) {
        initProps()
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
    if (opts.computed) {
        initComputed()
    }
    if (opts.methods) {
        initMethods()
    }
}

function initComputed() {}

function initMethods() {}

function initProps() {}

function initWatch(vm) {
    //1 获取watch
    let watch = vm.$options.watch
    console.log(watch)
    //2 遍历  { a,b,c}
    for (let key in watch) {
        //2.1获取 他的属性对应的值 （判断)
        let handler = watch[key] //数组 ，对象 ，字符，函数
        if (Array.isArray(handler)) {//数组  []
            hendler.forEach(item=>{
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
   return vm.$watch(vm,exprOrfn,handler,options)
}

//vue2 对data初始化
function initData(vm) {
    // console.log('data初始化') //两种情况 (1)对象 (2)函数
    let data = vm.$options.data
    data = vm._data = typeof data === "function" ? data.call(vm) : data
    //data数据进行劫持
    //将data上的所有属性代理到实例上{a:1,b:2}
    // for(let i=0;i<data.length;i++){
    //     proxy(vm,"_data",data[i])
    // }
    // 另一种写法
    for (let key in data) {
        proxy(vm, "_data", key)
    }
    // console.log(data)
    // console.log(observer(data))
    observer(data)
}
//Vue实例 , '_data','msg'
function proxy(vm, source, key) {
    // console.log(vm,source,key,'fuck')
    Object.defineProperty(vm, key, {
        get() {
            console.log()
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}
//data{} (1)对象(2)数组 { a:{b:1},list:[1,2,3],arr:[{}]]}

export function stateMixin(vm) {
    //列队批处理
    //1.处理vue自己的nextTick
    //2.用户自己的
    vm.prototype.$nextTick = function (cb) {
        // console.log(cb)
        nextTick(cb)
    }
    vm.prototype.$watch =function(Vue,exprOrfn,handler,options={}){ //上面格式化处理
          console.log(exprOrfn,handler,options,'||this is exprOrfn,handler,options')
          //实现watch 方法 就是new  watcher //渲染走 渲染watcher $watch 走 watcher  user false
         //  watch 核心 watcher
         let watcher = new Watcher(Vue,exprOrfn,handler,{...options,user:true})
          
         if(options.immediate){
            handler.call(Vue) //如果有这个immediate 立即执行
         }
    }
}