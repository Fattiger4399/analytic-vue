(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  //函数劫持
  // 1 获取到数组原型上的方法（原来的方法）
  var oldArrayProtoMethods = Array.prototype;

  //2继承一下
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (item) {
    //进行函数劫持 push
    arrayMethods[item] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      //我自己的逻辑
      //调用原来数组的方法
      // console.log('数组被调用')
      //当调用数组我们劫持后的这个7个方法 页面应该更新
      //我们要知道数组对应那个dep
      var result = oldArrayProtoMethods[item].apply(this, args); //this 就是  observer里的value
      // 数组添加对象情况 ，给添加的对象，进行劫持
      var inserted; // arr.push({a:1})
      switch (item) {
        case 'push': // arr.push({a:1},{b:2})
        case 'unshift':
          // 这里是两个追加   追加的内容可能是对象类型，应该被再次进行 劫持
          inserted = args;
          break;
        case "splice":
          args.splice(2); // arr.splice(0,1,{a:4})
          break;
      }
      //判断一下 {}
      var ob = this.__ob__;
      if (inserted) ob.obserArray(inserted); //给数组新增的值也要进行观测 {}
      ob.dep.notify(); //通知数组更新
      return result;
    };
  });

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.subs = [];
      this.id = id$1++;
    }
    //收集watcher 
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        //我们希望water 可以存放 dep
        //实现双休记忆的，让watcher 记住
        //dep同时，让dep也记住了我们的watcher
        Dep.targer.addDep(this);
        // this.subs.push(Dep.targer) // id：1 记住他的dep
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
      //更新
    }, {
      key: "notify",
      value: function notify() {
        // console.log(Dep.targer)
        this.subs.forEach(function (watcher) {
          watcher.updata();
        });
      }
    }]);
    return Dep;
  }(); //dep  和 watcher 关系
  Dep.targer = null;
  var stack = [];
  function pushTarget(watcher) {
    //添加 watcher

    Dep.targer = watcher; //保留watcher

    stack.push(watcher); //渲染watcher
    // console.log(Dep.targer)
  }

  function popTarget() {
    stack.pop();
    // Dep.targer = null //将变量删除
    Dep.targer = stack[stack.length - 1];
  }
  //多对多的关系
  //1. 一个属性有一个dep ,dep 作用：用来收集watcher的
  //2. dep和watcher 关系：(1)dep 可以存放多个watcher  (2):一个watcher可以对应多个dep

  var observe$1 = /*#__PURE__*/function () {
    function observe(value) {
      _classCallCheck(this, observe);
      //1 给所有的对象类型添加一个dep 属性
      this.dep = new Dep(); // 注意 （1）{}  (2) [] 不是给里面属性添加dep
      // console.log(data)
      //使用defineProperty 重新定义属性 作用用来观测数据已经劫持过来
      //判断一个对象是否被观察过看他有没有 __ob__这个属性
      Object.defineProperty(value, "__ob__", {
        enumerable: false,
        //不能枚举
        configurable: false,
        //控制属性描述符是否能改变
        value: this
      });
      if (Array.isArray(value)) {
        //注意对数组中的数据进行劫持 方法 劫持 修改数据的方法
        //我希望调用push  shift unshift splice sort reverse pop 这七个方法，那么我们就可以对
        //你这个方法进行劫持
        // 函数劫持，切片编程 []._ 
        value.__proto__ = arrayMethods; // 对象__proto__属性：
        //监听数组中的值时对象
        this.obserArray(value);
      } else {
        this.walk(value);
      }
    }
    _createClass(observe, [{
      key: "obserArray",
      value: function obserArray(value) {
        //进行循环
        value.forEach(function (item) {
          Observer(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        //数据是对象的的{a:{b:{}}}
        //循环
        var keys = Object.keys(data); //获取对象的key  注意这个key 只是 对象的最外层的
        keys.forEach(function (item) {
          defineReactive(data, item, data[item]); //Vue.util 中有的
        });
      }
    }]);
    return observe;
  }(); //对数据进行劫持
  function defineReactive(data, key, value) {
    // Object.defineProperty
    var chilidDep = Observer(value); //获取到数组对应的dep 
    //1给我们的每个属性添加一个dep
    var dep = new Dep();
    //2将dep 存放起来，当页面取值时，说明这个值用来渲染，在将这个watcher和这个属性对应起来
    Object.defineProperty(data, key, {
      get: function get() {
        //依赖收集
        // console.log('获取数据', data, key, value)
        if (Dep.targer) {
          //让这个属性记住这个watcher
          dep.depend();
          //3当我们对arr取值的时候 我们就让数组的dep记住这个watcher
          if (chilidDep) {
            chilidDep.dep.depend(); //数组收集watcher
          }
        }
        //检测一下 dep
        //获取arr的值，会调用get 方法 我希望让当前数组记住这个渲染watcher

        // console.log(dep.subs)
        return value;
      },
      set: function set(newValue) {
        //依赖更新
        //注意设置的值和原来的值是一样的
        // console.log('设置值', data, key, value)
        if (newValue == value) return;
        Observer(newValue); //如果用户将值改为对象继续监控
        value = newValue;
        dep.notify();
      }
    });
  }
  function Observer(data) {
    // data 我们需要进行判断 typeof  object null
    //不能不是对象 并且不是null
    if (_typeof(data) !== 'object' || data == null) {
      return;
    }
    //判断用户是否已经观测
    if (data.__ob__) {
      return data;
    }
    //对这个是数据进行劫持 我们通过一个类
    return new observe$1(data);
  }

  var callback = [];
  var pending$1 = false;
  function flush() {
    callback.forEach(function (cb) {
      return cb();
    });
    pending$1 = false;
  }
  var timerFunc;
  //处理兼容问题
  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flush); //异步处理
    };
  } else if (MutationObserver) {
    //h5 异步方法 他可以监听 DOM 变化 ，监控完毕之后在来异步更新
    var observe = new MutationObserver(flush);
    var textNode = document.createTextNode(1); //创建文本
    observe.observe(textNode, {
      characterData: true
    }); //观测文本的内容
    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    //ie
    timerFunc = function timerFunc() {
      setImmediate(flush);
    };
  }
  function nextTick(cb) {
    // 1vue 2
    //  console.log(cb)
    //列队 [cb1,cb2]
    callback.push(cb);
    //Promise.then()  vue3
    if (!pending$1) {
      timerFunc(); //这个方法就是异步方法 但是 处理兼容问题
      pending$1 = true;
    }
  }

  //为什么封装成一个类 ，方便我们的扩展
  var id = 0; //全局的
  var Watcher = /*#__PURE__*/function () {
    //vm 实例
    //exprOrfn vm._updata(vm._render()) 
    function Watcher(vm, exprOrfn, cb, options) {
      _classCallCheck(this, Watcher);
      // 1.创建类第一步将选项放在实例上
      this.vm = vm;
      this.exprOrfn = exprOrfn;
      this.cb = cb;
      this.options = options;
      //for conputed
      this.lazy = options.lazy;
      this.dirty = this.lazy;
      // 2. 每一组件只有一个watcher 他是为标识
      this.id = id++;
      this.user = !!options.user;
      // 3.判断表达式是不是一个函数
      this.deps = []; //watcher 记录有多少dep 依赖
      this.depsId = new Set();
      if (typeof exprOrfn === 'function') {
        this.getter = exprOrfn;
      } else {
        //{a,b,c}  字符串 变成函数 
        this.getter = function () {
          //属性 c.c.c
          var path = exprOrfn.split('.');
          var obj = vm;
          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }
          return obj; //
        };
      }
      // 4.执行渲染页面
      // this.value =  this.get() //保存watch 初始值
      this.value = this.lazy ? void 0 : this.get();
    }
    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        //去重  判断一下 如果dep 相同我们是不用去处理的
        var id = dep.id;
        //  console.log(dep.id)
        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          //同时将watcher 放到 dep中
          // console.log(666)
          dep.addSub(this);
        }
        // 现在只需要记住  一个watcher 有多个dep,一个dep 有多个watcher
        //为后面的 component 
      }
    }, {
      key: "run",
      value: function run() {
        //old new
        var value = this.get(); //new
        var oldValue = this.value; //old
        this.value = value;
        //执行 hendler (cb) 这个用户wathcer
        if (this.user) {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }, {
      key: "get",
      value: function get() {
        // Dep.target = watcher

        pushTarget(this); //当前的实例添加
        var value = this.getter.call(this.vm); // 渲染页面  render()   with(wm){_v(msg,_s(name))} ，取值（执行get这个方法） 走劫持方法
        popTarget(); //删除当前的实例 这两个方法放在 dep 中
        return value;
      }
      //问题：要把属性和watcher 绑定在一起   去html页面
      // (1)是不是页面中调用的属性要和watcher 关联起来
      //方法
      //（1）创建一个dep 模块
    }, {
      key: "updata",
      value: function updata() {
        //三次
        //注意：不要数据更新后每次都调用 get 方法 ，get 方法回重新渲染
        //缓存
        // this.get() //重新

        // 渲染
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;
        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);
    return Watcher;
  }();
  var queue = []; // 将需要批量更新的watcher 存放到一个列队中
  var has = {};
  var pending = false;
  function flushWatcher() {
    queue.forEach(function (item) {
      item.run();
    });
    queue = [];
    has = {};
    pending = false;
  }
  function queueWatcher(watcher) {
    var id = watcher.id; // 每个组件都是同一个 watcher
    //    console.log(id) //去重
    if (has[id] == null) {
      //去重
      //列队处理
      queue.push(watcher); //将wacher 添加到列队中
      has[id] = true;
      //防抖 ：用户触发多次，只触发一个
      if (!pending) {
        //异步：等待同步代码执行完毕之后，再执行
        // setTimeout(()=>{
        //   queue.forEach(item=>item.run())
        //   queue = []
        //   has = {}
        //   pending = false
        // },0)
        nextTick(flushWatcher); //  nextTick相当于定时器
      }

      pending = true;
    }
  }

  //nextTick 原理

  //优化
  //1 创建nextTick 方法

  function initState(vm) {
    // console.log(vm)
    //
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
    if (opts.watch) {
      initWatch(vm);
    }
    if (opts.props) ;
    if (opts.computed) {
      initComputed(vm);
    }
    if (opts.methods) ;
  }
  function initComputed(vm) {
    var computed = vm.$options.computed;
    // console.log(computed)
    var watcher = vm.computedWatchers = {};
    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef == 'function' ? userDef : userDef.get;
      watcher[key] = new Watcher(vm, getter, function () {}, {
        //标记此为computed的watcher
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  }
  var sharedPropDefinition = {};
  function defineComputed(target, key, userDef) {
    sharedPropDefinition = {
      enumerable: true,
      configurable: true,
      get: function get() {},
      set: function set() {}
    };
    if (typeof userDef == 'function') {
      sharedPropDefinition.get = createComputedGetter(key);
    } else {
      sharedPropDefinition.get = createComputedGetter(key);
      sharedPropDefinition.set = userDef.set;
    }
    Object.defineProperty(target, key, sharedPropDefinition);
  }
  //高阶函数
  function createComputedGetter(key) {
    return function () {
      // if (dirty) {
      // }
      var watcher = this.computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          //执行 求值 
          watcher.evaluate(); //
        }

        if (Dep.targer) {
          //说明

          watcher.depend();
        }
        return watcher.value;
      }
    };
  }
  //实现代理  将data中属性代理到 vm (this)
  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key]; // vm._data.a
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }
  function initData(vm) {
    //数据进行初始化
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // console.log(data)
    //数据的劫持方案对象Object.defineProperty
    //将data中的属性代理到vm  上
    for (var key in data) {
      proxy(vm, "_data", key);
    }
    Observer(data);
  }
  function initWatch(vm) {
    //1 获取watch
    var watch = vm.$options.watch;
    console.log(watch);
    //2 遍历  { a,b,c}
    var _loop = function _loop(key) {
      //2.1获取 他的属性对应的值 （判断)
      var handler = watch[key]; //数组 ，对象 ，字符，函数
      if (Array.isArray(handler)) {
        //数组  []
        handler.forEach(function (item) {
          createrWatcher(vm, key, item);
        });
      } else {
        //对象 ，字符，函数
        //3创建一个方法来处理
        createrWatcher(vm, key, handler);
      }
    };
    for (var key in watch) {
      _loop(key);
    }
  }

  //vm.$watch(()=>{return 'a'}) // 返回的值就是  watcher 上的属性 user = false
  //格式化处理
  //vm 实例
  //exprOrfn key
  //hendler key对应的值
  //options 自定义配置项 vue自己的为空,用户定义的才有
  function createrWatcher(vm, exprOrfn, handler, options) {
    //3.1 处理handler
    if (_typeof(handler) === 'object') {
      options = handler; //用户的配置项目
      handler = handler.handler; //这个是一个函数
    }

    if (typeof handler === 'string') {
      // 'aa'
      handler = vm[handler]; //将实例行的方法作为 handler 方法代理和data 一样
    }
    //其他是 函数
    //watch 最终处理 $watch 这个方法
    //    console.log(vm,"||vm")
    //    console.log(exprOrfn,"||exprOrfn")
    //    console.log(handler,"||handler")
    //    console.log(options,"||options")

    return vm.$watch(vm, exprOrfn, handler, options);
  }
  function stateMixin(vm) {
    // console.log(vm,6666)
    //列队 :1就是vue自己的nextTick  2用户自己的
    vm.prototype.$nextTick = function (cb) {
      //nextTick: 数据更新之后获取到最新的DOM
      //  console.log(cb)
      nextTick(cb);
    }, vm.prototype.$watch = function (Vue, exprOrfn, handler) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      //上面格式化处理
      //   console.log(exprOrfn,handler,options)
      //实现watch 方法 就是new  watcher //渲染走 渲染watcher $watch 走 watcher  user false
      //  watch 核心 watcher
      new Watcher(Vue, exprOrfn, handler, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));
      if (options.immediate) {
        handler.call(Vue); //如果有这个immediate 立即执行
      }
    };
  }

  //nextTick 原理 

  // watch 基本使用  init

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 小a-z 大A到Z 标签名称： div  span a-aa
  //?: 匹配不捕获
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 捕获这种 <my:xx> </my:xx>
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  //属性匹配   <div id="atts"></div>  // aa = "aa" | aa = 'aa'
  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  <div></div>  <br/>
  //vue3 一摸一样的

  //通过数据结构 树，栈  变成 ast语法树

  function parseHTML(html) {
    //创建树
    function createASTELement(tagName, attrs) {
      return {
        tag: tagName,
        //标签名称
        type: 1,
        //元素类型
        children: [],
        // 孩子列表
        attrs: attrs,
        //属性集合
        parent: null // 父元素
      };
    }
    //<div>hello {{name}} <span>world</span></div>
    //创建3个方法
    var root; //判断是否是根元素
    var currentParent; //这个元素的当前父亲元素
    //4 检测 标签是否符合预期 <div><span></span></div>   栈的方式来解决这个： [div,span]
    var stack = [];
    function start(tagName, attrs) {
      //开始的标签
      // console.log(tagName, attrs, '--开始--')
      var element = createASTELement(tagName, attrs);
      //注意：是不是根元素
      if (!root) {
        root = element;
      }
      currentParent = element; //当前解析的标签保存起来
      stack.push(element);
    }
    //<div>hello<span></span> <p></p></div> // [div,span]
    function end(tagName) {
      //结束的标签
      // console.log(tagName, '----结束---')
      var element = stack.pop(); //取出 栈中的最后一个
      currentParent = stack[stack.length - 1];
      // debugger
      if (currentParent) {
        //在闭合时可以知道这个标签的父亲说谁
        element.parent = currentParent;
        currentParent.children.push(element); //将儿子放进去
      }
    }

    function chars(text) {
      //文本
      // console.log(text, '---文本---')
      //注意：空格
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }
    //1解析标签  <div id="my">hello {{name}} <span>world</span></div>
    while (html) {
      // 只要html 不为空字符串就一直执行下去
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        //肯定是标签
        // console.log('开始', html)
        //这个标签是开始标签还是结束标签
        var startTagMatch = parseStartTag(); //开始标签匹配结果
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; //中断（循环中）的一个迭代，如果发生指定的条件。然后继续循环中的下一个迭代。
        }
        //处理结束标签
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }

        // console.log(html)
      }
      //文本 
      var text = void 0;
      if (textEnd > 0) {
        // console.log(textEnd)
        text = html.substring(0, textEnd);
      }
      if (text) {
        //处理文本
        advance(text.length);
        chars(text); //获取到文本
      }
      // console.log(html)
      // break //添加break 不然死循环
    }
    //删除标签
    function advance(n) {
      //将字符串进行截取操作，再跟新到html
      html = html.substring(n);
    }
    //匹配 开头的标签
    function parseStartTag() {
      var start = html.match(startTagOpen); // 1：成功结果 2:false
      if (start) {
        //成功
        // console.log(start)
        //组合ast语法树
        var match = {
          tagName: start[1],
          attrs: []
        };
        // console.log(match)
        //删除开始标签
        advance(start[0].length);
        // console.log(html)
        //属性,注意 可能又多个 属性  遍历
        // 1：循环
        // 2: 注意：1闭合标签 <div/>  , 2这个标签属性
        var _end;
        var attr;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // console.log(attr) //属性
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          // console.log(match)
          //ast语法树获取，删除
          advance(attr[0].length); //删除属性 （没有了）
          //    break;
        }

        if (_end) {
          advance(_end[0].length); //删除 >
          // console.log(end)
          return match;
        }
      }
    }

    // 最后返回  root 
    return root;
  }

  //思路
  //  <div id="app" style="color:red"> hello {{name}}<p>hello1</P> </div>
  //变成 render()
  // render(){
  //      return _c("div",{id:"app",style:{color:"res"}},_v('hello'+_s(name)),_c('p'，null,_v('hello1)))
  //    }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //注意正则匹配 lastIndex
  // 处理元素的属性
  function genProps(attrs) {
    //处理属性
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      //注意;   style："color:red;font-size: 20px
      if (attr.name === 'style') {
        var obj = {}; //对样式进行特殊处理
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj; //
      }
      //其他  'id:app',注意最后会多个属性化 逗号
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}"); // -1为最后一个字符串的位置  演示一下 
    // let reg =/a/g    reg.test('ad') false  
  }
  //判断是否又儿子
  function genChildren(el) {
    var children = el.children;
    if (children) {
      //将所有
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }
  function gen(node) {
    //获取到的元素
    //注意 是什么类型  文本   div
    if (node.type === 1) {
      return generate(node); //生成元素节点的字符串
    } else {
      var text = node.text; // 获取文本  注意  普通的文本  hello{{name}}?{{num}}
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")"); // _v(html)  _v('hello'+_s(name))
      }

      var tokens = []; //存放每一段的代码
      var lastIndex = defaultTagRE.lastIndex = 0; //如果正则是全局模式 需要每次使用前变为0
      var match; // 每次匹配到的结果  exec 获取 {{name}}
      while (match = defaultTagRE.exec(text)) {
        // console.log(match) 获取到 又{{}}  元素
        //  console.log(match)
        var index = match.index; // 保存匹配到的索引
        // hello{{name}} ? {{num}}
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index))); //添加的是文本
          //    console.log(tokens)
        }
        //{{name}} 添加{{}} aa
        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length; //最后 {{}} 索引位置
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      //最终返回出去

      return "_v(".concat(tokens.join("+"), ")");
    }
  }
  //语法层面的转移
  function generate(el) {
    // console.log(el)
    var children = genChildren(el);
    //方法 拼接字符串  源码也是这样操作 [{}]    ${el.attrs.length?`{style:{color:red}}`:'undefined'}
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    //编译模板
    var ast = parseHTML(template);
    // console.log(ast)
    //2通过这个棵树重新的生成代码  render
    var code = generate(ast); //对象
    //  console.log(code)
    //3将字符传变成函数
    //  let render = new Function(code) //new Function()创建函数的语法： es6
    var render = new Function("with(this){return ".concat(code, "}")); //通过with 来进行取值，稍后调用
    // console.log(render)
    //render 函数就可以通过改变this 让这个函数内部取到结果？
    //注意  code 中的变量  name 那里的  ，是不是this
    //  console.log(render)
    return render;
    //后面渲染我们的节点 ，再放到页面上去
  }

  // //with   添加一个作用域
  // let obj ={a:1,b:2}
  // with(obj ){
  //       console.log(a,b)
  // }

  function patch(oldVnode, Vnode) {
    //原则  将虚拟节点转换成真实的节点
    // console.log(oldVnode, Vnode)
    // console.log(oldVnode.nodeType)
    // console.log(Vnode.nodeType)
    //第一次渲染 oldVnode 是一个真实的DOM
    //判断ldVnode.nodeType是否为一,意思就是判断oldVnode是否为属性节点
    if (oldVnode.nodeType === 1) {
      // console.log(oldVnode, Vnode) //注意oldVnode 需要在加载 mount 添加上去  vm.$el= el
      var el = createELm(Vnode); // 产生一个新的DOM
      var parentElm = oldVnode.parentNode; //获取老元素（app） 父亲 ，body
      //   console.log(oldVnode)
      //  console.log(parentElm)

      parentElm.insertBefore(el, oldVnode.nextSibling); //当前真实的元素插入到app 的后面
      parentElm.removeChild(oldVnode); //删除老节点
      //重新赋值
      return el;
    } else {
      //  diff
      // console.log(oldVnode.nodeType)
      // console.log(oldVnode, Vnode)
      //1 元素不是一样 
      if (oldVnode.tag !== Vnode.tag) {
        //旧的元素 直接替换为新的元素
        return oldVnode.el.parentNode.replaceChild(createELm(Vnode), oldVnode.el);
      }
      //2 标签一样 text  属性 <div>1</div>  <div>2</div>  tag:undefined
      if (!oldVnode.tag) {
        if (oldVnode.text !== Vnode.text) {
          return oldVnode.el.textContent = Vnode.text;
        }
      }
      //2.1属性 (标签一样)  <div id='a'>1</div>  <div style>2</div>
      //在updataRpors方法中处理
      //方法 1直接复制
      var _el = Vnode.el = oldVnode.el;
      updataRpors(Vnode, oldVnode.data);
      //diff子元素 <div>1</div>  <div></div>
      // console.log(oldVnode,Vnode)
      var oldChildren = oldVnode.children || [];
      var newChildren = Vnode.children || [];
      if (oldChildren.length > 0 && newChildren.length > 0) {
        //老的有儿子 新有儿子
        //创建方法

        updataChild(oldChildren, newChildren, _el);
      } else if (oldChildren.length > 0 && newChildren.length <= 0) {
        //老的元素 有儿子 新的没有儿子
        _el.innerHTML = '';
      } else if (newChildren.length > 0 && oldChildren.length <= 0) {
        //老没有儿子  新的有儿子
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];
          //添加到真实DOM
          _el.appendChild(createELm(child));
        }
      }
    }
  }
  function updataChild(oldChildren, newChildren, parent) {
    //diff算法 做了很多优化 例子<div>11</div> 更新为 <div>22</div> 
    //dom中操作元素 常用的 思想 尾部添加 头部添加 倒叙和正序的方式
    //双指针 遍历
    // console.log(oldChildren, newChildren)
    var oldStartIndex = 0; //老的开头索引
    var oldStartVnode = oldChildren[oldStartIndex];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0; //新的开头索引
    var newStartVnode = newChildren[newStartIndex];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];
    // console.log(oldEndIndex,newEndIndex)
    // console.log(oldEndVnode,newEndVnode)

    function makeIndexBykey(child) {
      var map = {};
      child.forEach(function (item, index) {
        if (item.key) {
          map[item.key] = index;
        }
      });
      return map;
    }
    //创建映射表
    var map = makeIndexBykey(oldChildren);
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      //比对子元素
      // console.log(666)
      if (isSomeVnode(oldStartVnode, newStartVnode)) {
        //递归
        //1 从头部开始
        // console.log(1)
        patch(oldStartVnode, newStartVnode);
        //移动指针
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
        // console.log(oldStartVnode,newStartVnode)
      } //2 从尾部开始
      else if (isSomeVnode(oldEndVnode, newEndVnode)) {
        //
        // console.log(2)
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } //3 交叉比对 从头
      else if (isSomeVnode(oldStartVnode, newEndVnode)) {
        // console.log(3)
        patch(oldStartVnode, newEndVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } //4 交叉比对 从尾
      else if (isSomeVnode(oldEndVnode, newStartVnode)) {
        // console.log(4)
        patch(oldEndVnode, newStartVnode);
        oldEndVnode = oldChildren[--oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } //5 暴力比对 儿子之间没有任何关系
      else {
        // console.log(5)
        //1 创建 旧元素映射表
        //2 从旧的中寻找新的中有的元素
        var moveIndex = map[newStartVnode.key];
        //没有相应key值的元素
        if (moveIndex == undefined) {
          parent.insertBefore(createELm(newStartVnode), oldStartVnode.el);
        } //有
        else {
          var moveVnode = oldChildren[moveIndex]; //获取到有的元素
          oldChildren[moveIndex] = null;
          //a b f c 和 d f e 
          parent.insertBefore(moveVnode.el, oldStartVnode.el);
          patch(moveVnode, newEndVnode);
        }
        newStartVnode = newChildren[++newStartIndex];
      }
    }
    //判断完毕,添加多余的子儿子  a b c  新的 a b c d
    // console.log(newEndIndex)
    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        parent.appendChild(createELm(newChildren[i]));
      }
    }
    //将老的多余的元素删去
    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        //注意null
        var child = oldChildren[_i];
        if (child != null) {
          parent.removeChild(child.el); //删除元素
        }
      }
    }
  }

  function isSomeVnode(oldContext, newContext) {
    // return true
    return oldContext.tag == newContext.tag && oldContext.key === newContext.key;
  }

  //添加属性
  function updataRpors(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    //第一次
    var newProps = vnode.data || {}; //获取当前新节点 的属性
    var el = vnode.el; //获取当前真实节点 {}
    //1老的有属性，新没有属性
    for (var key in oldProps) {
      if (!newProps[key]) {
        //删除属性
        el.removeAttribute[key]; //
      }
    }
    //2演示 老的 style={color:red}  新的 style="{background:red}"
    var newStyle = newProps.style || {}; //获取新的样式
    var oldStyle = oldProps.style || {}; //老的
    for (var _key in oldStyle) {
      if (!newStyle[_key]) {
        el.style = '';
      }
    }
    //新的
    for (var _key2 in newProps) {
      if (_key2 === "style") {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }
  //vnode 变成真实的Dom
  function createELm(vnode) {
    var tag = vnode.tag,
      children = vnode.children;
      vnode.key;
      vnode.data;
      var text = vnode.text;
    //注意
    if (typeof tag === 'string') {
      //创建元素 放到 vnode.el上
      vnode.el = document.createElement(tag); //创建元素 
      updataRpors(vnode);
      //有儿子
      children.forEach(function (child) {
        // 递归 儿子 将儿子渲染后的结果放到 父亲中
        vnode.el.appendChild(createELm(child));
      });
    } else {
      //文本
      vnode.el = document.createTextNode(text);
    }
    return vnode.el; //新的dom
  }

  //思路 ：虚拟dom 变成正式的dom 
  // 1.获取到真实的dom  虚拟daom
  // 2.将虚拟dom变成正式dom
  // 3.获取到旧dom的父亲元素
  // 4.将新的dom 方法 app 后面
  // 5.删除 就的元素

  function mountComponent(vm, el) {
    //调用render方法去渲染 el属性

    //方法：先调用render方法创建虚拟节点，在将虚拟节点渲染到页面上
    //源码方式
    callHook(vm, "beforeMount");
    //挂载  重新封装一下 变成一个类，这个类他是响应式变的，数据改变了我们就调用这个方法
    //   vm._updata(vm._render()) 
    var updataComponent = function updataComponent() {
      vm._updata(vm._render());
    };
    //这个watcher 是用于渲染的 目前没有任何功能 ，updataComponent 
    new Watcher(vm, updataComponent, function () {
      callHook(vm, 'updated');
    }, true); //Watcher 有什么用  和之前差不多，1把实例缠绕进去 ,2在给他传入一个方法
    //true 标识渲染的  ，（）=》{} 跟新逻辑
    callHook(vm, "mounted");
  }

  //创建这两个方法
  function liftcycleMixin(Vue) {
    //这个方法在那个地方使用的
    Vue.prototype._updata = function (vnode) {
      //console.log(vnode)
      var vm = this;
      //vm.$el 真实的dom
      //需要区分一下 是首次还是更新
      var prevVnode = vm._vnode; //如果是首次 值为null
      if (!prevVnode) {
        vm.$el = patch(vm.$el, vnode); //获取到最新的渲染值
        vm._vnode = vnode; //保存原来的那一次
      } else {
        console.log(prevVnode, vnode, "this is prevVnode,vnode");
        patch(prevVnode, vnode);
      }
    };
  }

  //生命周期初始化
  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // created = [a1,a2,a3]
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm); //改变生命周期中的this
      }
    }
  }
  //怎么调用
  //  callHook(vm,"created")

  var HOOKS = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestory", "destroyed"];
  // 策略模式
  var strats = {};
  strats.data = function (parentVal, childVal) {
    //data合并
    return childVal; //这里应该有合并data 方法
  };
  // strats.computed =function(){
  // }
  // strats.methods = function(){}
  // strats.watch =function(){
  // }

  function mergeHook(parentVal, childVal) {
    //生命周期的合并
    // console.log(parentVal) [a] b [a,b]
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal); //爸爸和儿子进行并接
      } else {
        return [childVal]; // {}{created:function} // [created]
      }
    } else {
      return parentVal; //不用合并 采用父亲的
    }
  }
  //遍历这个hooks
  HOOKS.forEach(function (hooks) {
    strats[hooks] = mergeHook;
  });
  // Vue.options ={}    Vue.mixin({})   {created:[a,b,组件上的]}
  function mergeOptions(parent, child) {
    var options = {};
    // console.log(parent) {created:[a]}
    //遍历父亲：可能是父亲有，儿子没有
    for (var key in parent) {
      //父亲和儿子都有在这里进行处理
      mergeField(key);
    }
    //儿子有父亲没有
    for (var _key in child) {
      //将儿子多的赋值到父亲上
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }
    function mergeField(key) {
      //合并字段 created
      //根据key  不同的策略进行合并
      // 比如 {key:parent[key] child[key]}
      //注意 我们这个key可能是一个钩子函数
      // console.log(child)
      if (strats[key]) {
        // strats.created = 
        options[key] = strats[key](parent[key], child[key]); //[a]
      } else {
        //默认合并策略
        options[key] = child[key] || parent[key];
      }
      //(1) {created:[a,b]} 
    }

    return options;
  }

  //初始化
  function initMixin(Vue) {
    //面试题  全局组件和局部组件的区别
    //局部组件是不是在等前的组件中可以使用
    //全局组件在项目中任何地方都可以使用 原因 在组件初始化的时候 合并进来了

    Vue.prototype._init = function (options) {
      //el 显示页面
      //data  数据初始化
      //
      // console.log(options)
      var vm = this;
      // 注意 ：组件中都有一个 vue
      vm.$options = mergeOptions(Vue.options, options); // 需要将用户自定义的options 合并 谁和谁合并
      //初始化 状态 （将数据做一个初始化的劫持，当我改变数据时应跟新视图）
      //vue组件中有很多状态 data,props watch computed
      // console.log(vm.$options)
      callHook(vm, "beforeCreate");
      initState(vm); //初始化状态
      callHook(vm, "created");
      //vue核心特点  响应式数据原理
      //vue 是一个什么样的框架 mvvm
      //数据变化视图更新，视图变化数据会被影响（mvvm） 不能跳过数据去更新视图，$ref   

      // 如果当前 有el 属性说明要渲染模块
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    //创建 $mount 方法
    Vue.prototype.$mount = function (el) {
      //进行挂载操作
      var vm = this;
      var options = vm.$options; //
      // console.log(el)
      //获取元素
      el = document.querySelector(el);
      vm.$el = el;
      //现在我们就希望渲染页面
      //1: 如果有render  渲染render
      if (!options.render) {
        // 没有
        var template = options.template;
        //1.1 需要判断有没有template
        if (!template && el) {
          //1.2 获取el 内容
          //DOM接口的outerHTML属性获取描述元素（包括其后代）的序列化HTML片段。它也可以设置为用从给定字符串解析的节点替换元素。
          //innerHTML 里面的元素
          template = el.outerHTML;
        }
        //  console.log(template)
        //获取到元素(template模块)，将元素转换成render
        var render = compileToFunction(template);
        options.render = render;
      }
      // console.log(options.render) // 渲染到页面的都是这个render方法
      //需要挂载这个组件
      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    //在vue 上创建这些方法  _c,_v,_s 作用创建虚拟节点  用对象来描述dom
    Vue.prototype._c = function () {
      //创建元素
      return createElement.apply(void 0, arguments);
    };
    Vue.prototype._s = function (val) {
      // stringify  字符串
      //注意值的类型
      return val == null ? "" : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };
    Vue.prototype._v = function (text) {
      // 创建虚拟文本元素
      return createTextVnode(text);
    };
    Vue.prototype._render = function () {
      //将 render函数编程虚拟节点
      //获取render 函数
      var vm = this;
      var render = vm.$options.render;
      //执行render 函数
      var vnode = render.call(this);
      // console.log(vnode) //展示生成的vnode,就描述的dom结构 好处
      return vnode;
    };
  }
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, data, data.key, children);
  }
  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  //用来产生虚拟dom
  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function initGlobalApi(Vue) {
    // 源码当中 你所有定义的全局方法都是 放在
    // Vue.options = {} //Vue.component Vue.diretive
    Vue.options = {}; // {created:[a,b,]}
    Vue.mixin = function (mixin) {
      // console.log(mixin) 
      //实现合并 就是合并对象 （我先考虑生命周期）不考虑其他的合并 data,computed watch
      this.options = mergeOptions(this.options, mixin);
      //  console.log( Vue.options,99999)
    };
    //组件
    Vue.options.components = {};
    Vue.component = function (id, componentDef) {
      componentDef.name = componentDef.name || id;
      console.log(componentDef);
      console.log(this);
      componentDef = this.extend(componentDef); //返回一个实例
      console.log(componentDef);
      this.options.components[id] = componentDef;
      console.log(this.options);
    };
    Vue.extend = function (options) {
      var spuer = this;
      var Sub = function vuecomponet(opts) {
        //opts 子组件的实例
        //初始化
        this._init(opts);
      };
      //属性如何处理??
      //子组件继承父组件中的属性Vue 类的继承
      Sub.prototype = Object.create(spuer.prototype);
      //问题 子组件中this的执行
      Sub.prototype.constructor = Sub;
      //重点,将父组件的属性与子组件的属性合并到一起
      Sub.options = mergeOptions(this.options, options);
      console.log(Sub.options);
      return Sub;
    };
  }

  //  options:{created:[a,b,vue1]}

  function Vue(options) {
    this._init(options);
  }
  //这些方法都是原型上的方法
  initMixin(Vue); //给原型上添加一个  init 方法
  liftcycleMixin(Vue); //混合生命周期 渲染
  renderMixin(Vue); // _render
  stateMixin(Vue); // 给 vm 添加  $nextTick
  //静态方法  ，也是全局方法  Vue.component .Vue.extend Vue.mixin ..
  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
