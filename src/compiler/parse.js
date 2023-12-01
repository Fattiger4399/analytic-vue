
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // 小a-z 大A到Z 标签名称： div  span a-aa
//?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 捕获这种 <my:xx> </my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
//属性匹配   <div id="atts"></div>  // aa = "aa" | aa = 'aa'
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{xx}}  默认的 双大括号
//vue3 一摸一样的

//通过数据结构 树，栈  变成 ast语法树



export function parseHTML(html) {
    //创建树
    function createASTELement(tagName, attrs) {
        return {
            tag: tagName, //标签名称
            type: 1, //元素类型
            children: [],// 孩子列表
            attrs,   //属性集合
            parent: null  // 父元素
        }
    }
    //<div>hello {{name}} <span>world</span></div>
    //创建3个方法
    let root; //判断是否是根元素
    let currentParent; //这个元素的当前父亲元素
    //4 检测 标签是否符合预期 <div><span></span></div>   栈的方式来解决这个： [div,span]
    let stack = []
    function start(tagName, attrs) { //开始的标签
        // console.log(tagName, attrs, '--开始--')
        let element = createASTELement(tagName, attrs)
        //注意：是不是根元素
        if (!root) {
            root = element
        }
        currentParent = element//当前解析的标签保存起来
        stack.push(element)
    }
    //<div>hello<span></span> <p></p></div> // [div,span]
    function end(tagName) { //结束的标签
        // console.log(tagName, '----结束---')
        let element = stack.pop() //取出 栈中的最后一个
        currentParent = stack[stack.length - 1]
        // debugger
        if (currentParent) { //在闭合时可以知道这个标签的父亲说谁
            element.parent = currentParent
            currentParent.children.push(element) //将儿子放进去
        }
    }

    function chars(text) { //文本
        // console.log(text, '---文本---')
        //注意：空格
        text = text.replace(/\s/g, '')
        if (text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
    }
    //1解析标签  <div id="my">hello {{name}} <span>world</span></div>
    while (html) { // 只要html 不为空字符串就一直执行下去
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
            //肯定是标签
            // console.log('开始', html)
            //这个标签是开始标签还是结束标签
            const startTagMatch = parseStartTag() //开始标签匹配结果
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue; //中断（循环中）的一个迭代，如果发生指定的条件。然后继续循环中的下一个迭代。
            }
            //处理结束标签
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue;
            }

            // console.log(html)
        }
        //文本 
        let text;
        if (textEnd > 0) {
            // console.log(textEnd)
            text = html.substring(0, textEnd)
        }
        if (text) {//处理文本
            advance(text.length)
            chars(text)//获取到文本
        }
        // console.log(html)
        // break //添加break 不然死循环
    }
    //删除标签
    function advance(n) { //将字符串进行截取操作，再跟新到html
        html = html.substring(n)

    }
    //匹配 开头的标签
    function parseStartTag() {
        const start = html.match(startTagOpen)// 1：成功结果 2:false
        if (start) {//成功
            // console.log(start)
            //组合ast语法树
            const match = {
                tagName: start[1],
                attrs: []
            }
            // console.log(match)
            //删除开始标签
            advance(start[0].length)
            // console.log(html)
            //属性,注意 可能又多个 属性  遍历
            // 1：循环
            // 2: 注意：1闭合标签 <div/>  , 2这个标签属性
            let end;
            let attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr) //属性
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                // console.log(match)
                //ast语法树获取，删除
                advance(attr[0].length) //删除属性 （没有了）
                //    break;
            }
            if (end) {
                advance(end[0].length) //删除 >
                // console.log(end)
                return match
            }

        }
    }

    // 最后返回  root 
    return root
}