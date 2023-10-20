//(1) 通过这个类watcher 实现更新
import {
    pushTarget,
    popTarget
} from "./dep"
let id = 0
class watcher {
    //cb表示回调函数,options表示标识
    constructor(vm, updataComponent, cb, options) {
        //(1)将
        this.vm = vm
        this.exprOrfn = updataComponent
        this.cb = cb
        this.options = options
        this.id = id++
        this.deps = [] //watcher存放 dep
        this.depsId = new Set()
        //判断
        if (typeof updataComponent === 'function') {
            this.getter = updataComponent
        }
        //更新视图
        this.get()
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
            setTimeout(()=>{
              queue.forEach(item=>item.run())
              queue = []
              has = {}
              pending = false
            },0)
            // nextTick(flushWatcher) //  nextTick相当于定时器
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