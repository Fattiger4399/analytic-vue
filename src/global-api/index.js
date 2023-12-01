import { mergeOptions } from "../utils/index";

 export function initGlobalApi(Vue){
     // 源码当中 你所有定义的全局方法都是 放在
     // Vue.options = {} //Vue.component Vue.diretive
     Vue.options = {}; // {created:[a,b,]}
   Vue.mixin = function(mixin){
      // console.log(mixin) 
      //实现合并 就是合并对象 （我先考虑生命周期）不考虑其他的合并 data,computed watch
      this.options = mergeOptions(this.options,mixin)
      //  console.log( Vue.options,99999)
   }
 }

//  options:{created:[a,b,vue1]}