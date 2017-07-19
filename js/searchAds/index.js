

// 加载insert.js
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/searchAds/insert.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);





var lastImg = '';

var successTimer = setInterval(function(){

	var isSuccess = (function(){
		if($('#urlcheck').hasClass('success') && !$('#urlcheck').is(':hidden')){
			return true;
		}else{
			return false;
		}
	})();



	var img = $('.imageTip').find('img').eq(0).attr('src');

	if( isSuccess && lastImg !== img ){
		uploadInfo();
		lastImg = img;
	}	

})




// 是否已经请求了
var lasttImg = '';
var timer = setInterval(function(){
	var isOpened = (function(){
		if( !$('#newadurl').is(':hidden') && $('#newadurl').length!==0){
			return true;
		}else{
			return false;
		}
	})()

	var img = $('.imageTip').find('img').eq(0).attr('src');
	if(isOpened && img!==lasttImg){
		fillAnswer();
		lasttImg = img;
	}
},200);




function uploadInfo(){

	var url = $('#workUrl').val(),	//搜索引擎
	answer = $('#newadurl').val(),	//答案
	lastRequest = $('.lastrequest').text(),	//最后要求
	img = $('.imageTip').find('img').eq(0).attr('src');	//图片

	//提取搜索关键字
	var keyword = $('#wordstr').text();
	

	
	var data = {
		url:url,
		answer:answer,
		lastRequest:lastRequest,
		img:img,
		keyword:keyword,
		taskType:2 	//2为搜索任务
	}

	chrome.runtime.sendMessage({
		J_method:'getWebsiteAndTitle'
	}, function(res) {
		data = $.extend(data,res);
		var searchUrl = getSearchUrl(data.url,data.keyword,data.website);
		data.searchUrl = searchUrl;
		sendInfoToBg(data);
	});
	
}


// 计算搜索链接
function getSearchUrl(url,keyword,website){
	// 如果是百度
	if(url.indexOf('www.baidu.com')!==-1){
		var str = 'https://www.baidu.com/s?ie=UTF-8&wd='+keyword;
		if(website!==undefined){
			str += (' site%3A'+website);
		}
		return str;
	}else if(url.indexOf('m.baidu.com')!==-1){	//如果是手机百度
		var str = 'https://m.baidu.com/s?word='+keyword;
		if(website!==undefined){
			str += ('+site%3A'+website);
		}
		return str;
	}
}


// 把成功的任务信息发到后台，更新信息
function sendInfoToBg(data){
	console.log(data);
	chrome.runtime.sendMessage({
		J_method:'updateTaskInfo',
		data:data
	}, function(res) {

	});
}


// 点过的变绿
$(document).delegate('.zhuanclick','click',function(){
	$(this).find('.title').css('color','green');
})



function fillAnswer(){
	var url = $('#workUrl').val(),	//搜索引擎
		img = $('.imageTip').find('img').eq(0).attr('src');	//图片

	//提取搜索关键字
	var keyword = $('#wordstr').text();

	

	chrome.runtime.sendMessage({
		J_method:'getAnswer',
		data:{
			url:url,
			img:img,
			keyword:keyword
		}
	}, function(res) {
		// 将当前信息存入localStorage
		if(res){
			setNowTask(res);
			// 填充答案
			$('#newadurl').val(res.answer);


		}
	});

}


function setNowTask(data){
	// localStorage只能存字符串
	data = JSON.stringify(data);
	chrome.runtime.sendMessage({
		J_method:'setNowTask',
		data:data
	}, function(res) {

	});
}