(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
    //数据结构 栈
    var stack = []; //
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
      var element = createASTElement(tag, attrs);
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
      text = text.replace(/s/g, '');
      if (text) {
        createParent.children.push({
          type: 3,
          text: text
        });
      }
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
        //html 为空时结束符
        //判断标签 <>
        var textEnd = html.indexOf('<'); //0
        console.log(html, textEnd, 'this is textEnd');
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
        console.log(start, 'this is start');
        // match() 方法检索字符串与正则表达式进行匹配的结果
        // console.log(start)
        //创建ast 语法树
        if (start) {
          var match = {
            tagName: start[1],
            attrs: []
          };
          console.log(match, 'match match');
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

      console.log(root);
      return root;
    }
    function compileToFunction(el) {
      // console.log(el)
      var ast = parseHTML(el);
      console.log(ast, 'ast ast');
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
        console.log(args); //[{b:6}]
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
        console.log(inserted);
        var ob = this.__ob__; //
        if (inserted) {
          ob.observeArray(inserted);
          //对添加的对象进行劫持
        }

        return result;
      };
    });

    // 当我们调用该方法时，可以传入多个参数，并且这些参数将会被传递给 oldArrayProtoMethods[item] 中对应的方法进行处理。让我们以一个简单的例子来说明这个过程：

    // 假设 methods 数组中有一个元素为 'push'，即 methods = ['push']。代码会将 push 方法添加到 ArrayMethods 对象中，并创建一个相应的函数，这个函数实际上是 oldArrayProtoMethods.push 的包装函数。

    // 当我们调用 ArrayMethods.push(1, 2, 3) 时，这里的参数 1, 2, 3 将会作为 args 的值，被传递给这个函数。在函数中，我们可以通过 console.log(args) 来打印参数，这将会输出 [1, 2, 3]。

    // 接下来，我们调用 oldArrayProtoMethods.push.apply(this, args)，这里的 this 表示当前的上下文。apply 方法将会把 args 数组解包成独立的参数，并传递给 oldArrayProtoMethods.push 方法。因此，我们实际上是调用了 oldArrayProtoMethods.push(1, 2, 3)。

    // 最后，在包装函数中，将会返回 oldArrayProtoMethods.push 方法的返回值。

    // 所以，args 的作用是接收传入的参数，并将其传递给原始方法进行处理。这样就实现了在调用 ArrayMethods 对象的方法时，会先将参数打印出来，并将这些参数传递给原始的方法进行处理的功能。

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
          value: this
        });
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
      }
      _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          var keys = Object.keys(data);
          for (var i = 0; i < keys.length; i++) {
            //对象我们的每个属性进行劫持
            var key = keys[i];
            var value = data[key];
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
      observer(value); //深度代理
      Object.defineProperty(data, key, {
        get: function get() {
          // console.log('获取')
          return value;
        },
        set: function set(newValue) {
          // console.log('设置')
          if (newValue == value) {
            return;
          }
          observer(newValue);
          value = newValue;
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
      observer(data);
    }
    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }
    //data{} (1)对象(2)数组 { a:{b:1},list:[1,2,3],arr:[{}]]}

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        // console.log(options)
        var vm = this;
        //options为
        vm.$options = options;
        //初始化状态
        initState(vm);

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
        var options = vm.$options;
        if (!options.render) {
          //没有
          var template = options.template;
          if (!template && el) {
            //获取html
            el = el.outerHTML;
            console.log(el, 'this is init.js attrs:el');
            //<div id="app">Hello</div>
            //变成ast语法树
            var ast = compileToFunction(el);
            console.log(ast, 'this is ast');
            //render()

            //
          }
        }
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

    function Vue(options) {
      // console.log(options)
      //初始化
      this._init(options);
    }
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
