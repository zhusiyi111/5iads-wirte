// chrome.runtime.onMessage.addListener(function(data, sender, sendResponse){
// 	console.log(data);
// })




// function init(){

	// sendMsgToBg('mbaidu');


	
// }



// function sendMsgToBg(data){
// 	var data = {}
// 	data.sender = 'mbaidu';
// 	chrome.runtime.sendMessage(data, function(response){
// 		console.log(response);
// 		var target = $('h3').filter(function(){
// 			var _this = $(this);
// 			if(_this.text().indexOf(response)!==-1){
// 				return true;
// 			}
// 			return false;
// 		});
// 		console.log(target);
// 		setTimeout(function(){
// 			target.trigger('click');
// 		},5000);
		
// 	});
// }


// 打开后自动聚焦
$(function(){
	var url = location.href;
	if(url==='https://m.baidu.com/'||url==='http://m.baidu.com'){
		$('#index-kw').focus();
		$('#index-kw').on('blur',function(){
			$('#index-bn').trigger('click');
		})
	}
})

$(document).delegate('.c-container h3','click',function(){

	var item = $(this).closest('.c-container'),
		title = item.find('.c-title').text(),
		website = item.find('.c-line-clamp1 .c-showurl').eq(0).text();

	// 提取“/”之前的
	website = website.match(/[^\/]+/)[0];

	var data = {
		J_method:'setWebsiteAndTitle',
		data:{
			website:website,
			title:title
		}
	};
	chrome.runtime.sendMessage(data, function(response){

	});


})

