import { compileToFunction } from "./compile/index.js";
import {
    initState
} from "./initState";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options)
        let vm = this
        //options为
        vm.$options = options
        //初始化状态
        initState(vm)

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
        let options = vm.$options
        if (!options.render) { //没有
            let template = options.template
            if (!template && el) {
                //获取html
                el = el.outerHTML
                console.log(el,'this is init.js attrs:el')
                //<div id="app">Hello</div>
                //变成ast语法树
                let ast = compileToFunction(el)
                console.log(ast,'this is ast')
                //render()

                //

            }
        }
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