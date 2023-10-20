import {
    compileToFunction
} from "./compile/index.js";
import {
    initState
} from "./initState";
import {
    callHook,
    mounetComponent
} from './lifecycle'
import {
    mergeOptions
} from "./utils/index.js";


export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options)
        let vm = this
        //options为
        // console.log(Vue)
        // console.log(Vue.options, options)
        //mergeOptions()合并方法最终得到的选项将作为Vue实例的 $options 属性，
        //包含了所有经过合并的选项
        vm.$options = mergeOptions(Vue.options, options)
        // console.log(vm.$options)


        callHook(vm,'beforeCreated')
        //初始化状态
        initState(vm)
        callHook(vm,'created')

        // 渲染模板 el
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    //创建 $mount

    Vue.prototype.$mount = function (el) {
        // console.log(el)
        //el template render
        let vm = this
        el = document.querySelector(el) //获取元素
        vm.$el = el
        let options = vm.$options
        // console.log(vm.$options,'||this is vm.$options')
        // console.log(this,'||this is this?')
        if (!options.render) { //没有
            let template = options.template
            if (!template && el) {
                //获取html
                el = el.outerHTML
                // console.log(el,'this is  init.js attrs:el')
                //<div id="app">Hello</div>
                //变成ast语法树
                let render = compileToFunction(el)
                // console.log(render,'||this is render from compileToFunction')
                //(1)render函数变为 vnode (2)vnode变成真实DOM放到页面上去
                options.render = render
                //

            }
        }
        //挂载组件
        mounetComponent(vm, el)
    }

}

//ast语法树 {}    vnode {}
//<div id="app">Hello{{msg}}</div>
/**
 * {
 * tag:'div'
 * attrs:[{id:"app"}]
 * children:[{tag:null,text:Hello},{tag:'div'}]
 * }
 * 
 * 
 * 
 */