//初始化
import {
  initState
} from './initState'
import {
  compileToFunction
} from './compiler/index'
import {
  mountComponent,
  callHook
} from './liftcycle'
import {
  mergeOptions
} from './utils/index';
export function initMixin(Vue) {
  //面试题  全局组件和局部组件的区别
  //局部组件是不是在等前的组件中可以使用
  //全局组件在项目中任何地方都可以使用 原因 在组件初始化的时候 合并进来了

  Vue.prototype._init = function (options) {
    //el 显示页面
    //data  数据初始化
    //
    // console.log(options)
    const vm = this
    // 注意 ：组件中都有一个 vue
    vm.$options = mergeOptions(Vue.options, options) // 需要将用户自定义的options 合并 谁和谁合并
    //初始化 状态 （将数据做一个初始化的劫持，当我改变数据时应跟新视图）
    //vue组件中有很多状态 data,props watch computed
    // console.log(vm.$options)
    callHook(vm, "beforeCreate")
    initState(vm) //初始化状态
    callHook(vm, "created")
    //vue核心特点  响应式数据原理
    //vue 是一个什么样的框架 mvvm
    //数据变化视图更新，视图变化数据会被影响（mvvm） 不能跳过数据去更新视图，$ref   

    // 如果当前 有el 属性说明要渲染模块
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  //创建 $mount 方法
  Vue.prototype.$mount = function (el) {
    //进行挂载操作
    const vm = this;
    const options = vm.$options //
    // console.log(el)
    //获取元素
    el = document.querySelector(el);
    vm.$el = el
    //现在我们就希望渲染页面
    //1: 如果有render  渲染render
    if (!options.render) { // 没有
      let template = options.template
      //1.1 需要判断有没有template
      if (!template && el) {
        //1.2 获取el 内容
        //DOM接口的outerHTML属性获取描述元素（包括其后代）的序列化HTML片段。它也可以设置为用从给定字符串解析的节点替换元素。
        //innerHTML 里面的元素
        template = el.outerHTML
      }
      //  console.log(template)
      //获取到元素(template模块)，将元素转换成render
      const render = compileToFunction(template)
      options.render = render
    }
    // console.log(options.render) // 渲染到页面的都是这个render方法
    //需要挂载这个组件
    mountComponent(vm, el)

  }
}