import {
  initMixin
} from "./init";
import {
  liftcycleMixin
} from "./liftcycle";
import {
  renderMixin
} from "./vnode/index";
import {
  initGlobalApi
} from "./global-api/index";
import {
  stateMixin
} from './initState'
import {
  compileToFunction
} from './compiler/index'
import {
  createELm,
  patch
} from './vnode/patch'

function Vue(options) {
  this._init(options)
}
//这些方法都是原型上的方法
initMixin(Vue) //给原型上添加一个  init 方法
liftcycleMixin(Vue) //混合生命周期 渲染
renderMixin(Vue) // _render
stateMixin(Vue) // 给 vm 添加  $nextTick
//静态方法  ，也是全局方法  Vue.component .Vue.extend Vue.mixin ..
initGlobalApi(Vue);

// 创建vnode
// let vm1 = new Vue({
//   data: {
//     name: '张三'
//   }
// })
// let render1 = compileToFunction(`<ul>
//     <li style="background:red" key="c">c</li>
//      <li style="background:pink" key="b">b</li>
//      <li style="background:blue" key="a">a</li>
//     </ul>`)
// let vnode1 = render1.call(vm1)
// document.body.appendChild(createELm(vnode1))

// //数据更新
// let vm2 = new Vue({
//   data: {
//     name: '李四'
//   }
// })
// let render2 = compileToFunction(`<ul>
//      <li style="background:red" key="f">f</li>
//      <li style="background:pink" key="g">g</li>
//      <li style="background:pink" key="b">b</li>
//      <li style="background:blue" key="e">e</li>

//     </ul>`)
// let vnode2 = render2.call(vm2)

// setTimeout(() => {
//   patch(vnode1, vnode2)
// }, 2000)

//  let vm1 = new Vue({data:{name:'张三'}})
//  let render1 = compileToFunction(`<ul>
//   <li style="background:red" key="a">a</li>
//   <li style="background:pink" key="b">b</li>
//   <li style="background:blue" key="c">c</li>
//  </ul>`)
//  let vnode1 = render1.call(vm1)
//   document.body.appendChild(createELm(vnode1))

// //数据更新
//   let vm2 = new Vue({data:{name:'李四'}})
//   let render2 = compileToFunction(`<ul>
//   <li style="background:yellow" key="d">d</li>
//   <li style="background:red" key="a">a</li>
//   <li style="background:pink" key="b">b</li>
//   <li style="background:blue" key="c">c</li>
//  </ul>`)
//   let vnode2 = render2.call(vm2)

//   let vm1 = new Vue({data:{name:'张三'}})
//   let render1 = compileToFunction(`<ul>
//   <li style="background:yellow" key="c">我是黄色</li>
//   </ul>`)
//   let vnode1 = render1.call(vm1)
//    document.body.appendChild(createELm(vnode1))

//  //数据更新
//    let vm2 = new Vue({data:{name:'李四'}})
//    let render2 = compileToFunction(`<ul>
//    <li style="background:blue" key="c">我是蓝色</li>
//   </ul>`)
//    let vnode2 = render2.call(vm2)

//    //patch 比对


//   //创建vnode
//   let vm1 = new Vue({data:{name:'张三'}})
//   let render1 = compileToFunction(`<a>{{name}}</a>`)
//   let vnode1 = render1.call(vm1)
//    document.body.appendChild(createELm(vnode1))

//  //数据更新
//    let vm2 = new Vue({data:{name:'李四'}})
//    let render2 = compileToFunction(`<div>{{name}}</div>`)
//    let vnode2 = render2.call(vm2)
// //属性添加
//    let vm3 = new Vue({data:{name:'李四'}})
//    let render3 = compileToFunction(`<div style="color:red">{{name}}</div>`)
//    let vnode3 = render3.call(vm3)

//    //patch 比对
//     setTimeout(()=>{
//       patch(vnode1,vnode2)
//     },2000)

//     setTimeout(()=>{
//       patch(vnode2,vnode3)
//     },3000)

export default Vue