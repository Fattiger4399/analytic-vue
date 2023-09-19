import {
    patch
} from "./vnode/patch"

export function mounetComponent(vm, el) {
    //源码
    callHook(vm,"beforeMounted")
    vm._updata(vm._render())
    //(1)vm._render() 将 render函数变成vnode
    //(2)vm.updata()将vnode变成真实dom
    callHook(vm,"mounted")
}

export function lifecycleMixin(Vue) {
    Vue.prototype._updata = function (vnode) {
        // console.log(vnode)
        let vm = this
        //两个参数 ()
        vm.$el = patch(vm.$el, vnode)
    }
}

//(1) render()函数 =>vnode =>真实dom 

//生命周期调用

export function callHook(vm, hook) {
    // console.log(vm.options,"||this is vm.options")
    // console.log(vm.$options,"||this is vm.$options")

    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++){
            handlers[i].call(this) //改变生命周期中的指向 
        }
    }
}