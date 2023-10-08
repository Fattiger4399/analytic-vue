import { mergeOptions } from "../utils/index"

export function initGlobApi(Vue) {
    //源码
    //Vue.options ={created:[a,b,c],watch:{a,b}}
    Vue.options ={}
    Vue.Mixin = function (mixin) { // {}
        //源码
        //{created:[a,b,c],watch:[a,b]}
        //对象的合并
        // console.log(999)
        this.options = mergeOptions(this.options,mixin)
        // console.log(Vue.options,"||this is vue.options")

    }
}