/**
 * 音频资源管理组件
 * @author cation
 * @email shoe11414255@qq.com
 */
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
})('Media', function(){

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
		return obj != null && obj instanceof window.Element && obj.nodeType == obj.DOCUMENT_NODE
	}
	var isElement = function(obj){
		return obj != null && obj instanceof window.Element && obj.nodeType == obj.ELEMENT_NODE
	}
	var likeArray = function (obj) {
    	return typeof obj.length == 'number'
 	}

	/**
	 * @method addEvent()
	 * @description 给指定Dom对象绑定事件
	 *
	 * @param {documentDom} el 需要绑定事件的DOM对象
	 * @param {string} type 绑定的事件类型
	 * @param {function} fn 事件执行的回调函数
	 * @param {boolean} capture 判断是否事件冒泡
	 */
	function addEvent(el, type, fn, capture) {
		capture = !!capture ? true : false;

		if (el.addEventListener){
            el.addEventListener(type, fn, capture);
        } else if (el.attachEvent){
            el.attachEvent("on" + type, fn);
        } else {
            el["on" + type] = fn;
        }
	}

	/**
	 * @method removeEvent()
	 * @description 给指定Dom对象解除事件
	 *
	 * @param {documentDom} el 需要解除事件的DOM对象
	 * @param {string} type 解除的事件类型
	 * @param {function} fn 事件执行的回调函数
	 * @param {boolean} capture 判断是否事件冒泡
	 */
	function removeEvent(el, type, fn, capture) {
		capture = !!capture ? true : false;

        if (el.removeEventListener){
            el.removeEventListener(type, fn, capture);
        } else if (el.detachEvent){
            el.detachEvent("on" + type, fn);
        } else {
            el["on" + type] = null;
        }
	}
	
	// 音频对象储存为window下，在控制时调用
	window.__Media = []; 
	// 正常判断音频--url | HTMLAudioElement
	var isAudio = /(HTMLAudioElement)|(\.(ogg|mp3|wav)$)/; 

	/**
	 * @class Media
	 * @description 音频audio管理类
	 *
	 * @param {string | HTMLAudioElement} audio 音频对象节点或者地址值
	 * @param {string | isElement} wrapper 操作节点对象或者选择器
	 * @param {object} opts 类实例化传入属性
	 *
	 * @example
	 * ```js
	 *  var _media = new Media(audio, '.wrapper', {
	 *	 	'audioAutoPlay' : true
	 *	});
	 *
	 * ```js - opts
	 * -自定义音频属性 audioLoop、audioPreLoad、audioAutoPlay
	 * -自定义操作元素事件 wrapperEvent
	 * -自定义操作元素事件默认开启 wrapperEventInit
	 * -自定义事件 mediaInit、mediaCreate、mediaDestory、mediaAudioCreate、mediaPlay、mediaPause、mediaClick
	 * -自定义事件集合 events = [
	 * 					'start' : fn
	 * 				]
	 */
	function Media(audio, wrapper, opts){
		// 检测浏览器是否支持audio对象
		if (!window.HTMLAudioElement) {
			throw new Error('对不起，您的浏览器版本过低，不支持音频的播放！！')
		}

		var argsLen = arguments.length;

		// Media(audio) --- 第一个参数必须是audio
		if ( !( isElement(audio) && audio.tagName == 'AUDIO' ) && !(isString(audio) && isAudio.test(audio)) ) {
			throw new Error('传入的audio参数，必须是音频对象或者是正确的音频地址值！！')				
		}

		// 传入2个参数
		if (argsLen === 2) {
			if ( isElement(wrapper) || isString(wrapper) ) {
				// Media(audio, wrapper)
				opts = undefined;
			} else if ( !isElement(wrapper) && isObject(wrapper) ) {
				// Media(audio, opts)
				opts = wrapper;
				wrapper = undefined;
			}
		}

		// 音频对象设置
		if ( isElement(audio) ) {
			this.audio = audio;
		} else {
			this.audioSrc = audio;
		}

		// 操作对象设置
    	if ( typeof wrapper == 'undefined' ) {
			this.wrapper = window.document.body;
		} else {
			this.wrapper = isString(wrapper) ? document.querySelector(wrapper) : wrapper;
		}

		// 默认控制-属性
		this.events = {}; 
		this.wrapperEvent = 'click'; // 默认操作元素的事件为click
		this.wrapperEventInit = true; // 默认操作元素的事件开启
		this.audioLoop = 'loop'; // 默认音频播放是循环
		this.audioPreLoad = 'audo'; // 默认音频自动加载
		this.audioAutoPlay = true; // 默认音频自动播放

		// 传递参数
        for (i in opts) {
            this[i] = opts[i];
        }

		this.init();
	}

	Media.prototype = {
		/**
    	 * @method init()
    	 * @description 对象实例化默认执行的函数
    	 *
    	 * @mediaInit 触发初始化观察者
    	 */
		init : function(){
			// 声音初始化
			this.audioCreate();

			// 绑定音乐加载事件
			this.initEvents(false);

			// 触发观察者初始化事件
       		this.emit('mediaInit');
		},

		/**
		 * @method this.handleEvent(e)
		 * @description 事件绑定，默认回调this->handleEvent
		 *
		 * @param {event} e event对象
		 */
		handleEvent: function (e) {
			switch ( e.type ) {
				case 'play':
					this._play(e);
					break;
				case 'pause':
					this._pause(e);
					break;
				case 'tap':
				case 'click':
				case 'touchstart':
				case 'mousedown':
					this._action(e);
					break;
			}
		},

		/**
    	 * @method initEvents()
    	 * @description 初始化事件
    	 * 
    	 * @param  {booleam} remove 选择事件绑定还是解除
    	 *
    	 * @mediaCreate 触发组件对象创建成功事件观察者
    	 * @mediaDestory 触发组件对象注销成功事件观察者
    	 */
	 	initEvents : function(remove){
	 		var eventType = remove ? removeEvent : addEvent;
	 		var target = this.wrapper;
	 		var music = this.audio;

	 		eventType(music, 'play', this);
			eventType(music, 'pause', this);
			eventType(target, this.wrapperEvent, this);

			if (!remove) {
				// pageCreate
	       		this.emit('mediaCreate');
			} else {
				// pageDestory
	       		this.emit('mediaDestory');
			}
	 	},

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
		 * @method audioCreate()
		 * @description 根据传入的audio，生成对应的音频对象
		 *
		 * @mediaAudioCreate 触发音频创建事件观察者
		 */
	 	audioCreate : function(){
	 		// media资源的加载
	 		if (this.audio) {
	 			var src = this.audio.src;
	 			if ( !isAudio.test(src) ) {
	 				throw new Error('audio-Element对象，音频地址值不正确！！')
	 			}
	 		} else if (this.audioSrc) {
		        this.audio = new Audio(); 
		        this.audio.src = this.audioSrc;
	 		}

	 		// 设置音频对象的属性
	 		var options_audio = {
				loop : this.audioLoop,
	            preload : this.audioPreLoad,
	            autoplay : this.audioAutoPlay
			}
			for(var key in options_audio){
	            if(options_audio.hasOwnProperty(key) && (key in this.audio)){
	                this.audio[key] = options_audio[key];
	            }
	        }

	 		this.wrapper.appendChild(this.audio);
	        this.audio.load();
	        window.__Media.push(this.audio);

	       	this.emit('mediaAudioCreate');
	 	},

	 	/**
	 	 * @method _play()
	 	 * @description 音频播放
	 	 * 
	 	 * @mediaAudioCreate 触发音频播放事件观察者
	 	 */
	 	_play : function(){
	 		// 关闭其他声音
	 		var audios = window.__Media;
	 		var l = audios.length;

	 		for(var i = 0; i < l; i++) {
	 			if (audios[i] != this.audio) {
	 				audios[i].pause();
	 			}
	 		}

	 		this.emit('mediaPlay');
	 	},

	 	/**
	 	 * @method _pause()
	 	 * @description 音频暂停
	 	 * 
	 	 * @mediaAudioCreate 触发音频暂停事件观察者
	 	 */
	 	_pause : function(){
	 		this.emit('mediaPause');
	 	},

	 	/**
	 	 * @method _action()
	 	 * @description 操作对象的交互事件
	 	 * 
	 	 * @mediaAction 触发操作对象交互事件观察者
	 	 */
	 	_action : function(){
	 		if (this.wrapperEventInit) {
	 			if (this.audio.paused) {
	 				this.audio.play();
	 			} else {
	 				this.audio.pause();
	 			}
	 		}

	 		this.emit('mediaAction');
	 	}
	}

	return Media;
})

