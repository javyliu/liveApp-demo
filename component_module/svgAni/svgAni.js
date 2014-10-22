/*
 * svg简单描线动画组件
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
})('SvgAni', function(){
    'use strict';

    // requset - animaframe
    var lastTime = 0;
    var _vendors = ['webkit', 'moz', ''];
    for (var x = 0, l = _vendors.length; x < l && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[_vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[_vendors[x] + 'CancelAnimationFrame'] ||
        window[_vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
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
    var likeArray = function (obj) {
        return typeof obj.length == 'number'
    }
    var _forEach = function(elements, callback) {
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
   
    // 创建对象
    function SvgAni( svg, opts ) {
        this.svg = svg;
        this.path = this.svg.querySelectorAll('path');
        this.length = [];

        this.renderOne = true;
        this.speed = 1;
        this.current_frame = 0;

        this.events = {};

        // 传递参数
        for (i in opts) {
            this[i] = opts[i];
        }

        this.init();
    };

    // 初始化对象
    SvgAni.prototype = {
        init : function() {
            this.pathInit();            
        },

        // 初始化SVG，让他们的path隐藏
        pathInit : function(){
            var self = this;

            _forEach(this.path, function(i, path){
                if(typeof(path.getTotalLength) !== 'function'){
                    // 不支持SVG
                    console.log('您的浏览器不支持SVG！！')
                    return;
                }else{
                    var l = path.getTotalLength();

                    path.style.strokeDasharray = l; 
                    path.style.strokeDashoffset = l;
                }
            })
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

        // 对象动画开始
        draw : function() {
            var self = this,
                progress = (this.current_frame / 100) * this.speed;

            if (progress > 1) {
                // 完成描边
                window.cancelAnimationFrame(this.handle);

                this.emit('complete');
                delete this.handle;
            } else {
                this.current_frame++;

                _forEach(this.path, function(i, path){
                    path.style.strokeDashoffset = Math.floor(path.getTotalLength() * (1 - progress));
                })

                this.emit('progress');
                this.handle = window.requestAnimationFrame(function(){
                    self.draw();
                });
            }
        },

        // 对象读取
        render : function() {
            if( this.rendered && this.renderOne ) {
                return;
            }
            this.rendered = true;
            this.draw();
        }
    }

    return SvgAni
})
