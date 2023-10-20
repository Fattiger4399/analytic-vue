let id = 0
class Dep{
    constructor(){
        this.id = id++
        this.subs = []
    }
    //收集watcher
    depend(){
        //我希望watcher可以存放dep
        //双向记忆
        Dep.target.addDep(this)
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    //更新watcher
    notify(){
        this.subs.forEach(watcher =>{
            watcher.updata()
        })
    }
}

//添加watcher
Dep.target = null
export function pushTarget(watcher){
    Dep.target = watcher
}
export function popTarget(){
    Dep.target = null
}
export default Dep
