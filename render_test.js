let code = _c('div',{id:"app",style:{"display":" block","color":" #000"}},_v("Hello"+_s(msg)),_c('h2',undefined,_v("张三")))
let render = new Function(`with(this){return ${code}}`)


