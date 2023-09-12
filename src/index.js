import {initMixin} from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"

function Vue(options) {
    // console.log(options)
    //初始化
    this._init(options)
}
initMixin(Vue)
lifecycleMixin(Vue)  //添加生命周期
renderMixin(Vue) //添加_render
export default Vue