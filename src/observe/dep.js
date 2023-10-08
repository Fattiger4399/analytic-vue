class Dep{
    constructor(){
        this.subs = []
    }
    //收集watcher
    depend(){
        this.subs.push(Dep.target)
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
