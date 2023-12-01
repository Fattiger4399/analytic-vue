import {
   patch
} from './vnode/patch'
import Watcher from './observe/watcher'
export function mountComponent(vm, el) {
   //调用render方法去渲染 el属性

   //方法：先调用render方法创建虚拟节点，在将虚拟节点渲染到页面上
   //源码方式
   callHook(vm, "beforeMount")
   //挂载  重新封装一下 变成一个类，这个类他是响应式变的，数据改变了我们就调用这个方法
   //   vm._updata(vm._render()) 
   let updataComponent = () => {
      vm._updata(vm._render())
   }
   //这个watcher 是用于渲染的 目前没有任何功能 ，updataComponent 
   new Watcher(vm, updataComponent, () => {
      callHook(vm, 'updated')
   }, true) //Watcher 有什么用  和之前差不多，1把实例缠绕进去 ,2在给他传入一个方法
   //true 标识渲染的  ，（）=》{} 跟新逻辑
   callHook(vm, "mounted")
}

//创建这两个方法
export function liftcycleMixin(Vue) { //这个方法在那个地方使用的
   Vue.prototype._updata = function (vnode) {
      //console.log(vnode)
      const vm = this
      //vm.$el 真实的dom
      //需要区分一下 是首次还是更新
      let prevVnode =vm._vnode //如果是首次 值为null
      if(!prevVnode){
         vm.$el =patch(vm.$el,vnode) //获取到最新的渲染值
         vm._vnode = vnode //保存原来的那一次
      }else{
         console.log(prevVnode,vnode,"this is prevVnode,vnode")
         patch(prevVnode,vnode)
      }
   }
}

//生命周期初始化
export function callHook(vm, hook) {
   const handlers = vm.$options[hook] // created = [a1,a2,a3]
   if (handlers) {
      for (let i = 0; i < handlers.length; i++) {
         handlers[i].call(vm); //改变生命周期中的this
      }
   }
}
//怎么调用
//  callHook(vm,"created")