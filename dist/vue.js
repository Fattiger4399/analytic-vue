(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    //对象合并 {created:[]}
    var HOOKS = ["beforeCreated", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestory", "destroyed"];
    // 策略模式
    var starts = {};
    starts.data = function (parentVal, childVal) {
      return childVal;
    }; //合并data
    starts.computed = function () {}; //合并computed
    starts.watch = function () {}; //合并watch
    starts.methods = function () {}; //合并methods
    //遍历生命周期
    HOOKS.forEach(function (hooks) {
      //是不是傻了?这里是传方法,不是调方法
      starts[hooks] = mergeHook;
      // console.log(starts,)
    });

    function mergeHook(parentVal, childVal) {
      if (childVal) {
        if (parentVal) {
          //把子元素合并进去
          return parentVal.concat(childVal);
        } else {
          return [childVal]; //[a]
        }
      } else {
        return parentVal;
      }
    }
    function mergeOptions(parent, child) {
      // console.log(parent,child,'||this is parent and child in mergeOptions()')
      var options = {};
      //判断父亲
      for (var key in parent) {
        // console.log(key,'||this is key')
        mergeField(key);
      }
      //判断儿子
      for (var _key in child) {
        // console.log(key,'||this is key')
        mergeField(_key);
      }
      function mergeField(key) {
        //根据key 策略模式
        if (starts[key]) {
          //created {created:[a]}
          options[key] = starts[key](parent[key], child[key]);
        } else {
          options[key] = child[key];
        }
      }
      return options;
    }

    function initGlobApi(Vue) {
      //源码
      //Vue.options ={created:[a,b,c],watch:{a,b}}
      Vue.options = {};
      Vue.Mixin = function (mixin) {
        // {}
        //源码
        //{created:[a,b,c],watch:[a,b]}
        //对象的合并
        // console.log(999)
        this.options = mergeOptions(this.options, mixin);
        // console.log(Vue.options,"||this is vue.options")
      };
    }

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
    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    //genPorps()方法解析属性
    function genPorps(attrs) {
      // console.log(attrs)
      var str = '';
      //对象
      var _loop = function _loop() {
        var attr = attrs[i];
        if (attr.name === 'style') {
          // 
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              val = _item$split2[1];
            // console.log(key, val, "//this is [key,val]")
            obj[key] = val;
          });
          attr.value = obj;
        }
        //拼接
        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
        // console.log(str, '|this is str')
        // console.log(`{${str.slice(0,-1)}}`)
      };
      for (var i = 0; i < attrs.length; i++) {
        _loop();
      }
      //首字符到倒数第二个字符,即去掉标点符号
      return "{".concat(str.slice(0, -1), "}");
    }

    //处理子节点
    function genChildren(el) {
      var children = el.children; //获取元素节点的子节点
      //如果存在子节点，则递归调用 gen() 函数处理每个子节点，并用逗号拼接子节点的代码。
      if (children) {
        //返回子节点代码的字符串。
        return children.map(function (child) {
          return gen(child);
        }).join(',');
      }
    }
    //
    function gen(node) {
      //1.元素  2.div  tip:_v表示文本
      // console.log(node, "this is node")
      //如果节点是元素节点，递归调用 generate() 函数处理该节点，并返回结果。
      if (node.type === 1) {
        return generate(node);
      } else {
        //文本 
        //(1) 只是文本 hello  (2){{}}
        var text = node.text; //获取文本
        //转化
        if (!defaultTagRE.test(text)) {
          return "_v(".concat(JSON.stringify(text), ")");
        }
        //(2)带插值表达式{{}}
        //文本包含插值表达式，使用正则表达式 defaultTagRE 
        //查找所有 {{}} 形式的插值表达式，并解析成可执行的代码片段。
        var tokens = [];
        //lastIndex 需要清零 否则test匹配会失败
        var lastindex = defaultTagRE.lastIndex = 0;
        //match保存获取结果
        var match;
        while (match = defaultTagRE.exec(text)) {
          // console.log(match, "|this is match")
          var _index = match.index;
          if (_index > lastindex) {
            tokens.push(JSON.stringify(text.slice(lastindex, _index))); //内容
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          //lastindex处理文本长度
          lastindex = _index + match[0].length;
        }
        //此处if用于处理`Hello{{msg}} xxx`中的xxx
        if (lastindex < text.slice(lastindex)) {
          tokens.push(JSON.stringify(text.slice(lastindex, index))); //内容
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
    function generate(el) {
      // console.log(el,'|this is el')
      var children = genChildren(el);
      // console.log(children, "|this is children")
      var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genPorps(el.attrs)) : 'undefined', ",").concat(children ? "".concat(children) : '', ")");
      // console.log(code, '|this is code')
      return code;
    }

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
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    //属性 例如:  {id=app}
    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //标签名称
    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //<span:xx>
    var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头
    var startTagClose = /^\s*(\/?)>/; //匹配结束标签 的 >
    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //结束标签 例如</div>
    var root; //根元素
    var createParent; //当前元素的父亲
    var stack = [];
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        attrs: attrs,
        children: [],
        type: 1,
        parent: null
      };
    }
    function start(tag, attrs) {
      //开始标签
      var element = createASTElement(tag, attrs); //生成一个开始标签元素
      //查看root根元素是否为空
      //若是,将该元素作为根
      //非原则
      if (!root) {
        root = element;
      }
      createParent = element;
      stack.push(element);
      // console.log(tag, attrs, '开始的标签')
    }

    function charts(text) {
      //获取文本
      // console.log(text, '文本')
      text = text.replace(/\s/g, '');
      if (text) {
        createParent.children.push({
          type: 3,
          text: text
        });
      }
      // console.log(stack,'stack')
    }

    function end(tag) {
      //结束的标签
      var element = stack.pop();
      createParent = stack[stack.length - 1];
      if (createParent) {
        //元素闭合
        element.parent = createParent.tag;
        createParent.children.push(element);
      }
      // console.log(tag, '结束标签')
    }

    function parseHTML(html) {
      while (html) {
        //html 为空时,结束
        //判断标签 <>
        var textEnd = html.indexOf('<'); //0
        // console.log(html,textEnd,'this is textEnd')
        if (textEnd === 0) {
          //标签
          // (1) 开始标签
          var startTagMatch = parseStartTag(); //开始标签的内容{}
          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }
          // console.log(endTagMatch, '结束标签')
          //结束标签
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]);
            continue;
          }
        }
        var text = void 0;
        //文本
        if (textEnd > 0) {
          // console.log(textEnd)
          //获取文本内容
          text = html.substring(0, textEnd);
          // console.log(text)
        }

        if (text) {
          advance(text.length);
          charts(text);
          // console.log(html)
        }
      }

      function parseStartTag() {
        //
        var start = html.match(startTagOpen); // 1结果 2false
        // console.log(start,'this is start')
        // match() 方法检索字符串与正则表达式进行匹配的结果
        // console.log(start)
        //创建ast 语法树
        if (start) {
          var match = {
            tagName: start[1],
            attrs: []
          };
          // console.log(match,'match match')
          //删除 开始标签
          advance(start[0].length);
          //属性
          //注意 多个 遍历
          //注意>
          var attr; //属性 
          var _end; //结束标签
          //attr=html.match(attribute)用于匹配
          //非结束位'>',且有属性存在
          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            // console.log(attr,'attr attr'); //{}
            // console.log(end,'end end')
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
            //匹配完后,就进行删除操作
          }
          //end里面有东西了(只能是有">"),那么将其删除
          if (_end) {
            // console.log(end)
            advance(_end[0].length);
            return match;
          }
        }
      }
      function advance(n) {
        // console.log(html)
        // console.log(n)
        html = html.substring(n);
        // substring() 方法返回一个字符串在开始索引到结束索引之间的一个子集，
        // 或从开始索引直到字符串的末尾的一个子集。
        // console.log(html)
      }
      // console.log(root)
      return root;
    }

    function compileToFunction(el) {
      //1. 将html元素变为ast语法树
      var ast = parseHTML(el);
      //2. ast语法树变成render函数
      //(1) ast语法树变成字符串
      //(2) 字符串变成函数
      var code = generate(ast); // _c _v _s
      // console.log(code)
      //3.将render字符串变成函数
      var render = new Function("with(this){return ".concat(code, "}"));
      // console.log(render,'this is render')
      return render;
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

    var oldArrayProtoMethods = Array.prototype;
    var ArrayMethods = Object.create(oldArrayProtoMethods);
    var methods = ["push", "pop", "unshift", "shift", "splice"];
    methods.forEach(function (item) {
      ArrayMethods[item] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // console.log(args)
        var result = oldArrayProtoMethods[item].apply(this, args);
        // console.log(args) //[{b:6}]
        //问题:数组追加对象的情况
        var inserted;
        switch (item) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.splice(2);
            break;
        }
        // console.log(inserted)
        var ob = this.__ob__; //
        if (inserted) {
          ob.observeArray(inserted);
          //对添加的对象进行劫持
        }

        ob.dep.notify();
        return result;
      };
    });

    // 当我们调用该方法时，可以传入多个参数，并且这些参数将会被传递给 oldArrayProtoMethods[item] 中对应的方法进行处理。让我们以一个简单的例子来说明这个过程：

    // 假设 methods 数组中有一个元素为 'push'，即 methods = ['push']。代码会将 push 方法添加到 ArrayMethods 对象中，并创建一个相应的函数，这个函数实际上是 oldArrayProtoMethods.push 的包装函数。

    // 当我们调用 ArrayMethods.push(1, 2, 3) 时，这里的参数 1, 2, 3 将会作为 args 的值，被传递给这个函数。在函数中，我们可以通过 console.log(args) 来打印参数，这将会输出 [1, 2, 3]。

    // 接下来，我们调用 oldArrayProtoMethods.push.apply(this, args)，这里的 this 表示当前的上下文。apply 方法将会把 args 数组解包成独立的参数，并传递给 oldArrayProtoMethods.push 方法。因此，我们实际上是调用了 oldArrayProtoMethods.push(1, 2, 3)。

    // 最后，在包装函数中，将会返回 oldArrayProtoMethods.push 方法的返回值。

    // 所以，args 的作用是接收传入的参数，并将其传递给原始方法进行处理。这样就实现了在调用 ArrayMethods 对象的方法时，会先将参数打印出来，并将这些参数传递给原始的方法进行处理的功能。

    var id$1 = 0;
    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);
        this.id = id$1++;
        this.subs = [];
      }
      //收集watcher
      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          //我希望watcher可以存放dep
          //双向记忆
          Dep.target.addDep(this);
        }
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          this.subs.push(watcher);
        }
        //更新watcher
      }, {
        key: "notify",
        value: function notify() {
          this.subs.forEach(function (watcher) {
            watcher.updata();
          });
        }
      }]);
      return Dep;
    }(); //添加watcher
    Dep.target = null;
    function pushTarget(watcher) {
      Dep.target = watcher;
    }
    function popTarget() {
      Dep.target = null;
    }

    function observer(data) {
      // console.log(data)

      //判断数据
      if (_typeof(data) != 'object' || data == null) {
        return data;
      }
      //对象通过一个类
      return new Observer(data);
    }
    var Observer = /*#__PURE__*/function () {
      function Observer(value) {
        _classCallCheck(this, Observer);
        Object.defineProperty(value, "__ob__", {
          enumerable: false,
          configurable: true,
          value: this
        });
        // console.log(value,"this is value")
        this.dep = new Dep(); //1.给所有对象类型增加一个dep []
        //判断数据
        // console.log(value)
        if (Array.isArray(value)) {
          value.__proto__ = ArrayMethods;
          // console.log("shuzhu")
          //如果你是数组对象
          this.observeArray(value);
        } else {
          this.walk(value);
        }
        // console.log(this.dep)
      }
      _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          var keys = Object.keys(data);
          for (var i = 0; i < keys.length; i++) {
            //对象我们的每个属性进行劫持
            var key = keys[i];
            var value = data[key];
            // console.log(data,"||data")
            // console.log(key,"||key")
            // console.log(value,"||value")
            defineReactive(data, key, value);
          }
        }
      }, {
        key: "observeArray",
        value: function observeArray(value) {
          //[{a:1}]
          for (var i = 0; i < value.length; i++) {
            observer(value[i]);
          }
        }
      }]);
      return Observer;
    }(); //对对象中的属性进行劫持
    function defineReactive(data, key, value) {
      var childDep = observer(value); //深度代理
      // console.log(childDep)
      var dep = new Dep(); //给每一个对象添加dep
      Object.defineProperty(data, key, {
        get: function get() {
          // console.log('获取')
          // console.log(Dep,"||this is Dep")
          // console.log(Dep.target,"||this is Dep.target")
          if (Dep.target) {
            // console.log("dep.depend()被触发")
            dep.depend();
            if (childDep.dep) {
              childDep.dep.depend(); //数组收集
            }
          }
          // console.log(dep,"||this is dep")
          return value;
        },
        set: function set(newValue) {
          // console.log('设置')
          if (newValue == value) {
            return;
          }
          observer(newValue);
          value = newValue;
          dep.notify();
        }
      });
    }

    //vue2   Object.defineProperty 缺点 对象中的一个属性

    //{a:{}},list[]}

    //数组{list:[1,2,3],arr:[{a:1}]}
    //ipo切片思想 
    // 方法函数劫持,重写数组方法 arr.push()

    function initState(vm) {
      var opts = vm.$options;
      // console.log(opts)
      //判断
      if (opts.props) ;
      if (opts.data) {
        initData(vm);
      }
      if (opts.watch) ;
      if (opts.computed) ;
      if (opts.methods) ;
    }

    //vue2 对data初始化
    function initData(vm) {
      // console.log('data初始化') //两种情况 (1)对象 (2)函数
      var data = vm.$options.data;
      data = vm._data = typeof data === "function" ? data.call(vm) : data;
      //data数据进行劫持
      //将data上的所有属性代理到实例上{a:1,b:2}
      // for(let i=0;i<data.length;i++){
      //     proxy(vm,"_data",data[i])
      // }
      // 另一种写法
      for (var key in data) {
        proxy(vm, "_data", key);
      }
      // console.log(data)
      // console.log(observer(data))
      observer(data);
    }
    //Vue实例 , '_data','msg'
    function proxy(vm, source, key) {
      // console.log(vm,source,key,'fuck')
      Object.defineProperty(vm, key, {
        get: function get() {
          console.log();
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }
    //data{} (1)对象(2)数组 { a:{b:1},list:[1,2,3],arr:[{}]]}

    function patch(oldVnode, vnode) {
      // console.log(oldVnode,vnode)
      //(1) 创建新DOM
      var el = createEl(vnode);
      // console.log(el)
      //(2) 替换 1) 获取父节点  2)插入 3)删除
      var parentEL = oldVnode.parentNode;
      parentEL.insertBefore(el, oldVnode.nextsibling);
      parentEL.removeChild(oldVnode);
      return el;
    }
    function createEl(vnode) {
      //vnode 拆解
      var tag = vnode.tag;
        vnode.data;
        vnode.key;
        var children = vnode.children,
        text = vnode.text;
      //判断标签是否为字符串 0:创建标签元素,递归处理子节点   1:文本节点
      if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        if (children.length > 0) {
          children.forEach(function (child) {
            //递归
            vnode.el.appendChild(createEl(child));
          });
        }
      } else {
        vnode.el = document.createTextNode(text);
      }
      return vnode.el;
    }

    var id = 0;
    var watcher = /*#__PURE__*/function () {
      //cb表示回调函数,options表示标识
      function watcher(vm, updataComponent, cb, options) {
        _classCallCheck(this, watcher);
        //(1)将
        this.vm = vm;
        this.exprOrfn = updataComponent;
        this.cb = cb;
        this.options = options;
        this.id = id++;
        this.deps = []; //watcher存放 dep
        this.depsId = new Set();
        //判断
        if (typeof updataComponent === 'function') {
          this.getter = updataComponent;
        }
        //更新视图
        this.get();
      }
      _createClass(watcher, [{
        key: "addDep",
        value: function addDep(dep) {
          //去重
          var id = dep.id;
          if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
          }
        }
        //初次渲染
      }, {
        key: "run",
        value: function run() {
          this.getter();
        }
      }, {
        key: "get",
        value: function get() {
          // console.log(this, '||this is this')
          pushTarget(this); //给dep 添加  watcher
          // console.log("进完")
          this.getter();
          // console.log("this.getter执行完毕")
          popTarget(); //给dep 去除 watcher
          // console.log("出完")
        }
        //更新
      }, {
        key: "updata",
        value: function updata() {
          // this.getter()
          //注意:不在数据更新后每次都调用get方法,get方法会重新渲染
          //缓存
          queueWatcher(this);
        }
      }]);
      return watcher;
    }();
    var queue = []; // 将需要批量更新的watcher 存放到一个列队中
    var has = {};
    var pending = false;
    function queueWatcher(watcher) {
      var id = watcher.id; // 每个组件都是同一个 watcher
      //    console.log(id) //去重
      if (has[id] == null) {
        //去重
        //列队处理
        queue.push(watcher); //将wacher 添加到列队中
        has[id] = true;
        //防抖 ：用户触发多次，只触发一个 异步，同步
        if (!pending) {
          //异步：等待同步代码执行完毕之后，再执行
          setTimeout(function () {
            queue.forEach(function (item) {
              return item.run();
            });
            queue = [];
            has = {};
            pending = false;
          }, 0);
          // nextTick(flushWatcher) //  nextTick相当于定时器
        }

        pending = true;
      }
    }

    //收集依赖 vue dep watcher data:{name,msg}
    //dep:dep 和 data 中的属性是一一对应
    //watcher:监视的数据有多少个,就对应有多少个watcher
    //dep与watcher: 一对多 dep.name = [w1,w2]

    //实现对象的收集依赖

    function mounetComponent(vm, el) {
      //源码
      callHook(vm, "beforeMounted");
      //(1)vm._render() 将 render函数变成vnode
      //(2)vm.updata()将vnode变成真实dom
      var updataComponent = function updataComponent() {
        vm._updata(vm._render());
      };
      new watcher(vm, updataComponent, function () {}, true);
      callHook(vm, "mounted");
    }
    function lifecycleMixin(Vue) {
      Vue.prototype._updata = function (vnode) {
        // console.log(vnode)
        var vm = this;
        //两个参数 ()
        vm.$el = patch(vm.$el, vnode);
        // console.log(vm.$el, "||this is vm.$el")
      };
    }

    //(1) render()函数 =>vnode =>真实dom 

    //生命周期调用
    function callHook(vm, hook) {
      // console.log(vm.options,"||this is vm.options")
      // console.log(hook,"||this is hook")
      // console.log(vm.$options,"||this is vm.$options")
      var handlers = vm.$options[hook];
      if (handlers) {
        for (var i = 0; i < handlers.length; i++) {
          handlers[i].call(this); //改变生命周期中的指向 
        }
      }
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        // console.log(options)
        var vm = this;
        //options为
        // console.log(Vue)
        // console.log(Vue.options, options)
        //mergeOptions()合并方法最终得到的选项将作为Vue实例的 $options 属性，
        //包含了所有经过合并的选项
        vm.$options = mergeOptions(Vue.options, options);
        // console.log(vm.$options)

        callHook(vm, 'beforeCreated');
        //初始化状态
        initState(vm);
        callHook(vm, 'created');

        // 渲染模板 el
        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
      //创建 $mount

      Vue.prototype.$mount = function (el) {
        // console.log(el)
        //el template render
        var vm = this;
        el = document.querySelector(el); //获取元素
        vm.$el = el;
        var options = vm.$options;
        // console.log(vm.$options,'||this is vm.$options')
        // console.log(this,'||this is this?')
        if (!options.render) {
          //没有
          var template = options.template;
          if (!template && el) {
            //获取html
            el = el.outerHTML;
            // console.log(el,'this is  init.js attrs:el')
            //<div id="app">Hello</div>
            //变成ast语法树
            var render = compileToFunction(el);
            // console.log(render,'||this is render from compileToFunction')
            //(1)render函数变为 vnode (2)vnode变成真实DOM放到页面上去
            options.render = render;
            //
          }
        }
        //挂载组件
        mounetComponent(vm);
      };
    }

    //ast语法树 {}    vnode {}
    //<div id="app">Hello{{msg}}</div>
    /**
     * {
     * tag:'div'
     * attrs:[{id:"app"}]
     * children:[{tag:null,text:Hello},{tag:'div'}]
     * }
     * 
     * 
     * 
     */

    function renderMixin(Vue) {
      Vue.prototype._c = function () {
        //创建标签
        return createElement.apply(void 0, arguments);
      };
      Vue.prototype._v = function (text) {
        //文本
        return createText(text);
      };
      Vue.prototype._s = function (val) {
        return val == null ? "" : _typeof(val) === 'object' ? JSON.stringify(val) : val;
      };
      Vue.prototype._render = function () {
        //render函数变成 vnode
        var vm = this;
        var render = vm.$options.render;
        // console.log(render,'||this is render')
        // console.log(this,"||this is this")
        var vnode = render.call(this);
        // console.log(vnode,'||this is vnode')
        return vnode;
      };
    }
    //vnode只可以描述节点

    //创建元素
    function createElement(tag) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      return vnode(tag, data, data.key, children);
    }
    //创建文本
    function createText(text) {
      return vnode(undefined, undefined, undefined, undefined, text);
    }
    //创建vnode
    function vnode(tag, data, key, children, text) {
      return {
        tag: tag,
        data: data,
        key: key,
        children: children,
        text: text
      };
    }

    function Vue(options) {
      // console.log(options,'this.options')
      //初始化
      this._init(options);
    }
    initMixin(Vue);
    lifecycleMixin(Vue); //添加生命周期
    renderMixin(Vue); //添加_render
    //全局方法
    initGlobApi(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
