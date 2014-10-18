/**
 * 分享显示组件控制器
 * @cation
 * @wechat shoe11414255
 */
define(function (require, exports, module){
	require('./c.css');
	var tpl = require('./c.tpl');

	function Share(selector, data){
		this.data = data ? data : '';
		this.dom = typeof selector == 'object' ? selector : $(selector);
		this.domObj = null;
		this.events = {};
		
		this.render();
	} 

	Share.prototype = {
		render : function(){
			var	render, html;

			if (this.data) {
				render = template.compile(tpl);
				html = render(this.data);
			} else {
				html = tpl;
			}

			html = $(html);

			this.domObj = html;
			this.dom.append(html);

			this.style();
			this.bindEvents();

			delete this.dom;
		},

		style : function(){
			// todo style
		},

		bindEvents : function(){
			// todo events
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
        }
	}

	module.exports = Share;
})
	


