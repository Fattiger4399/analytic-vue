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
//处理属性
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

//genPorps()方法解析属性
function genPorps(attrs) {
    // console.log(attrs)
    let str = '';
    //对象
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') { // 
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, val] = item.split(':')
                // console.log(key, val, "//this is [key,val]")
                obj[key] = val
            })
            attr.value = obj
        }
        //拼接
        str += `${attr.name}:${JSON.stringify(attr.value)},`
        // console.log(str, '|this is str')
        // console.log(`{${str.slice(0,-1)}}`)
    }
    //首字符到倒数第二个字符,即去掉标点符号
    return `{${str.slice(0,-1)}}`
}

//处理子节点
function genChildren(el) {
    let children = el.children //获取元素节点的子节点
    //如果存在子节点，则递归调用 gen() 函数处理每个子节点，并用逗号拼接子节点的代码。
    if (children) {
        //返回子节点代码的字符串。
        return children.map(child => gen(child)).join(',')
    }
}
//
function gen(node) { //1.元素  2.div  tip:_v表示文本
    // console.log(node, "this is node")
    //如果节点是元素节点，递归调用 generate() 函数处理该节点，并返回结果。
    if (node.type === 1) {
        return generate(node)
    } else { //文本 
        //(1) 只是文本 hello  (2){{}}
        let text = node.text //获取文本
        //转化
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        //(2)带插值表达式{{}}
        //文本包含插值表达式，使用正则表达式 defaultTagRE 
        //查找所有 {{}} 形式的插值表达式，并解析成可执行的代码片段。
        let tokens = []
        //lastIndex 需要清零 否则test匹配会失败
        let lastindex = defaultTagRE.lastIndex = 0
        //match保存获取结果
        let match
        while (match = defaultTagRE.exec(text)) {
            console.log(match, "|this is match")
            let index = match.index
            if (index > lastindex) {
                tokens.push(JSON.stringify(text.slice(lastindex, index))) //内容
            }
            tokens.push(`_s(${match[1].trim()})`)
            //lastindex处理文本长度
            lastindex = index + match[0].length
        }
        //此处if用于处理`Hello{{msg}} xxx`中的xxx
        if (lastindex < text.slice(lastindex)) {
            tokens.push(JSON.stringify(text.slice(lastindex, index))) //内容
        }
        return `_v(${tokens.join('+')})`
    }
}

export function generate(el) {
    console.log(el,'|this is el')
    let children = genChildren(el)
    console.log(children, "|this is children")
    let code = `_c('${el.tag}',${el.attrs.length?`${genPorps(el.attrs)}`:'undefined'},${
        children?`${children}`:''
    })`
    console.log(code, '|this is code')
    return code
}