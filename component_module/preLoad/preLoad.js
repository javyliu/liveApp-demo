;(function(name,definition){
	// 检测有模块加载器
	var hasDefine = typeof define === 'function';

	// 检测是否有普通模块加载-node
	var hasExports = typeof module !== 'undefined' && module.exports;

	// 封装模块
	if (hasDefine) {
			define(definition);
	} else if (hasExports) {
			module.exports = definition();
	} else {
			this[name] = definition();
	}
})('PreLoad', function(){

	/**
	 * @method isType()
	 * @description 判断类型
	 *
	 * @param {string} type 数据类型
	 *
	 * @return {boolean} 指定参数以否是指定类型
	 *
	 * @example
	 * ```js
	 *   var a = [];
	 *   isArray(a)  --> true 
	 *   isString(a) --> false
	 *
	 *   var b = document.createElement('div');
	 *   isWindow(b) --> false
	 *   isElement(b) --> true
	 */
	function isType(type) {
		return function(obj) {
			return Object.prototype.toString.call(obj) === "[object " + type + "]";
	  	}
	}
	var isObject = isType("Object");
	var isString = isType("String");
	var isArray = Array.isArray || isType("Array");
	var isFunction = isType("Function");
	var isWindow = function(obj) {
		return obj != null && obj == obj.window
	}
	var isDocument = function(obj) {
		return obj != null && obj.nodeType == obj.DOCUMENT_NODE
	}
	var isElement = function(obj){
		return obj != null && obj.nodeType == obj.ELEMENT_NODE
	}
	var likeArray = function (obj) {
    	return typeof obj.length == 'number'
 	}

 	/**
 	 * @method obj.length()
 	 * @description 计算对象的长度（属性）
 	 *
 	 * @example
 	 * var a = {
 	 *   1 : 1,
 	 *   2 : 2
 	 * }
 	 * a.length == 2 // true
 	 */
 	Object.prototype.length = function() {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

 	/**
 	 * @method _forEach()
 	 * @description 遍历元素，分别对于回调函数处理
 	 * 
 	 * @param {Array | element | object} elements 需要遍历处理的元素
 	 * @param {function} callback 回调处理函数
 	 *
 	 * @return {Array | element | object} 返回当前元素
 	 */
 	_forEach = function(elements, callback) {
	    var i, key
	    if (likeArray(elements)) {
	     	for (i = 0; i < elements.length; i++) {
	     		if (callback.call(elements[i], i, elements[i]) === false) return elements	
	     	}
	    } else {
			for (key in elements) {
				if (callback.call(elements[key], key, elements[key]) === false) return elements	
			}
	    }

	    return elements
	}

	// 正常判断图片路径
	var isImgUrl = /(^data:.*?;base64)|(\.(jpg|png|gif)$)/;

 	/**
	 * @class PreLoad
	 * @description 图片预加载组件类
	 *
	 * @param {string | HTMLAudioElement} audio 音频对象节点或者地址值
	 * @param {string | isElement} wrapper 操作节点对象或者选择器
	 * @param {object} opts 类实例化传入属性
	 *
	 * @example
	 * ```js
	 *  var _preLoad = new PreLoad(['1.png','2.gif','3.jpg'], '.wrapper', {
	 *	 	'vision' : '2.0'
	 *	});
	 *
	 * ```js - opts
	 * -自定义预加载图片前缀 prefix
	 * -自定义预加载图片版本 vision
	 * -自定义事件 PreLoadBefore、preLoadComplete、preLoadProgress
	 * -自定义事件集合 events = [
	 * 					'start' : fn
	 * 				]
	 */
	function PreLoad(items, node, opts) {
		if (!items || !isArray(items) || !likeArray(items)) {
			throw new Error('传入的图片集合不正确，确保是数组或者是对象；')
		}

		var argsLen = arguments.length;

		// 传入2个参数
		if (argsLen === 2) {
			if ( isElement(node) || isString(node) ) {
				// PreLoad(items, node)
				opts = undefined;
			} else if ( !isElement(node) && isObject(node) ) {
				// PreLoad(items, opts)
				opts = node;
				node = undefined;
			}
		}

		// 预加载图片集合
		this.imgItems = items;
		this.imgPreUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC';

		// 操作对象设置
    	if ( typeof node == 'undefined' || node == '' ) {
			this.progressNode = document.createElement('div');
			document.body.appendChild(this.progressNode);
		} else {
			this.progressNode = isString(node) ? document.querySelector(node) : node;
		}

		// 默认控制-属性
		this.events = {}; 
		this.prefix = ''; // 默认置前补充
		this.vision = '1.0'; // 默认图片版本
		this.contentText =  this; // 默认观察看事件上下文
		this.progressInit = true; // 默认触发进度

		// 传递参数
        for (i in opts) {
            this[i] = opts[i];
        }

		this.load();
	}

	PreLoad.prototype = {
		/**
         * @method emit()
         * @description 观察者事件触发类型
         *
         * @param {string} type 事件类型
         */
        emit : function (type) {
            if ( !this.events[type] ) {
                return;
            }

            var i = 0,
                l = this.events[type].length;

            if ( !l ) {
                return;
            }

            for ( ; i < l; i++ ) {
                this.events[type][i].apply(this, [].slice.call(arguments, 1)); 
            }
        },

        /**
         * @method on()
         * @description 对应观察者事件订阅回调函数
         *
         * @param {string} type 事件类型
         * @param {function} fn 订阅回调函数
         */
        on : function (type, fn) {
            if ( !this.events[type] ) {
                this.events[type] = [];
            }

            this.events[type].push(fn);
        },

        /**
         * @method load()
         * @description 图片集合加载
         *
         * @PreLoadBefore 触发预加载之前观察者事件
         * @PreLoadProgress 触发预加载进度观察者事件
         * @PreLoadComplete 触发预加载完成观察者事件
         */
        load : function(){
        	var count = 0;
			var items = this.imgItems;
			var length = this.imgItems.length;
			var that = this;

			that.emit('preLoadBefore');

			_forEach(items, function(i, item){
				// 判断图片不正确，上报并替换成预备的
				if (!isImgUrl.test(item)) {
					var index = i + 1;
					console.log('第' + index + '个图片地址值不正确');
					item = this.imgPreUrl;
				}

				var img = new Image;
				var src = that.prefix + item + (that.vision ? '?vision=' + that.vision : '');

				img.onload = img.onerror = img.onabort = function() {
				 	if(++count === length) {
				 		that.emit('preLoadComplete');
				 	}

				 	if (that.progressInit) {
						that.progressNode.innerText = Math.floor(100*count/length) + '%';
				 	}
					that.emit('preLoadProgress');
				}

				img.src = src;
			})
        }
	}

	return PreLoad;
})

