import { observer } from "./observe/index.js"
export function initState(vm){
    let opts = vm.$options
    // console.log(opts)
    //判断
    if(opts.props){
        initProps()
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.watch){
        initWatch()
    }
    if(opts.computed){
        initComputed()
    }
    if(opts.methods){
        initMethods()
    }
}

function initComputed(){}
function initMethods(){}
function initProps(){}
function initWatch(){}

//vue2 对data初始化
function initData(vm){
    // console.log('data初始化') //两种情况 (1)对象 (2)函数
    let data = vm.$options.data
    data = vm._data =typeof data ==="function"?data.call(vm):data
    //data数据进行劫持
    //将data上的所有属性代理到实例上{a:1,b:2}
    // for(let i=0;i<data.length;i++){
    //     proxy(vm,"_data",data[i])
    // }
    // 另一种写法
    for(let key in data){
        proxy(vm,"_data",key)
    }
    observer(data)
}

function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key] =newValue;
        }
    })
}
    //data{} (1)对象(2)数组 { a:{b:1},list:[1,2,3],arr:[{}]]}