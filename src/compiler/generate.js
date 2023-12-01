//思路
//  <div id="app" style="color:red"> hello {{name}}<p>hello1</P> </div>
//变成 render()
// render(){
//      return _c("div",{id:"app",style:{color:"res"}},_v('hello'+_s(name)),_c('p'，null,_v('hello1)))
//    }
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //注意正则匹配 lastIndex
// 处理元素的属性
function genProps(attrs) {
    //处理属性
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        //注意;   style："color:red;font-size: 20px
        if (attr.name === 'style') {
            let obj = {} //对样式进行特殊处理
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj //
        }
        //其他  'id:app',注意最后会多个属性化 逗号
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`  // -1为最后一个字符串的位置  演示一下 
    // let reg =/a/g    reg.test('ad') false  
}
//判断是否又儿子
function genChildren(el) {
    const children = el.children
    if (children) { //将所有
        return children.map(child => gen(child)).join(',')
    }


}
function gen(node) { //获取到的元素
    //注意 是什么类型  文本   div
    if (node.type === 1) {
        return generate(node) //生成元素节点的字符串
    } else {
        let text = node.text // 获取文本  注意  普通的文本  hello{{name}}?{{num}}
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`  // _v(html)  _v('hello'+_s(name))
        }
        let tokens = [] //存放每一段的代码
        let lastIndex = defaultTagRE.lastIndex = 0;//如果正则是全局模式 需要每次使用前变为0
        let match;// 每次匹配到的结果  exec 获取 {{name}}
        while (match = defaultTagRE.exec(text)) {
            // console.log(match) 获取到 又{{}}  元素
            //  console.log(match)
           let index = match.index;// 保存匹配到的索引
          // hello{{name}} ? {{num}}
            if (index > lastIndex) {
               tokens.push(JSON.stringify(text.slice(lastIndex,index))) //添加的是文本
            //    console.log(tokens)
            }
            //{{name}} 添加{{}} aa
            tokens.push(`_s(${match[1].trim()})`)
             lastIndex = index+match[0].length //最后 {{}} 索引位置
        }
        if(lastIndex<text.length){
           tokens.push(JSON.stringify(text.slice(lastIndex))) 
        }
        //最终返回出去

        return `_v(${tokens.join("+")})`
    }


}
//语法层面的转移
export function generate(el) {
    // console.log(el)
    let children = genChildren(el)
    //方法 拼接字符串  源码也是这样操作 [{}]    ${el.attrs.length?`{style:{color:red}}`:'undefined'}
    let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${
        children ? `,${children}` : ''
        })`
    return code
}