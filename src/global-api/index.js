import {
  mergeOptions
} from "../utils/index";

export function initGlobalApi(Vue) {
  // 源码当中 你所有定义的全局方法都是 放在
  // Vue.options = {} //Vue.component Vue.diretive
  Vue.options = {}; // {created:[a,b,]}
  Vue.mixin = function (mixin) {
    // console.log(mixin) 
    //实现合并 就是合并对象 （我先考虑生命周期）不考虑其他的合并 data,computed watch
    this.options = mergeOptions(this.options, mixin)
    //  console.log( Vue.options,99999)
  }
  //组件
  Vue.options.components = {}
  Vue.component = function (id, componentDef) {
    componentDef.name = componentDef.name || id
    console.log(componentDef)

    console.log(this)
    componentDef = this.extend(componentDef) //返回一个实例
    console.log(componentDef)

    this.options.components[id] = componentDef
    console.log(this.options)
  }
  Vue.extend = function (options) {
    let spuer = this
    const Sub = function vuecomponet(opts) { //opts 子组件的实例
      //初始化
      this._init(opts)
    }
    //属性如何处理??
    //子组件继承父组件中的属性Vue 类的继承
    Sub.prototype = Object.create(spuer.prototype)
    //问题 子组件中this的执行
    Sub.prototype.constructor = Sub
    //重点,将父组件的属性与子组件的属性合并到一起
    Sub.options = mergeOptions(this.options, options)
    console.log(Sub.options)
    return Sub
  }
}

//  options:{created:[a,b,vue1]}