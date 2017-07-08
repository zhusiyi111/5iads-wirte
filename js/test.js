
 var bg = chrome.extension.getBackgroundPage();
 bg.popup = window;

$('.refresh').click(function(){
	refresh();
})


function refresh(){
	
	if(bg && bg.data){
		var clickid = bg.data.clickid,
			url = bg.data.url,
			keyword = bg.data.keyword,
			realId = bg.data.realId;
			// answer = bg.data.answer,
			// website = bg.data.website,
			// searchUrl = bg.data.searchUrl,
			// title = bg.data.title; 

		$('.clickid').val(clickid);
		$('.url').val(url);
		$('.keyword').val(keyword);	
		$('.realId').val(realId);	
		$('.find').trigger('click');
		// $('.answer').val(answer);	
		// $('.website').val(website);	
		// $('.searchUrl').val(searchUrl ? searchUrl : getSearchUrl(url,title,website));	
		// $('.title').val(title);	
	}
}



// 添加 点击事件
$('.add').click(function(){
	$.ajax({
		url:'http://localhost:3000/task/addTaskInfo',
		method:'get',
		data:{
			taskid:$('.clickid').val(),
			url:$('.url').val(),
			keyword:$('.keyword').val(),
			realId:$('.realId').val(),
			answer:$('.answer').val(),
			searchUrl:$('.searchUrl').val(),
			title:$('.title').val(),
			website:$('.website').val()

		},
		success:function(data){
			console.log(data);
		}
	})
});

// 查询 点击事件
$('.find').click(function(){
	$.ajax({
		url:'http://localhost:3000/task/getTaskInfo',
		method:'get',
		data:{
			keyword:$('.keyword').val(),
			realId:$('.realId').val()
		},
		success:function(data){
			data = JSON.parse(data)[0];
			$('.answer').val(data.answer);	
			$('.website').val(data.website);
			$('.searchUrl').val(getSearchUrl(data.url,data.keyword,data.website));	
			$('.title').val(data.title);	
		}
	})	
})


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
		console.log(str);
		return str;
	}
}


$('.begin').click(function(){

	var win = window.open('about:blank');
	win.location.href = $('.searchUrl').val();
})

refresh();

$('#uploadBtn').click(doUpload);

function doUpload(){  
	var formData = new FormData($( "#uploadForm" )[0]);  
	$.ajax({  
	  url: 'http://api.ruokuai.com/create.json' ,  
	  type: 'POST',  
	  data: formData,  
	  async: false,  
	  cache: false,  
	  contentType: false,  
	  processData: false,  
	  success: sendCheckCode,  
	  error: function (returndata) {  
	      console.log(returndata);  
	  }  
	});  
}  

function sendCheckCode(data){
	console.log(data);
	if(data.result === false){
		return;
	}
	var tab = bg.sender.tab;
	data.sender = 'checkCode';
	chrome.tabs.sendMessage(tab.id, data, function(){

	})
}


function begin(){
	refresh();
	console.log('begin')
	$('.begin').trigger('click');
}