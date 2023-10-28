//对象合并 {created:[]}
export const HOOKS =[
    "beforeCreated",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestory",
    "destroyed",
]
// 策略模式
let starts ={}
starts.data =function(parentVal,childVal){
    return childVal
} //合并data
// starts.computed =function(){} //合并computed
// starts.watch =function(){} //合并watch
// starts.methods =function(){} //合并methods
//遍历生命周期
HOOKS.forEach(hooks=>{
    //是不是傻了?这里是传方法,不是调方法
    starts[hooks] = mergeHook
    // console.log(starts,)
})

function mergeHook(parentVal,childVal){
    if(childVal){
        if(parentVal){
            //把子元素合并进去
            return parentVal.concat(childVal)
        }else{
            return [childVal] //[a]
        }
    }else{
        return parentVal
    }
}

export function mergeOptions(parent, child) {
    // console.log(parent,child,'||this is parent and child in mergeOptions()')
    const options ={}
    //判断父亲
    for(let key in parent){
        // console.log(key,'||this is key')
        mergeField(key)
    }
    //判断儿子
    for(let key in child){
        // console.log(key,'||this is key')
        mergeField(key)
    }
    function mergeField(key){
        //根据key 策略模式
        if(starts[key]){ //created {created:[a]}
            options[key] =starts[key](parent[key],child[key])
        }else{
            options[key] = child[key]
        }
    }
    return options
}