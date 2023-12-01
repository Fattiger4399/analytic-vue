import { parseHTML } from "./parse";
import { generate } from "./generate";


export function compileToFunction(template) { //编译模板
    let ast = parseHTML(template)
    // console.log(ast)
    //2通过这个棵树重新的生成代码  render
    let code = generate(ast) //对象
    //  console.log(code)
     //3将字符传变成函数
    //  let render = new Function(code) //new Function()创建函数的语法： es6
    let render = new Function(`with(this){return ${code}}`) //通过with 来进行取值，稍后调用
    // console.log(render)
    //render 函数就可以通过改变this 让这个函数内部取到结果？
     //注意  code 中的变量  name 那里的  ，是不是this
    //  console.log(render)
     return render
     //后面渲染我们的节点 ，再放到页面上去
}

// //with   添加一个作用域
// let obj ={a:1,b:2}
// with(obj ){
//       console.log(a,b)
// }