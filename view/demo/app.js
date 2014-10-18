/**
 * APP入口控制器
 * @author cation
 * @email shoe11414255@qq.com
 */
define(function (require, exports, module){
	// 引入业务组件
	var show = require('show');

	// 引入三方组件
	require('touch');
	var media = require('media');
	var mPage = require('mPage');
	var preLoad = require('preLoad');
	var svgAni = require('svgAni');
	var gifAni = require('gifAni');

	// 引入私有脚本
	var event = require('./js/event');

	// 图片路径
	var IMG_PATH = RES_DIR + IMG_DIR;
	var JS_VISION_ = '?vision=' + JS_VISION;

	// 组件配置数据
	window.c_data = [
		{
			'name' : 'show',
			'module' : 'imgText',
			'pageBg' : IMG_PATH + '1.jpg' + JS_VISION_
		},
		{
			'name' : 'show',
			'module' : 'imgText',
			'pageBg' : IMG_PATH + '2.jpg' + JS_VISION_,
			'gifAniImg' : IMG_PATH + 'gifAni.gif' + JS_VISION_

		},
		{
			'name' : 'show',
			'module' : 'imgText',
			'pageBg' : IMG_PATH + '3.jpg' + JS_VISION_,
			'svg' : true,
			'svg_width' : $(window).width(),
			'svg_height' : $(window).height()
		},
		{
			'name' : 'show',
			'module' : 'imgText',
			'pageBg' : IMG_PATH + '4.jpg' + JS_VISION_
		}
	];

	// APP对象
	function App(){
		this.page = null;
		this.pageWrap = null;
	}

	App.prototype = {
		init : function (){
			// 加载组件
			this.componentCreate();

			// 样式初始化
			this.styleInit();
		},

		// APP样式初始化
		styleInit : function(){
			// 静止window滚动
			$(window).on('touchmove scroll',function(e){
				e.preventDefault();
			})

			// 禁止文版被拖动
			document.body.style.userSelect = 'none';
			document.body.style.mozUserSelect = 'none';
			document.body.style.webkitUserSelect = 'none';

			// 判断设备的旋转状态
			$(window).on('orientationchange', function(e){
				switch(window.orientation){
					case 0:		//竖屏
						$('.app').removeClass('j-landscape');					
						break;
					case 180:	//竖屏
						$('.app').removeClass('j-landscape')
						break;
					case -90: 	//横屏
						$('.app').addClass('j-landscape')
						break;
					case 90: 	//横屏
						$('.app').addClass('j-landscape');
						break;
				}
			})

			// 提示组件加载失败
			if (this.page.size() <= 0) {
				console.log('组件初始化失败！！');
			}

			var h = $(window).height();

			this.pageWrap.height(h);
			this.page.height(h);
		},

		// 加载组件
		componentCreate : function(){
			var selector = $('.app-content .p-ct .pageWrap');

			// 遍历组件数据加载
			for ( var i = 0, len = c_data.length; i < len; i++) {
				var data = c_data[i];	

				this.componentSelect(selector, data);
			}

			this.pageWrap = $('.p-ct .pageWrap');
			this.page = $('.p-ct').find('.pageWrap .m-page');

			// 资源控制
			this.resControl();
		},

		// 选择组件生成组件
		componentSelect : function(selector, data){
			var data = data || {};
			var componentName = data ? data.name : '';

			switch (componentName) {
				case 'show' : 
					var _show = new show(selector, data);
					break;
				default :
					return;
					break;
			}
		},

		// 资源管理器
		resControl : function(){
			var that = this,
				width = $(window).width(),
				height = $(window).height();

			// gif动态图
			var _gifAni = new gifAni({

			});

			// 声音事件绑定并初始化
			var _media = new media(RES_DIR + 'view/demo/media/media.mp3', '.u-music', {
				'audioAutoPlay' : true
			});

			// 图片预加载
			var imgs = [
				'1.jpg',
				'2.jpg',
				'3.jpg',
				'4.jpg'
			]
			var _proLoad = new preLoad(imgs, '.progress', {
				"prefix" : IMG_PATH,
				"progressInit" : false,
				'vision' : JS_VISION,
				"events" : {
					"preLoadComplete" : [
						function(){
							that.openApp();
						}
					]
				}
			})

			// 初始化页面管理器
			var _mPage = new mPage('.pageWrap', '.m-page', {
				'width' : width,
				'height' : height,
				'single' : false,
	            'scale' : 0.5,
	            'moveY' : 2
			});
			_mPage.on('mPageSuccess', function(options){
				var svg = options.next.querySelectorAll('svg');
				if (svg.length > 0 ) {
					for (var i = 0, len = svg.length; i < len; i++) {
						var _svgAni = new svgAni(svg[i]);

						$(svg[i]).removeClass('f-hide');
	           			_svgAni.render();
					}
				}
			})
		},

		// 启动APP
		openApp : function(){
			// 打开内容
			$('.app-content').removeClass('f-hide');

			setTimeout(function(){
				$('.app-content').addClass('z-show');

				setTimeout(function(){
					// 隐藏loading
					$('.app-loading').addClass('f-hide');
				}, 1000)
			}, 20)
		}
	}

	module.exports = new App;
})


