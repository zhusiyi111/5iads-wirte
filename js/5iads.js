
var a = setInterval(function(){
	if($){
		window.my = {};
		init();
		clearInterval(a);
	}
},100);


function init(){
	$(function(){
		// 标出id
		displayId();
		displayIdOnPop();
		
		var timer = setInterval(function(){

			// 弹出框内容完整显示
			$('#mainClick').show()

				// 提交按钮可点击
			$('#TijiaoButton').removeAttr('disabled'); 

			// 不需要新开窗口
			$('#firstCk').val(2);


			// 移动验证码到顶部
			var yzmImage = $('.yianzhengma img');
			$('#CopyUrl').after(yzmImage)

			// 移动验证码到顶部
			var yzmImage = $('.yianzhengma img');
			$('#CopyUrl').after(yzmImage)

			// 放弃任务移到顶部
			var abandon = $('#abandon');
			$('.yaoqiu').prepend(abandon)

			// 查看答案是否通过并更新悬浮窗颜色
			if($('#urlcheck').hasClass('success') && !$('#newadurl').is(':hidden')){
				$('#floatDiv').css('background-color','green');
			}else{
				$('#floatDiv').css('background-color','black');
			}
		},100);



		$(document).delegate('.zhuanclick','click',function(){
			popOpend();
		})



		// 重写刷新任务列表
		$(document).delegate('.load-more','click',loadMore);
		loadMore();

		$(document).delegate('#newadurl','blur',function(){
			
			// 如果答案通过了
			var timer = setInterval(function(){
				var urlClass = $('#urlcheck').attr('class');
				if(urlClass!==''){
					clearInterval(timer);
					if(urlClass==='success'){
						var html = $('.working .con').html();
						var data = {
							clickid:window.id,
							html:html,
							answer:$('#newadurl').val()
						};
						console.log(data);
						sendMsgToBg(data);
					}
				}
			},300);
			
		})


	})	

}


function displayId(){
	var timer = setInterval(function(){
		if($('.zhuanitem').length>0){
			$('.zhuanitem').each(function(){
				var _this = $(this),
					clickid = _this.attr('dataid');
				var realId = clickid.charAt(2)+clickid.charAt(3)+clickid.charAt(5)+clickid.charAt(7)+clickid.charAt(9);
				var html = '<em>真实任务id：</em><span style="color:blue" class="realid">'+realId+'</span><span style="display:none" class="myid">'+clickid+'</span>';
				_this.find('.zhuanclick').append(html);
			})
			displayIdOnPop();
			clearInterval(timer);
		}
	},100)
}


function displayIdOnPop(){   
	var timer = setInterval(function(){
		if($('.zhuanclick').length>0){
			// id加在弹出框上
			$(document).delegate('.zhuanclick','click',function(){
				var _this = $(this),
					id = _this.find('.myid').text();
				window.id = id;

				// 点过之后变黄
				_this.find('.realid').css({color:'yellow'}).addClass('clicked');
			})
			clearInterval(timer);
		}
	},100)
	
}

// 弹出框打开了
function popOpend(){
	var timer = setInterval(function(){
		if(!$('.yaoqiu').is(':hidden')){
			var html = $('.working .con').html();
			var data = {
				clickid:window.id,
				html:html
			};
			sendMsgToBg(data);
			clearInterval(timer);
		}
	},200);

}

function sendMsgToBg(data){
	data.sender = '5iads';
	chrome.runtime.sendMessage(data, function(response){
		fillAnswer(response);
	});
}

// 填充答案
function fillAnswer(data){
	var answer;
	console.log(data);
	if(data!==undefined){
		answer= data.answer;
	}else{
		answer = '';
	}
	console.log('url',answer);
	$('#newadurl').val(answer);
	setTimeout(function(){
		$('#newadurl').trigger('click');
		setTimeout(function(){
			if(1 || checkCodeIsRight()){
				// requestCheckCode();
			}else{
				console.log('答案验证失败')
			}
		})
	},2000);
	
}


function loadMore(){


	var timer = setInterval(function(){
		var clearFlag = false;
		$('.zhuanitem .txtcg').each(function(){
			var text = $(this).text();
			// 去除金币少的
			if((new Number(text)>80 || new Number(text)<70) && !$('#tab span').eq(2).is('.active')){
				$(this).closest('.zhuanitem').remove();
				clearFlag = true;
			}
		});
		if(clearFlag){
			clearInterval(timer);
		}
	},400);


}

chrome.runtime.onMessage.addListener(function(data,sender,sendResponse){

	console.log(data)
	if(data.sender && data.sender === 'checkCode'){
		processCheckCode(data.Result);
		$('#errorCheckCodeId').val(data.Id)
		// 点击提交
		$('#TijiaoButton').trigger('click');
	}
})

function processCheckCode(checkCode){
	$('#yzm').val(checkCode);
	// $('.yianzhengma .yessel').removeClass('yessel').addClass('nosel');
	// if(checkCode.length===3 && /[1-9]{3}/.test(checkCode)){
	// 	for(var i=0;i<3;i++){
	// 		if($('#yzm' + checkCode[i]).is('.nosel')){
	// 			$('#yzm' + checkCode[i]).trigger('click')
	// 		}
	// 	}
	// }else{
	// 	return false;
	// }
}





var s = document.createElement('script');
$(s).attr('charset','GB2312')
s.src = chrome.extension.getURL('js/my5iads.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);



var dianjiTimer = setInterval(function(){
	var item = $('.zhuanclick').filter(function(){
		if($(this).find('.clicked').length>0){
			return false;
		}
		return true;
	})

	if(item.length>0 && ($('#newadurl').is(':hidden')||$('#newadurl').length===0)){

		item.eq(0).trigger('click');
		// setTimeout(function(){
		// 	$('#tasklist_dig').siblings('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').trigger('click');

		// },30000);
	}
	

},10000);
