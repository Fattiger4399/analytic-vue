import { patch } from "./vnode/patch"

export function mounetComponent(vm,el){
    //源码
    vm._updata(vm._render())
    //(1)vm._render() 将 render函数变成vnode
    //(2)vm.updata()将vnode变成真实dom
}

export function lifecycleMixin(Vue){
    Vue.prototype._updata =function(vnode){
        console.log(vnode)
        let vm = this
        //两个参数 ()
        vm.$el = patch(vm.$el,vnode)
    }
}

//(1) render()函数 =>vnode =>真实dom 