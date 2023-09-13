//ast语法树 {}    vnode {}

/**
 * {
 * tag:'div'
 * attrs:[{id:"app"}]
 * children:[{}]
 * }
 * 
 * 
 * 
 */

//将真实节点变为ast语法树

//遍历
//从源码处偷过来的正则表达式
const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
//属性 例如:  {id=app}
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //<span:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`) //标签开头
const startTagClose = /^\s*(\/?)>/ //匹配结束标签 的 >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //结束标签 例如</div>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

let root; //根元素
let createParent //当前元素的父亲
let stack = [] 
function createASTElement(tag, attrs) {
    return {
        tag,
        attrs,
        children: [],
        type: 1,
        parent: null
    }
}

function start(tag, attrs) { //开始标签
    let element = createASTElement(tag, attrs) //生成一个开始标签元素
    //查看root根元素是否为空
    //若是,将该元素作为根
    //非原则
    if (!root) {
        root = element
    }
    createParent = element
    stack.push(element)
    // console.log(tag, attrs, '开始的标签')
}

function charts(text) { //获取文本
    // console.log(text, '文本')
    // text = text.replace(/a/g,'')
    if(text){
        createParent.children.push({
            type:3,
            text
        })
    }
    // console.log(stack,'stack')
}

function end(tag) { //结束的标签
    let element = stack.pop()
    createParent = stack[stack.length - 1]
    if (createParent) { //元素闭合
        element.parent = createParent.tag
        createParent.children.push(element)
    }
    // console.log(tag, '结束标签')
}

export function parseHTML(html) {
    while (html) { //html 为空时,结束
        //判断标签 <>
        let textEnd = html.indexOf('<') //0
        // console.log(html,textEnd,'this is textEnd')
        if (textEnd === 0) { //标签
            // (1) 开始标签
            const startTagMatch = parseStartTag() //开始标签的内容{}
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            // console.log(endTagMatch, '结束标签')
            //结束标签
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue;
            }
        }
        let text
        //文本
        if (textEnd > 0) {
            // console.log(textEnd)
            //获取文本内容
            text = html.substring(0, textEnd)
            // console.log(text)
        }
        if (text) {
            advance(text.length)
            charts(text)
            // console.log(html)
        }
    }
    function parseStartTag() {
        //
        const start = html.match(startTagOpen) // 1结果 2false
        // console.log(start,'this is start')
        // match() 方法检索字符串与正则表达式进行匹配的结果
        // console.log(start)
        //创建ast 语法树
        if (start) {
            let match = {
                tagName: start[1],
                attrs: []
            }
            // console.log(match,'match match')
            //删除 开始标签
            advance(start[0].length)
            //属性
            //注意 多个 遍历
            //注意>
            let attr //属性 
            let end //结束标签
            //attr=html.match(attribute)用于匹配
            //非结束位'>',且有属性存在
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr,'attr attr'); //{}
                // console.log(end,'end end')
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length)
                //匹配完后,就进行删除操作
            }
            //end里面有东西了(只能是有">"),那么将其删除
            if (end) {
                // console.log(end)
                advance(end[0].length)
                return match
            }
        }
    }
    function advance(n) {
        // console.log(html)
        // console.log(n)
        html = html.substring(n)
        // substring() 方法返回一个字符串在开始索引到结束索引之间的一个子集，
        // 或从开始索引直到字符串的末尾的一个子集。
        // console.log(html)
    }
    // console.log(root)
    return root 
}