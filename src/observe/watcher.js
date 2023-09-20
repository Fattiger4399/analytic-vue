//(1) 通过这个类watcher 实现更新

class watcher {
    //cb表示回调函数,options表示标识
    constructor(vm, updataComponent, cb, options) {
        //(1)将
        this.vm = vm
        this.exprOrfn = updataComponent
        this.cb = cb
        this.options = options
        //判断
        if (typeof updataComponent === 'function') {
            this.getter = updataComponent
        }
        //更新视图
        this.get()
        
    }
    get(){
        this.getter()
    }
}

export default watcher