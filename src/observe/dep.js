let id = 0
class Dep {
    constructor() {
        this.subs = []
        this.id = id++
    }
    //收集watcher 
    depend() {
      
        //我们希望water 可以存放 dep
        //实现双休记忆的，让watcher 记住
        //dep同时，让dep也记住了我们的watcher
        Dep.targer.addDep(this)
        // this.subs.push(Dep.targer) // id：1 记住他的dep
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    //更新
    notify() {
        // console.log(Dep.targer)
        this.subs.forEach(watcher => {
            watcher.updata()
        })
    }
}

//dep  和 watcher 关系
Dep.targer = null;

let stack =[]
export function pushTarget(watcher) {  //添加 watcher
    
    Dep.targer = watcher //保留watcher
    
    stack.push(watcher)//渲染watcher
    // console.log(Dep.targer)
}
export function popTarget() {
    stack.pop()
    // Dep.targer = null //将变量删除
    Dep.targer = stack[stack.length - 1]

}
export default Dep
 //多对多的关系
 //1. 一个属性有一个dep ,dep 作用：用来收集watcher的
 //2. dep和watcher 关系：(1)dep 可以存放多个watcher  (2):一个watcher可以对应多个dep