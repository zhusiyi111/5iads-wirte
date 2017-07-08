// chrome.runtime.onMessage.addListener(function(data, sender, sendResponse){
// 	console.log(data);
// })



$(document).delegate('.t','click',function(){

	var item = $(this).closest('.result'),
		title = item.find('.t a[data-click]').text(),
		website = item.find('.c-showurl').text();

	// 提取“/”之前的
	website = website.match(/[^\/]+/)[0];

	var data = {
		title:title,
		website:website
	};

	//把信息发到后台
	chrome.runtime.sendMessage({
		J_method:'setWebsiteAndTitle',
		data:data
	}, function(res) {

	});

	var url = $(this).find('a[data-click]').attr('href'); 
	setTimeout(function(){
		window.location.href = url;
	},0);
	
	return false;
})



// function init(){

// 	sendMsgToBg('baidu');


	
// }

// function sendMsgToBg(data){
// 	var data = {}
// 	data.sender = 'baidu';
// 	chrome.runtime.sendMessage(data, function(response){
// 		console.log(response);
// 		var target = $('h3').filter(function(){
// 			var _this = $(this);
// 			if(_this.text().indexOf(response)!==-1){
// 				return true;
// 			}
// 			return false;
// 		}).find('a');
// 		console.log(target);
// 		target.trigger('click');
// 	});
// }





// 
// 
// 



