export function patch(oldVnode,vnode){
    console.log(oldVnode,vnode)
    //(1) 创建新DOM
    let el = createEl(vnode)
    console.log(el)
    //(2) 替换 1) 获取父节点  2)插入 3)删除
    let parentEL = oldVnode.parentNode
    parentEL.insertBefore(el,oldVnode.nextsibling)
    parentEL.removeChild(oldVnode)
    return el
}

function createEl(vnode){
    let {tag,data,key,children,text} = vnode
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag)
        if(children.length >0){
            children.forEach(child => {
                //递归
                vnode.el.appendChild(createEl(child))
            });
        }
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}