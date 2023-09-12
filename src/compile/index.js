import { generate } from "./generate"
import { parseHTML } from "./parseAst"

export function compileToFunction(el) {

    //1. 将html元素变为ast语法树
    let ast = parseHTML(el)
    console.log(ast)
    //2. ast语法树变成render函数
    //(1) ast语法树变成字符串
    //(2) 字符串变成函数
    let code = generate(ast) // _c _v _s
    //3.将render字符串变成函数
    let render = new Function(`with(this){return ${code}}`)
    
    return render
}

/**
 * <div id="app">Hello{{msg}}</div>
 * 
 * _c 解析标签
 * _v 解析字符串
 * 
 * render(){
 *  return _c('div',{id:app},_v('hello'+_s(msg)),_c)
 * }
 *  
 */ 