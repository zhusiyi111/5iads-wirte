

// 答案框点击判定代替失焦判定
$(document).delegate('#newadurl','click',function(){
	var val = $(this).val();
    clickUrlcheck(val);
})



var timer = setInterval(function(){

	if($('#tab').length!==0 && $('#tab span').eq(2).is('.active')){
		// 浏览广告页面
		// if($('#tab span').eq(2).is('.active')){
		// 	console.log('2')
		// 	var timer2 = setInterval(function(){
		// 		if($('.working').length===0){
		// 			var clickItem = $('.zhuanclick').eq(0);
		// 			console.log(clickItem)
		// 			if(clickItem.length===0){
		// 				setTimeout(function(){
		// 					location.reload();
		// 				},5000);
		// 				clearInterval(timer2);
		// 			}else{
		// 				console.log('click')
		// 				clickItem.trigger('click');
		// 			}
		// 		}
		// 	},500);
		// }


		// window.StartSurf = function(url,id,miao) {
		// 	brnum = miao + 10;
			
		// 	$('#firstCk').val('2');
		// 	//alert(url);
		// 	//dianjiWin = window.open('', "_blank","ViewAds" + id, "width=" + (screen.availWidth - 8) + ",height=" + (screen.availHeight - 60) + ",top=0,left=0,location=1,toolbar=1,directories=1,menubar=1,scrollbars=1,resizable=1,status=1,alwaysRaised=yes,z-look=yes");
		// 	if (dianjiWin == null || typeof(dianjiWin)=='undefined'){
		// 		'您使用的浏览器限制了弹窗，请关闭或把我爱广告任务网加入白名单！';
		// 		location.href=WebUrl + '/faq.asp?id=50';
		// 	}
			
		// 	openWindowWrite(dianjiWin,url)	//在新弹出窗口写入a链接，并自动点击
		// 	setTimeout(function(){
		// 		var win = deepCopy(dianjiWin);
		// 		win.close();
		// 	},20000);
		// 	leaveConfirm('任务进行中，确定要离开吗？');
		// 	//open_window(url);	//打开新窗口
		// 	//dianjiWin = window.open(url,"_blank","alwaysRaised=yes,z-look=yes");
		// 	SonMaximize();
		//     nInterval = setInterval("SurfGo()", brnum * 1000);
		//     isStartSurf = 1;
		// 	gocl(miao);
		// }


	
	setTimeout(function(){
		var timer = setInterval(function(){
			var pop = $('[aria-describedby="tasklist_dig"]');
			

			if(pop.css('display')==='none'){
				var item = $('#dianlitable tr[class!="zhuanitem taskdelline"]').find('td').eq(0);
				if(item.length>0){
					var thiswindow = dianjiWin;
					item.trigger('click');
					console.log(thiswindow);
					console.log('click');
					resetFunc(thiswindow);
					setTimeout(function(){
						thiswindow.close();
						console.log('close window')
					},15000);
				}else{
					console.log('over!refresh!');
					setTimeout(function(){location.reload() },5000);
				}

			}else{
				var item = $('#dianlitable tr[class!="zhuanitem taskdelline"]').find('td').eq(0);
				if(item.length==0){
					clearInterval(timer);
					console.log('over!refresh!');
					setTimeout(function(){location.reload() },5000);
				}
				console.log('wait');
			}

		},2032);
	},3065)

		clearInterval(timer);
	}
},200);



var deepCopy= function(source) { 
	var result={};
	for (var key in source) {
      result[key] = typeof source[key]==='object' ? deepCoypy(source[key]): source[key];
   } 
   return result; 
}


function resetFunc(win){
	win.alert = function(data){
		console.log('alert:'+data);
	}

	win.error_UI = function(data){
		console.log(data);
	}

	win.leaveConfirm = function(){
		console.log('离开页面');
	}
}



window.chksendBtn = function(){
	if(isSubmit){
		return false;	
	}
	/*
	if(!document.referrer|| document.referrer.split('/')[2] !=  document.domain){
		chkDesc('errortishi','请打开您的浏览器来访问本站',0);
		return false;
	}
	*/
	isSubmit = true;
	$('#TijiaoButton').addClass('inloading');
	$('#TijiaoButton').addClass('disabled');
	$('#TijiaoButton').attr("disabled","disabled");
	var clickid = getId("clickid").value;
	var newadurl = getId("newadurl").value;
		newadurl = trim(urlreplacejs(newadurl));

		newadurl = escape(newadurl);

	var refurl = document.referrer;
	var offText = getId("offText").value;
	var firstCk = getId("firstCk").value;
	var YzmCheck = getId("YzmCheck").value;
	var sign = getId("sign").value;
	var action = getId("action").value; 
	if(YzmCheck != 'success'){
		isSubmit = false;
		return isSubmit;
	} 
	if(getStrLen(newadurl) < 2){
		chkDesc('content_url','提交网址或文字为空',0);
		chkDescStatus('urlcheck',0);
		//$('#TijiaoButton').removeClass('inloading');
		isSubmit = false;
		return false;
	}
	
	if(firstCk!='2'){
		chkDesc('errortishi','您没有点击第一步，复制网址并打开!请重新按第一步，第二步，第三步，第四步来操作',2);
		getId("newadurl").value = '';
		if (offText!='offText'){
			getId("cktext").value = '';
		}
		$('#urlcheck').siblings("span,b").css("text-indent", "0");
		$('#txtcheck').siblings("span,b").css("text-indent", "0");
		chkDesc('content_url','请重新提交广告网址',0);
		chkDesc('content_txt','请重新提交广告文字',0);
		$('#urlcheck').removeAttr("class");
		$('#txtcheck').removeAttr("class");
		//$('#TijiaoButton').removeClass('inloading');
		isSubmit = false;
		return isSubmit;
	}
	/*
	if(getStrLen(newadurl)>255||getStrLen(newadurl)<4){
		chkDesc('errortishi','请输入4-255位字符的网址',0);
		isSubmit = false;
		return isSubmit;
	}	
	*/
	if (offText!='offText'){
		var cktext = getId("cktext").value;
		cktext = trim(stripscript(cktext));
		if(getStrLen(cktext) > 20 || getStrLen(cktext) < 2){
			chkDesc('errortishi','输入网页上的文字,2到20位字',0);
			$('#txtcheck').css('class','error');
			//$('#TijiaoButton').removeClass('inloading');
			isSubmit = false;
			return isSubmit;
		}
	}		

	/*
	if(!clickUrlcheck(newadurl)){
		isSubmit = false;
		return isSubmit;
	}
	if(!clicktextcheck(cktext)){
		isSubmit = false;
		return isSubmit;
	}
	*/
	var yzmValue=$('#yzm').val();
	if(!chkInt(yzmValue)){
		alert("请进行验证码验证操作后再来提交");
		$('#TijiaoButton').removeAttr('disabled'); 
		$('#TijiaoButton').removeClass('disabled'); 
		$('#TijiaoButton').removeClass('inloading'); 
		isSubmit = false;
		return isSubmit;
	}
	if(yzmValue.length!=3){
		alert("请进行验证码验证操作后再来提交");
		$('#TijiaoButton').removeAttr('disabled'); 
		$('#TijiaoButton').removeClass('disabled'); 
		$('#TijiaoButton').removeClass('inloading'); 
		isSubmit = false;
		return isSubmit;
	}

	if(sign == undefined){
		isSubmit = false;
		return isSubmit;
	}
	$.ajax({
		type: "POST",
		url: "module/click/",
		async: false,
		dataType: "json",
		data : "action="+action+"&firstCk="+firstCk+"&YzmCheck="+YzmCheck+"&yzmValue="+yzmValue+"&newadurl="+ newadurl +"&clickid="+clickid+"&cktext="+escape(cktext)+ "&offText="+offText+"&refurl="+refurl+"&sign="+sign+"&Isjiami=true&key="+Math.random(),
		success: function(strJson){ 
			console.log(strJson);
			if(strJson.status=='100'){
				rwrm(CurrentA,'finish.jpg');
				$('#TijiaoButton').removeAttr('disabled'); 
				$('#TijiaoButton').removeClass('disabled'); 
				dialog_close('tasklist_dig');
				//if(dianjiWin){dianjiWin.close();}
				alert('恭喜您！奖励成功');
				return true;
			}else if(strJson.status=='106' || strJson.status=='118'){
				rwrm(CurrentA,'timeErr.jpg');
				$('#TijiaoButton').removeAttr('disabled'); 
				$('#TijiaoButton').removeClass('disabled'); 
				location.reload();
				dialog_close('tasklist_dig');
				alert(strJson.msg);
				return true;
			}else if(strJson.status=='114'){
				$('#TijiaoButton').removeAttr('disabled'); 
				$('#TijiaoButton').removeClass('disabled'); 
				$('#TijiaoButton').removeClass('inloading'); 
				alert(strJson.msg);
				checkCodeError();
				return true;
			}else if(strJson.status=='yzmErrorNum'){
				rwrm(CurrentA,'timeErr.jpg');
				dialog_close('tasklist_dig');
				$('#TijiaoButton').removeAttr('disabled'); 
				$('#TijiaoButton').removeClass('disabled'); 
				$('#TijiaoButton').removeClass('inloading'); 
				alert(strJson.msg);
				return false;
			}else if(strJson.status=='120'){
				alert(strJson.msg);
				location.href ="http://www.5iads.cn/Notice/detail.asp?id=1060";
				return false;				
			}else{		
				//dialog_close('tasklist_dig');
				alert(strJson.msg);
				isSubmit = false;
				return isSubmit;
			}
		}
	})
}


var formHtml =  '<form id="errorUpload">'+
					'<input type="hidden" name="username" value="chinaberry">'+
					'<input type="hidden" name="password" value="zhusiyizsy">'+
					'<input type="hidden" name="softid" value="84232">'+
					'<input type="hidden" name="softkey" value="f3233971a6884688a2e94ed75063fb13">'+
					'<input type="hidden" name="id" value="" id="errorCheckCodeId">'+
				    '<input type="button" value="上传" id="errorUploadBtn"/>  '+
				'</form> ';

$('body').append(formHtml);


$(document).delegate('#errorUpload','click',function(){
	var formData = new FormData($( "#errorUpload" )[0]);  
	$.ajax({  
		url: 'http://api.ruokuai.com/reporterror.json' ,  
		type: 'POST',  
		data: formData,  
		async: false,  
		cache: false,  
		contentType: false,  
		processData: false,  
		success: function(data){console.log(data)},  
		error: function (returndata) {  
		  console.log(returndata);  
		}  
	})
})


function checkCodeError(id){
	$('#errorUploadBtn').trigger('click');
}




var floatDiv = '<div id="floatDiv"></div>';
$('body').append(floatDiv);
$('#floatDiv').css({
	width:'30px',
	height:'30px',
	position:'fixed',
	top:0,
	left:0,
	'z-index':99999,
	'background-color':'green'
})

$(document).delegate('#floatDiv','click',function(){
	console.log($('#floatDiv').css('background-color'))
	if($('#floatDiv').css('background-color')==='rgb(0, 128, 0)'){
		$('#floatDiv').css('background-color','black');
	}else{
		$('#floatDiv').css('background-color','green');
	}
})