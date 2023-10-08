//(1) 通过这个类watcher 实现更新
import { pushTarget,popTarget } from "./dep"
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
        //判断
        if (typeof updataComponent === 'function') {
            this.getter = updataComponent
        }
        //更新视图
        this.get()
    }
    //初次渲染
    get() {
        console.log(this,'||this is this')
        pushTarget(this) //给dep 添加  watcher
        this.getter()
        popTarget() //给dep 去除 watcher
    }
    //更新
    updata() {
        this.getter()
    }
}

export default watcher

//收集依赖 vue dep watcher data:{name,msg}
//dep:dep 和 data 中的属性是一一对应
//watcher:监视的数据有多少个,就对应有多少个watcher
//dep与watcher: 一对多 dep.name = [w1,w2]


//实现对象的收集依赖