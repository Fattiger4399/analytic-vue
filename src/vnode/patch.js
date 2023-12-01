export function patch(oldVnode, Vnode) {
    //原则  将虚拟节点转换成真实的节点
    console.log(oldVnode, Vnode)
    // console.log(oldVnode.nodeType)
    // console.log(Vnode.nodeType)
    //第一次渲染 oldVnode 是一个真实的DOM
    //判断ldVnode.nodeType是否为一,意思就是判断oldVnode是否为属性节点
    if (oldVnode.nodeType === 1) {
        console.log(oldVnode, Vnode) //注意oldVnode 需要在加载 mount 添加上去  vm.$el= el

        let el = createELm(Vnode) // 产生一个新的DOM
        let parentElm = oldVnode.parentNode //获取老元素（app） 父亲 ，body
        //   console.log(oldVnode)
        //  console.log(parentElm)

        parentElm.insertBefore(el, oldVnode.nextSibling) //当前真实的元素插入到app 的后面
        parentElm.removeChild(oldVnode) //删除老节点
        //重新赋值
        return el
    } else { //  diff
        // console.log(oldVnode.nodeType)
        // console.log(oldVnode, Vnode)
        //1 元素不是一样 
        if (oldVnode.tag !== Vnode.tag) {
            //旧的元素 直接替换为新的元素
            return oldVnode.el.parentNode.replaceChild(createELm(Vnode), oldVnode.el)
        }
        //2 标签一样 text  属性 <div>1</div>  <div>2</div>  tag:undefined
        if (!oldVnode.tag) {
            if (oldVnode.text !== Vnode.text) {
                return oldVnode.el.textContent = Vnode.text
            }
        }
        //2.1属性 (标签一样)  <div id='a'>1</div>  <div style>2</div>
        //在updataRpors方法中处理
        //方法 1直接复制
        let el = Vnode.el = oldVnode.el
        updataRpors(Vnode, oldVnode.data)
        //diff子元素 <div>1</div>  <div></div>
        console.log(oldVnode,Vnode)
        let oldChildren = oldVnode.children || []
        let newChildren = Vnode.children || []
        if (oldChildren.length > 0 && newChildren.length > 0) { //老的有儿子 新有儿子
            //创建方法
            
            updataChild(oldChildren, newChildren, el)
        } else if (oldChildren.length > 0 && newChildren.length <= 0) { //老的元素 有儿子 新的没有儿子
            el.innerHTML = ''
        } else if (newChildren.length > 0 && oldChildren.length <= 0) { //老没有儿子  新的有儿子
            for (let i = 0; i < newChildren.length; i++) {
                let child = newChildren[i]
                //添加到真实DOM
                el.appendChild(createELm(child))
            }
        }

    }
}

function updataChild(oldChildren, newChildren, parent) {
    //diff算法 做了很多优化 例子<div>11</div> 更新为 <div>22</div> 
    //dom中操作元素 常用的 思想 尾部添加 头部添加 倒叙和正序的方式
    //双指针 遍历
    console.log(oldChildren, newChildren)
    let oldStartIndex = 0 //老的开头索引
    let oldStartVnode = oldChildren[oldStartIndex];
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0 //新的开头索引
    let newStartVnode = newChildren[newStartIndex];
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]
    // console.log(oldEndIndex,newEndIndex)
    // console.log(oldEndVnode,newEndVnode)

    function makeIndexBykey(child){
        let map = {}
            child.forEach((item,index)=>{
                if(item.key){
                    map[item.key] =index
                }
            })
        return map
    }
    //创建映射表
    let map =makeIndexBykey(oldChildren)

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        //比对子元素
        console.log(666)
        if (isSomeVnode(oldStartVnode, newStartVnode)) {
            //递归
            //1 从头部开始
            console.log(1)
            patch(oldStartVnode, newStartVnode);
            //移动指针
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
            console.log(oldStartVnode,newStartVnode)
        }//2 从尾部开始
        else if(isSomeVnode(oldEndVnode, newEndVnode)){
            //
            console.log(2)
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        }//3 交叉比对 从头
        else if(isSomeVnode(oldStartVnode,newEndVnode)){
            console.log(3)
            patch(oldStartVnode, newEndVnode);
            oldStartVnode =oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex];
        }//4 交叉比对 从尾
        else if(isSomeVnode(oldEndVnode,newStartVnode)){
            console.log(4)
            patch(oldEndVnode, newStartVnode);
            oldEndVnode =oldChildren[--oldStartIndex]
            newStartVnode = newChildren[++newStartIndex];
        }//5 暴力比对 儿子之间没有任何关系
        else{
            console.log(5)
            //1 创建 旧元素映射表
            //2 从旧的中寻找新的中有的元素
            let moveIndex = map[newStartVnode.key]
            //没有相应key值的元素
            if(moveIndex == undefined){
                parent.insertBefore(createELm(newStartVnode),oldStartVnode.el)
            }//有
            else{
                let moveVnode = oldChildren[moveIndex] //获取到有的元素
                oldChildren[moveIndex]=null
                //a b f c 和 d f e 
                parent.insertBefore(moveVnode.el,oldStartVnode.el)

                patch(moveVnode,newEndVnode)
            }
            newStartVnode = newChildren[++newStartIndex]
        }
    }
    //判断完毕,添加多余的子儿子  a b c  新的 a b c d
    console.log(newEndIndex)
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            parent.appendChild(createELm(newChildren[i]))
        }
    }
    //将老的多余的元素删去
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            //注意null
            let child = oldChildren[i]
            if(child !=null ){
                parent.removeChild(child.el) //删除元素
            }
        }
    }
    
}
function isSomeVnode(oldContext, newContext) {
    // return true
    return (oldContext.tag == newContext.tag) && (oldContext.key === newContext.key);
}  



//添加属性
function updataRpors(vnode, oldProps = {}) { //第一次
    let newProps = vnode.data || {} //获取当前新节点 的属性
    let el = vnode.el //获取当前真实节点 {}
    //1老的有属性，新没有属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            //删除属性
            el.removeAttribute[key] //
        }
    }
    //2演示 老的 style={color:red}  新的 style="{background:red}"
    let newStyle = newProps.style || {} //获取新的样式
    let oldStyle = oldProps.style || {} //老的
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style = ''
        }
    }
    //新的
    for (let key in newProps) {
        if (key === "style") {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}
//vnode 变成真实的Dom
export function createELm(vnode) {
    let {
        tag,
        children,
        key,
        data,
        text
    } = vnode
    //注意
    if (typeof tag === 'string') { //创建元素 放到 vnode.el上
        vnode.el = document.createElement(tag) //创建元素 
        updataRpors(vnode)
        //有儿子
        children.forEach(child => {
            // 递归 儿子 将儿子渲染后的结果放到 父亲中
            vnode.el.appendChild(createELm(child))
        })
    } else { //文本
        vnode.el = document.createTextNode(text)
    }
    return vnode.el //新的dom
}

//思路 ：虚拟dom 变成正式的dom 
// 1.获取到真实的dom  虚拟daom
// 2.将虚拟dom变成正式dom
// 3.获取到旧dom的父亲元素
// 4.将新的dom 方法 app 后面
// 5.删除 就的元素