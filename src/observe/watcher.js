//(1) 通过这个类watcher 实现更新
import {
    pushTarget,
    popTarget
} from "./dep"
import { nextTick } from "../utils/nextTicks"
let id = 0
class watcher {
    //cb表示回调函数,options表示标识
    constructor(vm, exprOrfn, cb, options) {
        // 1.创建类第一步将选项放在实例上
        this.vm = vm;
        this.exprOrfn = exprOrfn;
        this.cb = cb;
        this.options = options;
        // 2. 每一组件只有一个watcher 他是为标识
        this.id = id++
        this.user = !!options.user
        // 3.判断表达式是不是一个函数
        this.deps = []  //watcher 记录有多少dep 依赖
        this.depsId = new Set()
        if (typeof exprOrfn === 'function') {
            this.getter = exprOrfn
        }else{ //{a,b,c}  字符串 变成函数 
            this.getter =function(){ //属性 c.c.c
              let path = exprOrfn.split('.')
              let obj = vm
              for(let i = 0;i<path.length;i++){
                obj  = obj[path[i]]
              }
              return obj //
            }
        }
        // 4.执行渲染页面
        this.value =  this.get() //保存watch 初始值

    }
    addDep(dep) {
        //去重
        let id = dep.id
        if(!this.depsId.has(id)){
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    //初次渲染
    run(){
        this.getter()
    }
    get() {
        // console.log(this, '||this is this')
        pushTarget(this) //给dep 添加  watcher
        // console.log("进完")
        console.log(this)
        this.getter()
        // console.log("this.getter执行完毕")
        popTarget() //给dep 去除 watcher
        // console.log("出完")

        
    }
    //更新
    updata() {
        // this.getter()
        //注意:不在数据更新后每次都调用get方法,get方法会重新渲染
        //缓存
        queueWatcher(this)
    }
}

let queue = [] // 将需要批量更新的watcher 存放到一个列队中
let has = {}
let pending = false
//数组重置
function flushWatcher() {
    queue.forEach(item => {
        item.run(),item.cb()})
    queue = []
    has = {}
    pending = false
}
function queueWatcher(watcher) {
    let id = watcher.id // 每个组件都是同一个 watcher
    //    console.log(id) //去重
    if (has[id] == null) {//去重
        //列队处理
        queue.push(watcher)//将wacher 添加到列队中
        has[id] = true
        //防抖 ：用户触发多次，只触发一个 异步，同步
        if (!pending) {
            //异步：等待同步代码执行完毕之后，再执行
            // setTimeout(()=>{
            //   queue.forEach(item=>item.run())
            //   queue = []
            //   has = {}
            //   pending = false
            // },0)
            nextTick(flushWatcher) //  nextTick相当于定时器
        }
        pending = true
    }
}

export default watcher

//收集依赖 vue dep watcher data:{name,msg}
//dep:dep 和 data 中的属性是一一对应
//watcher:监视的数据有多少个,就对应有多少个watcher
//dep与watcher: 一对多 dep.name = [w1,w2]


//实现对象的收集依赖