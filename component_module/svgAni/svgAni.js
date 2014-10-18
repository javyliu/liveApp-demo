/*
 * 
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

   
    // 创建对象
    function SvgAni( el ) {
        this.el = el;
        this.current_frame = 0;
        this.total_frames = 100;
        this.path = [];
        this.length = [];
        this.handle = 0;
        this.init();
    };

    // 初始化对象
    SvgAni.prototype = {
        init : function() {
            var self = this;
            [].slice.call( this.el.querySelectorAll( 'path' ) ).forEach( function( path, i ) {
                self.path[i] = path;

                if(typeof(self.path[i].getTotalLength) !== 'function'){
                    return;
                }else{
                    var l = self.path[i].getTotalLength();
                    self.length[i] = l;
                    self.path[i].style.strokeDasharray = l + ' ' + l; 
                    self.path[i].style.strokeDashoffset = l;
                }
            });
        },

        // 对象读取
        render : function() {
            if( this.rendered ) return;
            this.rendered = true;
            this.draw();
        },

        // 对象动画开始
        draw : function() {
            var self = this,
                progress = this.current_frame/this.total_frames;
            if (progress > 1) {
                window.cancelAnimationFrame(this.handle);
            } else {
                this.current_frame++;
                for(var j=0, len = this.path.length; j<len;j++){
                    this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
                }
                this.handle = window.requestAnimationFrame(function() { self.draw(); });
            }
        }
    }

    return SvgAni
})
