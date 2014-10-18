/**
 * 页面切换组件
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
})('MPage', function(){
    'use strict';
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
            return Object.prototype.toString.call(obj) === "[object " + type + "]"
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
     * @method function.bind()
     * @description 对Function的this指针上下文延长
     *
     * @param {object、this} target 延长指定的上下文
     * @param {Array} agrs 回调函数执行的参数传递
     *
     * @return {function} 函数函数执行，传递指定参数
     * 
     */
    Function.prototype.bind = Function.prototype.bind || function (target, agrs) {
        var self = this;

        return function (agrs){
            if (!(isArray(agrs))) {
                agrs = [agrs];
            }

            self.apply(target, agrs);
        }
    }

    /**
     * @method _forEach()
     * @description 遍历元素，分别对于回调函数处理
     * 
     * @param {Array | element | object} elements 需要遍历处理的元素
     * @param {function} callback 回调处理函数
     *
     * @return {Array | element | object} 返回当前元素
     */
    function _forEach(elements, callback) {
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

    function hasClass(e, c) {
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
        return re.test(e.className);
    };

    function addClass(e, c) {
        if ( hasClass(e, c) ) {
            return;
        }

        var newclass = e.className.split(' ');
        newclass.push(c);
        e.className = newclass.join(' ');
    };

    function removeClass(e, c) {
        if ( !hasClass(e, c) ) {
            return;
        }

        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
        e.className = e.className.replace(re, ' ');
    };

    /**
     * @method vendor()
     * @description 判断浏览器的私有头部，并返回其值
     *
     * @param {string} style 样式属性
     *
     * @return {string} 返回特定属性在浏览器的私有头部
     */
    // 判断浏览器内核类型 - 适配样式属性
    var _elementStyle = document.createElement('div').style;
    function vendor(style) {
        var vendors = ['webkit', 'moz', 'ms', 'o', ''],
            tmp,
            i = 0,
            l = vendors.length;

        var style_C = style.charAt(0).toUpperCase() + style.substr(1)
        for ( ; i < l; i++ ) {
            tmp = vendors[i] + (vendors[i] ? style_C : style);
            if ( tmp in _elementStyle ) {
                return vendors[i];
            }
        }
        return false;
    }

    /**
     * @method prefixStyle()
     * @description 样式属性补全
     * 
     * @param {strong} style 样式
     *
     * @return {string} 返回补全的样式
     */
    function prefixStyle(style) {
        if ( vendor(style) === false ) return false;
        if ( vendor(style) === '' ) return style;
        return vendor(style) + style.charAt(0).toUpperCase() + style.substr(1);
    }
    /**
     * @method  translateZ()
     * @description 判断是否支持3D
     */
    function translateZ(){
        if(prefixStyle('perspective')){
            return ' translateZ(0)';
        }else{
            return '';
        }
    }

    // 事件类型
    var eventType =  {
        touchstart : 1,
        touchmove : 1,
        touchend : 1,

        mousedown : 2,
        mousemove : 2,
        mouseup : 2,
        mouseout : 2,

        MSPointerDown : 3,
        MSPointerMove : 3,
        MSPointerUp : 3
    };


    // 页面控制对象
    function MPage(wrapper, page, options){
        // wrap-dom设置
        if ( typeof wrapper == 'undefined' || wrapper == '' ) {
            this.wrapper = window.document.body;
        } else {
            this.wrapper = isString(wrapper) ? document.querySelector(wrapper) : wrapper;
        }
        if (!isElement(this.wrapper)) {
            throw new Error('传入的wrapper-Element元素不准确，请确认上传！')
        }

        // page-dom设置
        if ( typeof page == 'undefined' || page == '' ) {
            this.page = this.wrapper.children;
        } else {
            this.page = isArray(page) ? this.page : this.wrapper.querySelectorAll(page);
        }

        // 默认控制值配置
        this.options = {
            isStart : false, // 是否开启切换
            isTouch : true, // 是否开启touch
            isPointerTouch : true, // 是否开启PointerTouch
            ImgTouch : false, // 图片禁止滑动

            pageStyle : {}, // 页面样式

            cycle : true,  // 是否循环
            firstChange : false, // 是否开启第一页切换回去

            resizePolling : 60, // resize时间回调

            pageNow : 0, // 当前显示页面位置

            single : true,
            scale : 0,
            moveY : 1,
            easingType : 'cubic-bezier(0.1, 0.57, 0.1, 1)',

            HWCompositing : true,
            useTransition : true,
            useTransform : true,

            translateThreshold : 100,
            transitionTime : 800,
            transitionProperty : 'left, ' + '-' + vendor('transform') + '-transform'
        };

        // 自定义控制值扩展
        for ( var i in options ) {
            this.options[i] = options[i];
        }

        this.options.useTransition = prefixStyle('transform') !== false && this.options.useTransition;
        this.options.useTransform = prefixStyle('transition') in _elementStyle && this.options.useTransform;

        this.hasTouch = this.options.isTouch && 'ontouchstart' in window;
        this.hasPointer = this.options.isPointerTouch && navigator.msPointerEnabled;
        this.hasMouse = !this.hasTouch && !this.hasPointer && 'onmousedown' in window;

        this.pageNow = this.options.pageNow ? this.options.pageNow : 0;

        // Some defaults
        this.pageNum = this.page.length;
        this.events = {}; // 自定义事件
        this.x = 0;
        this.y = 0;

        this.init();
    }
    // 扩展原型
    MPage.prototype = {
        init : function(opts){
            // 样式设置
            this.style();

            // 刷新对象值
            this.refresh();

            // 初始化对象
            this.initEvents(this.options.isStart);
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

        // this对象中，事件handle对象（处理事件的绑定函数）
        handleEvent: function (e) {
            switch ( e.type ) {
                case 'touchstart':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'MSPointerUp':
                case 'MSPointerOut':
                case 'mouseup':
                case 'mouseout':
                case 'touchcancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
            }

        },

        // 对象事件绑定（或者注销-true为注销，false为绑定）
        initEvents: function (remove) {
            var that = this;
            var eventType = remove ? removeEvent : addEvent;
            var target = this.wrapper;

            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);

            // pc-mouse
            if ( this.hasMouse ) {
                eventType(target, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this);
                eventType(target, 'mouseout', this);
            }

            // mobile-ie
            if ( this.hasPointer ) {
                eventType(target, 'MSPointerDown', this);
                eventType(target, 'MSPointerMove', this);
                eventType(target, 'MSPointerCancel', this);
                eventType(target, 'MSPointerUp', this);
                eventType(target, 'MSPointerOut', this);
            }

            // mobile-webkit
            if ( this.hasTouch ) {
                eventType(target, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this);
            }

            _forEach(this.page, function(i, item){
                eventType(item, 'transitionend', that);
                eventType(item, 'webkitTransitionEnd', that);
                eventType(item, 'oTransitionEnd', that);
                eventType(item, 'MSTransitionEnd', that);
            })

            if (!remove) {
                // pageCreate
                this.emit('mPageCreate');
            } else {
                // pageDestory
                this.emit('mPageDestory');
            }
        },

        // style设置
        style : function(){
            var that = this;

            if ( this.wrapper.style.position != 'absolute' ) {
                this.wrapper.style.position = 'relative';
            }

            _forEach(this.page, function(i, item){
                item.style.cssText = 'display:none;position:absolute;left:0;top:0;z-index:8;';

                // 自定时page样式
                for ( var o in that.options.pageStyle ) {
                    item.style[prefixStyle(o)] = that.options.pageStyle;
                }

                if ( i == 0 ) {
                    item.style.display = 'block';
                }
            })

            // 设置过渡属性值
            this._transitionProperty( this.options.transitionProperty );
        },

        // refresh刷新
        refresh : function(){
            var that = this;

            this.pageWidth = this.options.width ? this.options.width : this.wrapper.clientWidth ? this.wrapper.clientWidth : window.innerWidth; // 页面宽度
            this.pageHeight = this.options.height ? this.options.height : this.wrapper.clientHeight ?  this.wrapper.clientHeight : window.innerHeight; // 页面高度

            this.wrapper.style.width = this.pageWidth;
            this.wrapper.style.height = this.pageHeight;

            // 页面设置高度和砍断
            _forEach(this.page, function(i, item){
                item.style.width = that.pageWidth;
                item.style.height = that.pageHeight;
            })

            // refresh
            this.emit('mPageRefresh');
        },

        // page触摸移动start
        _start : function(e){
            // 判断操作的是图片元素，禁止图片有拖拽效果
            if ( this.options.ImgTouch && e.target.tagName == 'IMG') {
                e.preventDefault();
            }

            // 禁止PC上右键的操作
            if ( eventType[e.type] != 1 ) {
                if ( e.button !== 0 ) {
                    return
                }
            }

            // 判断操作的事件类型，保持操作一致
            if ( this.initiated && eventType[e.type] !== this.initiated ) {
                return
            }

            // 判断图片切换是否处于过渡中
            if (this.moved) {
                return;
            }

            this.initiated = eventType[e.type];
            this.moved = false;

            var point = e.touches ? e.touches[0] : e;
            
            this.pointY = point.pageY;
            this.startY = point.pageY;
            this.directionX = 0;
            this.directionY = 0;
            this.directionLocked = 0;

            // start事件
            this.emit('mPageStart');
        },

        // page触摸移动move
        _move : function(e){
            e.preventDefault();

            // 判断操作的事件类型，保持操作一致
            if ( eventType[e.type] !== this.initiated ) {
                return
            }

            if (this.moved) {
                return;
            }

            if (!this.pointY || this.pointY == 0) {
                return;
            }

            // 位置值操作
            var point = e.touches ? e.touches[0] : e,
                deltaY = point.pageY - this.pointY,
                newY, nextY, now, next;

            this.pointY = point.pageY;

            // 激活的page
            if (this.pagePosition()) {
                next = this.pagePosition()[0];
                now = this.pagePosition()[1];
            } else {
                this.pointY = this.startY;
                return
            }

            newY = ( this.y + deltaY )/this.options.moveY;
            nextY = this.nextY + deltaY;
            this.scale = 1 - Math.abs( (this.pointY - this.startY) * this.options.scale/this.pageHeight);

            // 图片移动
            !this.options.single && this._translate(now, 0, newY, this.scale);
            this._translate(next, 0, nextY);

            this.y = newY;
            this.nextY = nextY;

            // move移动观察者
            this.emit('mPageMove');
        },

        // page触摸移动判断方向
        pagePosition   : function(){      
            var now = this.page[this.pageNow], // 当前页面
                del = this.pointY - this.startY, // 移动的距离
                next, moveFirst, node;

            // 设置移动方向
            this.directionY = del > 0 ? 'down' : 'up';

            if (this.directionY != this.directionLocked) {
                moveFirst = true;
                this.directionLocked = this.directionY;
            } else {
                moveFirst = false;
            }

            // 设置下一页面的显示和位置        
            if (del <= 0) {
                if ( this.pageNow == this.pageNum - 1 && this.options.cycle ) {
                    this.pageNext = 0;
                } else if ( this.pageNow == this.pageNum - 1 ) {
                    this.pageNext = null;
                    return false
                } else {
                    this.pageNext = this.pageNow + 1;   
                }
            } else {
                if ( this.pageNow == 0 ) {
                    if ( this.options.firstChange && this.options.cycle ) {
                        this.pageNext = this.pageNum - 1;
                    } else {
                        this.pageNext = null;
                        return false
                    }
                } else {
                    this.pageNext = this.pageNow - 1;   
                }
            }

            next = this.page[this.pageNext];
            node = [next, now];

            // move阶段根据方向设置页面的初始化位置--执行一次
            if ( moveFirst ) {
                // 设置下一页面的显示和位置        
                this.nextY = this.directionY == 'up' ? this.pageHeight : -this.pageHeight;

                next.style.display = 'block';
                next.style.zIndex = '9';
            }

            return node;
        },

        // page触摸移动end
        _end : function(e){
            // 判断操作的事件类型，保持操作一致
            if ( eventType[e.type] !== this.initiated ) {
                return;
            }

            // 判断是否有move，没有判断为点击 --> 按钮的点击
            if ( Math.abs(this.pointY - this.startY) > 10 && !isNaN(this.pageNext) ) {
                this.moved = true;
            } else {
                // 注销控制值
                this.initiated = 0;
                this.directionY = 0;
                this.directionLocked = 0;
                this.moved = false;
                return
            }

            var del = this.pointY - this.startY,
                now = this.page[this.pageNow],
                next = this.page[this.pageNext];

            // 页面切换
            if ( Math.abs(del) >= this.options.translateThreshold ) { // 切换成功
                // 下一个页面的移动
                this.nextY = 0;

                // 当前页面变小的移动
                this.y = del > 0 ? this.pageHeight/this.options.moveY : -this.pageHeight/this.options.moveY;
                this.scale = 1 - this.options.scale;
            } else {   
                this.y = 0
                this.nextY = del > 0 ? -this.pageHeight : this.pageHeight;
                this.scale = 1;
            }

            !this.options.single && this._transitionTo(now, 0, this.y, this.scale, this.options.transitionTime, this.options.easingType);
            this._transitionTo(next, 0, this.nextY, 1, this.options.transitionTime, this.options.easingType);

            // end事件
            this.emit('mPageEnd');
        },

        /**
         * @method _transitionTo()
         * @description 图片切换处理函数
         *
         * @param {number} x 轮播图x位置值
         * @param {number} y 轮播图y位置值
         * @param {number} time 切换过渡时间
         * @param {string} easing 过渡效果设置，css3的设置形式
         */
        _transitionTo : function (node, x, y, scale, time, easing) {
            if (!node) {
                return
            }

            scale = scale || 1;
            easing = easing || this.options.easingType;

            this.isInTransition = time > 0;

            this._transitionTimingFunction(node, easing);
            this._transitionTime(node, time);
            this._translate(node, x, y, scale);
        },

        /**
         * @method _transitionProperty()
         * @description 切换过渡属性设置
         *
         * @param {string} property 过渡效果属性值
         */
        _transitionProperty : function(property){
            var that = this,
                property = property || 'all';

            _forEach(this.page, function(i, item){
                item.style[prefixStyle('transitionProperty')] = property;
            })
        },  

        /**
         * @method _transitionTime()
         * @description 切换过渡时间设置
         *
         * @param {number} time 过渡时间值
         */
        _transitionTime : function (node, time) {
            time = time || 0;

            node.style[prefixStyle('transitionDuration')] = time + 'ms';
        },

        /**
         * @method _transitionTimingFunction()
         * @description 切换过渡效果设置
         *
         * @param {String} easing css3形式的过渡效果值
         */
        _transitionTimingFunction : function (node, easing) {
            node.style[prefixStyle('transitionTimingFunction')] = easing;
        },

        /**
         * @method _translate()
         * @description 切换移动位置值设置
         *
         * @param {number} x 轮播图x位置值
         * @param {number} y 轮播图y位置值
         *
         * @silderTranslate 触发切换移动观察者
         */
        _translate : function (node, x, y, scale) {
            if (!node) {
                return
            }

            scale = scale || 1;

            //  是否开启位置旋转-硬件加速效果
            if ( this.options.useTransform ) {
                node.style[prefixStyle('transform')] = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')' + translateZ();
            } else {
                x = Math.round(x);
                y = Math.round(y);

                node.style.left = x + 'px';
                node.style.top = y + 'px';
            }

            // 图片移动观察者
            this.emit('mPageTranslate');
        },

        /**
         * @method _transitionEnd()
         * @description 切换过渡结束处理函数
         *
         * @silderTransitionEnd 触发切换过渡结束观察者
         */
        _transitionEnd: function (event) {
            if ( !this.isInTransition ) {
                return;
            }

            // 停止运动
            this.moved = false;

            // 并将isInTransition设为false
            // 执行停止回调函数
            this.isInTransition = 0;

            if ( Math.abs(this.pointY - this.startY) >= this.options.translateThreshold ) {
                this._pageSuccess();
            } else {
                this._pageFial();
            }
 
            // 页面相关操作
            this.x = 0;
            this.y = 0;
            this.initiated = 0;
            this.directionY = 0;
            this.directionLocked = 0;

            // 图片移动过渡结束观察者
            this.emit('mPageTransitionEnd');
        },

        // 切换成功事件
        _pageSuccess : function(){
            var now = this.page[this.pageNow],
                next = this.page[this.pageNext];

            // 判断最后一页让，开启循环切换
            if (this.pageNext == 0 && this.pageNow == this.pageNum - 1) {
                this.firstChange = true;
            }

            now.style.display = 'none';
            now.style[prefixStyle('transform')] = '';
            next.style[prefixStyle('transform')] = '';
            next.style.zIndex = '8';

            // 初始化切换的相关控制值
            this.pageNow = this.pageNext;
            this.pageNext = null;

            // 切换成功后，执行当前页面的动画
            removeClass(now, 'z-animate');
            addClass(next, 'z-animate');

            // 成功
            this.emit('mPageSuccess', {
                now : now,
                next : next
            });
        },

        // 切换失败事件
        _pageFial : function(){
            var now = this.page[this.pageNow],
                next = this.page[this.pageNext];

            next.style.display = 'none';
            now.style[prefixStyle('transform')] = '';
            next.style[prefixStyle('transform')] = '';
            next.style.zIndex = '8';
            
            this.pageNext = null;

            // 成功
            this.emit('mPageFial', {
                now : now,
                next : next
            });
        },

        // window-sizi变化
        _resize: function () {
            var that = this;

            clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(function () {
                that.refresh();
            }, this.resizePolling);
        }
    }

    return MPage
});


