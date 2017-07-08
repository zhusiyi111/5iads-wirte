// chrome.runtime.onMessage.addListener(function(data, sender, sendResponse){
// 	console.log(data);
// })

var timer = setInterval(function(){
	if($('#content_left').length!==0){
		init();
		clearInterval(timer);
	}	
})


$(document).delegate('.t','click',function(){

	var item = $(this).closest('.result'),
		title = item.find('.t a[data-click]').text(),
		website = item.find('.c-showurl').text();

	// 提取“/”之前的
	website = website.match(/[^\/]+/)[0];

	var data = {
		INTERFACE:'addTitleAndWebsite',
		title:title,
		website:website
	};

	chrome.runtime.sendMessage(data, function(response){

	});

	var url = $(this).find('a[data-click]').attr('href'); 
	setTimeout(function(){
		window.location.href = url;
	},5000);
	
	return false;
})



function init(){

	sendMsgToBg('baidu');


	
}

function sendMsgToBg(data){
	var data = {}
	data.sender = 'baidu';
	chrome.runtime.sendMessage(data, function(response){
		console.log(response);
		var target = $('h3').filter(function(){
			var _this = $(this);
			if(_this.text().indexOf(response)!==-1){
				return true;
			}
			return false;
		}).find('a');
		console.log(target);
		target.trigger('click');
	});
}





var port = chrome.runtime.connect({name: "敲门"});
port.postMessage({joke: "敲门"});
port.onMessage.addListener(function(msg) {
	console.log(msg);
  if (msg.question == "是谁？")
    port.postMessage({answer: "女士"});
  else if (msg.question == "哪位女士？")
    port.postMessage({answer: "Bovary 女士"});
});