export function renderMixin(Vue) {
    //在vue 上创建这些方法  _c,_v,_s 作用创建虚拟节点  用对象来描述dom
    Vue.prototype._c = function () { //创建元素
          return createElement(...arguments)
    }
    Vue.prototype._s = function (val) { // stringify  字符串
        //注意值的类型
        return val == null ? "" : (typeof val == 'object') ? JSON.stringify(val) :val
    }
    Vue.prototype._v = function (text) { // 创建虚拟文本元素
        return createTextVnode(text)
    }
    Vue.prototype._render = function () {
        //将 render函数编程虚拟节点
        //获取render 函数
        let vm = this
        const render = vm.$options.render
        //执行render 函数
        let vnode = render.call(this)
        // console.log(vnode) //展示生成的vnode,就描述的dom结构 好处
        return vnode
    }
}

function createElement(tag,data={},...children){
     return vnode(tag,data,data.key,children)
}

function createTextVnode(text){
   return vnode(undefined,undefined,undefined,undefined,text)
}
  //用来产生虚拟dom
function vnode(tag,data,key,children,text){
   return {
       tag,
       data,
       key,
       children,
       text
   }
}