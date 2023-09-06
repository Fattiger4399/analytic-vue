import {initMixin} from "./init"

function Vue(options) {
    // console.log(options)
    //初始化
    this._init(options)
}
initMixin(Vue)
export default Vue