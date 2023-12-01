
export  const HOOKS = [
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestory",
    "destroyed"
]
// 策略模式
const strats = {}
strats.data = function (parentVal,childVal){ //data合并
    return childVal //这里应该有合并data 方法
}
// strats.computed =function(){
// }
// strats.methods = function(){}
// strats.watch =function(){
// }

function mergeHook(parentVal,childVal){ //生命周期的合并
    // console.log(parentVal) [a] b [a,b]
  if(childVal){
      if(parentVal){
           return parentVal.concat(childVal);//爸爸和儿子进行并接
      }else{
          return [childVal]  // {}{created:function} // [created]
      }
  }else{
       return parentVal  //不用合并 采用父亲的
  }
}
//遍历这个hooks
 HOOKS.forEach(hooks=>{
     strats[hooks] = mergeHook
 })
 // Vue.options ={}    Vue.mixin({})   {created:[a,b,组件上的]}
export function mergeOptions(parent,child){ 
    const options = {}
    // console.log(parent) {created:[a]}
    //遍历父亲：可能是父亲有，儿子没有
   for(let key in parent){ //父亲和儿子都有在这里进行处理
       mergeField(key)
   }
    //儿子有父亲没有
   for(let key in child){ //将儿子多的赋值到父亲上
      if(!parent.hasOwnProperty(key)){ 
          mergeField(key)
      }
   }
    function mergeField(key){ //合并字段 created
         //根据key  不同的策略进行合并
        // 比如 {key:parent[key] child[key]}
        //注意 我们这个key可能是一个钩子函数
        // console.log(child)
        if(strats[key]){ // strats.created = 
          options[key]=  strats[key](parent[key],child[key]) //[a]
        }else{
            //默认合并策略
            options[key] = child[key]
        }
        //(1) {created:[a,b]} 
    }
    return options
}