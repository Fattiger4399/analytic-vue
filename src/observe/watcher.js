import {
    pushTarget,
    popTarget
} from "./dep";
import {
    nextTick
} from "../utils/nextTick";

//为什么封装成一个类 ，方便我们的扩展
let id = 0; //全局的
class Watcher {
    //vm 实例
    //exprOrfn vm._updata(vm._render()) 
    constructor(vm, exprOrfn, cb, options) {
        // 1.创建类第一步将选项放在实例上
        this.vm = vm;
        this.exprOrfn = exprOrfn;
        this.cb = cb;
        this.options = options;
        //for conputed
        this.lazy = options.lazy
        this.dirty = this.lazy
        // 2. 每一组件只有一个watcher 他是为标识
        this.id = id++
        this.user = !!options.user
        // 3.判断表达式是不是一个函数
        this.deps = [] //watcher 记录有多少dep 依赖
        this.depsId = new Set()
        if (typeof exprOrfn === 'function') {
            this.getter = exprOrfn
        } else { //{a,b,c}  字符串 变成函数 
            this.getter = function () { //属性 c.c.c
                let path = exprOrfn.split('.')
                let obj = vm
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj //
            }
        }
        // 4.执行渲染页面
        // this.value =  this.get() //保存watch 初始值
        this.value = this.lazy ? void 0 : this.get()


    }
    addDep(dep) {
        //去重  判断一下 如果dep 相同我们是不用去处理的
        let id = dep.id
        //  console.log(dep.id)
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            //同时将watcher 放到 dep中
            // console.log(666)
            dep.addSub(this)

        }
        // 现在只需要记住  一个watcher 有多个dep,一个dep 有多个watcher
        //为后面的 component 
    }
    run() { //old new
        let value = this.get() //new
        let oldValue = this.value //old
        this.value = value
        //执行 hendler (cb) 这个用户wathcer
        if (this.user) {
            this.cb.call(this.vm, value, oldValue)
        }
    }
    get() {
        // Dep.target = watcher

        pushTarget(this) //当前的实例添加
        const value = this.getter.call(this.vm) // 渲染页面  render()   with(wm){_v(msg,_s(name))} ，取值（执行get这个方法） 走劫持方法
        popTarget(); //删除当前的实例 这两个方法放在 dep 中
        return value
    }
    //问题：要把属性和watcher 绑定在一起   去html页面
    // (1)是不是页面中调用的属性要和watcher 关联起来
    //方法
    //（1）创建一个dep 模块
    updata() { //三次
        //注意：不要数据更新后每次都调用 get 方法 ，get 方法回重新渲染
        //缓存
        // this.get() //重新
        
        // 渲染
        if(this.lazy){
            this.dirty = true
        }else{
            queueWatcher(this)
        }
    }
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }
    depend(){
        let i = this.deps.length
        while(i--){
            this.deps[i].depend()
        }
    }
}
let queue = [] // 将需要批量更新的watcher 存放到一个列队中
let has = {}
let pending = false

function flushWatcher() {
    queue.forEach(item => {
        item.run()
    })
    queue = []
    has = {}
    pending = false
}

function queueWatcher(watcher) {
    let id = watcher.id // 每个组件都是同一个 watcher
    //    console.log(id) //去重
    if (has[id] == null) { //去重
        //列队处理
        queue.push(watcher) //将wacher 添加到列队中
        has[id] = true
        //防抖 ：用户触发多次，只触发一个
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
export default Watcher

//nextTick 原理

//优化
//1 创建nextTick 方法