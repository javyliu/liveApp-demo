/**
 * 自定义事件管理
 * @cation
 * @wechat shoe11414255
 */
define(function (require, exports, module){

	// 自定义事件执行
	var haddleEnvent = {

		// 声音开启
		audioPlay : function(){
			var media = $('.u-audio').data('media');
			media.audioNode.addClass('z-show');
		},
		// 声音关闭
		audioPause : function(){
			var media = $('.u-audio').data('media');
			media.audioNode.removeClass('z-show');
		},
		// 声音点击
		audioClick : function(){
			var media = $('.u-audio').data('media');

			if (media.audio.paused) {
				media.audio.play();
			} else {
				media.audio.pause();
			}
		},
		// 报名打开
		applyOpen : function(){
			var form = $('#J_frame').data('form').domObj;
			form.removeClass('f-hide');

			var page = $('.p-ct .pageWrap').data('page');
			page.initEvents(true);
			page.page.eq(page.pageNow).find('.m-page-ct .content').addClass('z-stop');

			var height = $(window).height();
			$(document.body).css('height', height);

			// 静止window滚动
			$(window).off('touchmove scroll');

			// 标记职位
			var position = page.page.eq(page.pageNow).data("position");
			form.find('input[name="position"]').val(position);
		},
		// 报名关闭
		applyClose : function(){
			var page = $('.p-ct .pageWrap').data('page');
			page.initEvents(false);
			page.page.eq(page.pageNow).find('.m-page-ct .content').removeClass('z-stop');

			$(document.body).css('height', '100%');

			// 静止window滚动
			$(window).on('touchmove scroll',function(e){
				e.preventDefault();
			})
		},
		// 微信打开
		shareOpen : function(){
			var page = $('.p-ct .pageWrap').data('page');
			page.initEvents(true);

			// 箭头隐藏
			$('.u-ar-1').addClass('z-low');

			// 声音隐藏
			$('.u-audio').addClass('z-low');
		},
		// 微信关闭
		shareClose : function(){
			var page = $('.p-ct .pageWrap').data('page');
			page.initEvents(false);

			// 箭头显示
			$('.u-ar-1').removeClass('z-low');

			// 声音显示
			$('.u-audio').removeClass('z-low');
		},
		// 切换成功事件
		pageSuccess : function(){
			var that = $('.p-ct .pageWrap').data('page');

			// 判断最后一页让，开启循环切换
			if (that.pageNext == 0 && that.pageNow == that.pageNum - 1) {
				that.firstChange = true;
			}

			setTimeout(function(){
				// 判断是否为最后一页，显示或者隐藏箭头
				if ( that.pageNext == that.pageNum - 1 ) {
					$('.u-ar-1').addClass('f-hide');

					if ($('.j-yunLaiAD-open').length > 0) {
						$('.j-yunLaiAD-open').removeClass('f-hide');

						setTimeout(function(){
							$('.j-yunLaiAD-open').addClass('z-show');
						}, 20)
					}
				} else {
					$('.u-ar-1').removeClass('f-hide');

					if ($('.j-yunLaiAD-open').length > 0) {
						$('.j-yunLaiAD-open').addClass('f-hide');
						$('.j-yunLaiAD-open').removeClass('z-show');
					}
				}

	 			that.page.eq(that.pageNow).addClass('f-hide').removeClass('z-animate');
				that.page.eq(that.pageNow).attr('data-translate','');
 				that.page.eq(that.pageNow)[0].style[that.prefixStyle('transform')] = '';
 				that.page.eq(that.pageNow)[0].style[that.prefixStyle('transition')] = '';
 				that.page.eq(that.pageNext)[0].style[that.prefixStyle('transform')] = '';
	 			that.page.eq(that.pageNext)[0].style[that.prefixStyle('transition')] = '';

	 			// 初始化切换的相关控制值
	 			that.page.eq(that.pageNext).removeClass('z-active');
				that.pageNow = that.pageNext;
				that.moveStart = true;
				that.moveFirst = true;
				that.pageNext = null;
				that.page.eq(that.pageNow).attr('data-translate', '');
				that.touchDeltaY = 0;

				// 切换成功后，执行当前页面的动画
				that.page.eq(that.pageNow).addClass('z-animate');
	 		},500)
		},
		// 切换失败事件
		pageFial : function(){
			var that = $('.p-ct .pageWrap').data('page');

			setTimeout(function(){
				that.page.eq(that.pageNow).attr('data-translate', '');
 				that.page.eq(that.pageNow)[0].style[that.prefixStyle('transform')] = '';
 				that.page.eq(that.pageNow)[0].style[that.prefixStyle('transition')] = '';
 				that.page.eq(that.pageNext)[0].style[that.prefixStyle('transform')] = '';
	 			that.page.eq(that.pageNext)[0].style[that.prefixStyle('transition')] = '';

	 			that.page.eq(that.pageNext).removeClass('z-active').addClass('f-hide');
				that.moveStart = true;
				that.moveFirst = true;
				that.pageNext = null;
				that.touchDeltaY = 0;
	 		},500)
		},
		// 广告打开
		yunLaiADClose : function(){
			var page = $('.p-ct .pageWrap').data('page');
			page.initEvents(false);

			// 箭头隐藏
			$('.u-ar-1').addClass('z-low');

			// 声音隐藏
			$('.u-audio').addClass('z-low');
		},
		// 广告关闭
		yunLaiADOpen : function(){
			var page = $('.p-ct .pageWrap').data('page');
			page.initEvents(true);

			// 箭头隐藏
			$('.u-ar-1').removeClass('z-low');

			// 声音隐藏
			$('.u-audio').removeClass('z-low');
		}
 	}

 	module.exports = haddleEnvent;
})
