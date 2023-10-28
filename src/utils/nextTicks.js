let callback = []
let pending = false
function flush(){
   callback.forEach(cb =>cb())
   pending =false
}
let timerFunc
//处理兼容问题

//判断全局对象中是否存在Promise
//看浏览器是否支持promise
if(Promise){
   timerFunc = ()=>{
       Promise.resolve().then(flush) //异步处理
   }
}else if(MutationObserver){ //h5 异步方法 他可以监听 DOM 变化 ，监控完毕之后在来异步更新
  let observe = new MutationObserver(flush)
  let textNode = document.createTextNode(1) //创建文本
  observe.observe(textNode,{characterData:true}) //观测文本的内容
  timerFunc = ()=>{
   textNode.textContent = 2
  }
}else if(setImmediate){ //ie
   timerFunc = ()=>{
       setImmediate(flush) 
   }
}
export function nextTick(cb){
    // 1vue 2
   //  console.log(cb)
    //列队 [cb1,cb2] 
    //此处,注意,我们要处理用户的nextTick()也要处理vue自己的nextTick
    callback.push(cb)
    //Promise.then()  vue3
    
    if(!pending){
        timerFunc()   //这个方法就是异步方法 但是 处理兼容问题
        pending = true
    }
}