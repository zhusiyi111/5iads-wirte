

// 加载广告列表  主要改动：修改请求弹窗内容 
window.loadClickList = function(pagenum){
	var showtype;
	if(showtype !=null && showtype.toString().length>1)
	{
	   showtype = showtype ;
	} else {showtype ="list";}	//grid



	$.ajax({
		url : '/module/click/',
		type : 'post',	
		data : {
			action : 'loadClickList',
			row : 20,
			pagenum : pagenum
		},
		success : function(response, status, xhr){
			if (response !== ""){
				/*加载点击广告列表开始*/
				var json = $.parseJSON(response);
				if (json =="") {
					error_UI('温馨提示：',"感谢您的到来，目前没有可操作的广告！请等待...",3000);
					$('#click').find('h2').html("<span>亲！</span>感谢您的到来，目前没有可操作的广告！请等待...");
					return false;
				}
				var html = '';
					if (showtype =="grid"){
						html += "<h2><span>点击广告</span><i>按广告商提供的点击要求进行操作，没有点击广告直接提交的用户一律封号！</i><b></b></h2>";
						html += "<div class=\"con clearfix running_box\">";
					}
					/*用户是否已经登录*/
				if (json.status=='Nologin'){popupLogin();return false;}
				if (json.status=='stop'){alert(json.message);location.href = json.refurl;return false;}
				$.each(json, function (index, value) {
					if (value.status=='success'){
						TotalCount = value.TotalCount;
						PageCount = value.PageCount;
						if (showtype =="list"){
							html +='<tr class=\"zhuanitem\" dataid="'+value.id+'">';
							html +='	<td class=\"zhuanclick\" style="text-align: left;"><img src="http://static.5iads.cn/include/image/click.jpg" border=0><span class="title">'+value.title.substring(0, 30)+'</span></td>';
							html +='	<td><span class="txtcg">'+value.pjine+'</span></td>';
							html +='	<td><span class="txt45">'+value.vjine+'</span></td>';
							html +='	<td><span class="jubao curpointer" onclick=\"jibao(\'click\',\''+value.id+'\')\">举报</span></td>';
							html +='</tr>';
						}else{
							html += "<a class=\"item zhuanitem\" dataid=\""+value.id+"\">";
							html += "<div class=\"zhuanclick content\">";
							html += "	<div class=\"row normal clearfix\">";
							html += "		<img src=\"/include/images/adver/click.jpg\">";
							html += "		<div class=\"row hover\">";
							html += "			<div class=\"mask3\"></div>";
							html += "			<div class=\"wrapper\">";
							html += "				<h3 class=\"clearfix\">参加人数："+value.okdnum+"位</h3>";
							html += "				<div class=\"br\">"+value.title+"</div>";
							html += "				<div class=\"try-btn\">立即点击</div>";
							html += "			</div>";
							html += "		</div>";
							html += "	</div>";
							html += "	<div class=\"title\">";
							html += "		<div class=\"br\">";
							html += "			<div class=\"reward\">普通奖励：<em>"+value.pjine+"</em>";
							html += "				<span >金币</span>";
							html += "			</div>";
							html += "			<div class=\"partake\">数量：<em>"+value.dnum+"</em></div>";
							html += "		</div>";
							html += "		<div class=\"br\">";
							html += "			<div class=\"reward\">VIP奖励：<em>"+value.vjine+"</em>";
							html += "				<span>金币</span>";
							html += "			</div>";
							html += "			<div class=\"partake jubao\" onclick=\"jibao('click','"+value.id+"')\">举报</div>";
							html += "		</div>";
							html += "	</div>";
							html += "</div>";
							html += "</a>";
						}
						
					}else{
						html +="数据加载超时！请稍候再刷新试试！";
					}
				});
				
				if (showtype =="list"){
					$('#clicktable').html(html).text();
				}else{
					html += "</div>";
					//html += "<span class=\"load-more\" onclick=\"loadClickList();\">点击刷新广告</span>";
					$('#click').html(html).text();
				}
				
				/*如果用户提现达到10元就可以进行翻页*/
				if (atjine>20000){
					if (TotalCount!=='' && TotalCount!==undefined){$('#clickpage').html(getpage('总条数',pagenum,TotalCount,PageCount,'loadClickList'));}
				}else{
					$('#clickpage').html("<span class=\"load-more\" onclick=\"loadClickList();\">点击刷新广告</span>");
				}

				//	加载完列表后
				afterGetList();
				
				/*加载点击广告列表结束*/
				/*显示广告内容开始*/
				$.each($('.zhuanitem'), function (index, value) {
						$(this).on('click', '.zhuanclick', function () {
							CurrentA = $('.zhuanitem').eq(index)
							
							$.ajax({
									url : '/module/click/',
									type : 'POST',												
									data : {
										Isjiami : 'false',
										clickid : $('.zhuanitem').eq(index).attr('dataid'),	
										action : 'Show_click_getone'
									},
									//显示正在加载中
									beforeSend : function(jqXHR, settings){
										//显示正在发表的提示
										loadingTip('数据正在加载中...');
									},
									success : function(response, status, xhr){
											var tablehtml = '';
											var a_id ;
										//alert(response);
										if (response !== ""){
											var json_content = $.parseJSON(response);
											
											/*
											//加载验证码											
											if (clickVerify == 1){gt_captcha_obj.appendTo("#geetest");$(".geetest").fadeIn();}
											*/
											
											//检测联盟重复
											//alert(json_content.status);
											switch(json_content.status){
												case 'Nologin':
													dialog_close('loading');
													popupLogin();
													return false;
													break;
												case '106':
													dialog_close('loading');
													error_UI('温馨提示：',json_content.message,3000); 
													rwrm(CurrentA,'timeErr.jpg');
													return false;
													break;
												case 'timeErr':	//检测该时间段内是否可以点击
													dialog_close('loading');
													error_UI('温馨提示：',json_content.message,3000); 
													rwrm(CurrentA,'timeErr.jpg');
													return false;
													break;
												case 'unionErr':
													tablehtml +="<div class=\"working\">";
													tablehtml +="	<div class=\"wrapper\">";
													tablehtml +="		<div class=\"con\">";
													tablehtml +="		<div class=\"clearcookietishi\"><img src=\"/include/images/jinggao.gif\"><span>您需要清除浏览记录,才能显示广告！</span></div>";
													tablehtml +="		<div class=\"clearcookietishi\"><span>请选择您操作的浏览器来清除缓存中的COOKIES</span></div>";
													tablehtml +="		<div class=\"clearcookietishi\"><span>下面是各类浏览器清楚缓存的操作攻略及帮助！</span></div>";
													tablehtml +="		<div class=\"browser_logos\">";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"uc\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"br360secure\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"chrome\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"cheetah\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"firefox\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"maxthon\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"ninesky\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"opera\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"qq\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"safari\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"sogou\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"webkit\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"br360jisu\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"br2345\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"theworld\"></a>";
													tablehtml +="			<a target=\"_blank\" href=\"/help/detail.asp?CategoryId=6&id=47\" class=\"brinter\"></a>";
													tablehtml +="		</div>";
													tablehtml +="		<div class=\"br sub\">";
													//tablehtml +="			<input type=\"button\"  value=\"已清除\" id=\"ClearCookies\" onclick=\"ClearCookies();\" />";
													tablehtml +="			<input name=\"clickid\" id=\"clickid\" value=" +json_content.id+ " type=\"hidden\" />";
													tablehtml +="			<input name=\"sign\" id=\"sign\" value=" +json_content.sign+ " type=\"hidden\"/>";
													tablehtml +="			<input type=\"button\" class=\"fangqi\" value=\"放弃\" id=\"fangqi\" onclick=\"click_jump_idXMLHttp();\"/>";
													tablehtml +="		</div>";
													tablehtml +="	</div>";
													tablehtml +="	</div>";
													tablehtml +="</div>";
													$('#tasklist_dig').html(tablehtml).text();
													dialog_close('loading');
													break;
												case 'success':
													tablehtml +="<div class=\"working\">";
													tablehtml +="	<div class=\"wrapper\">";
													tablehtml +="		<div class=\"con\">";
													tablehtml +="			<div class=\"working_1\"><span>第一步：打开网站</span><input name=\"workUrl\" id=\"workUrl\" type=\"text\" value=\""+ json_content.url +"\" onclick=\"javascript:openWindow('"+json_content.url+"','"+json_content.id+"');firstclick();\"/>";
													/*
													if (isIe()){
														tablehtml+= "		<a id=\"CopyUrl\" rel=\"noreferrer\" onclick=\"javascript:copyToClipBoard('workUrl');firstclick();\">单击复制广告网址</a><p id=\"fristtishi\"><!--读取后用来显示的区域--></p></div>";
													}else{
														tablehtml+= "		<span id=\"clip_container\"><a id=\"CopyUrl\" rel=\"noreferrer\" class=\"my_clip_button\" data-clipboard-target=\"workUrl\" data-clipboard-text=\"Default clipboard text from attribute\">单击复制广告网址</a></span><p id=\"fristtishi\"><!--读取后用来显示的区域--></p></div>";
													}*/
													
													tablehtml +="			<a id=\"CopyUrl\" rel=\"noreferrer\" onclick=\"javascript:openWindow('"+json_content.url+"','"+json_content.id+"');firstclick();\">点此打开网站</a></div>";
													
													
													tablehtml +="			<div class=\"working_2\"><span>第二步：按以下【广告商的】要求对打开的网站进行操作</span></div>";
													tablehtml +="			<div class=\"yaoqiu\">";
													tablehtml +=				json_content.yaoqiu;
													tablehtml +="			</div>";
													tablehtml +="			<div class=\"working_2\"><span>最后要求：</span></div>";
													tablehtml +="			<div class=\"lastrequest\">";
													tablehtml +=				json_content.lastrequest;
													tablehtml +="			</div>";
													tablehtml +="			<div id=\"mainClick\" style=\"display:none;\">";
													tablehtml +="			<form name=\"working_form\" id=\"working_form\"  method=\"post\">";
													tablehtml +="				<div class=\"working_3\"><span>第三步：点击操作后，提交广告商要求中需要提交资料（如网址或文字）</span></div>";
													tablehtml +="					<div class=\"br txt\">";
													tablehtml +="						<label>提交结果：</label><span>最终要求中需要提交的广告网址或文字</span>";
													tablehtml +="						<input name=\"newadurl\" id=\"newadurl\" type=\"text\" onblur=\"clickUrlcheck(this.value);\" onclick=\"chkDesc('content_url','输入点击要求中最终需要提交的广告网址或文字',2)\" />";
													tablehtml +="						<span id=\"urlcheck\" class=\"\"></span><p id=\"content_url\"><!--读取后用来显示的区域--></p>";
													tablehtml +="					</div>";
													if (json_content.offText =="On"){
														tablehtml +="				<div class=\"working_4\"><span>第四步: 等广告网站完全打开后,提交广告网页中显示的任意两个连续汉字</span></div>";
														tablehtml +="					<div class=\"br txt\">";
														tablehtml +="						<label>验证文字：</label><span>广告网址网页上任意两个文字</span>";
														tablehtml +="						<input name=\"cktext\" id=\"cktext\" type=\"text\" maxlength=\"20\" onblur=\"clicktextcheck(this.value);\" onclick=\"chkDesc('content_txt','输入验证关键字',2)\" />";
														tablehtml +="						<span id=\"txtcheck\" class=\"\"></span><p id=\"content_txt\"><!--读取后用来显示的区域--></p><input name=\"offText\" id=\"offText\" value=\"OnText\" type=\"hidden\" />";
														tablehtml +="					</div>";
													}else{
														tablehtml +="			<div><input name=\"offText\" id=\"offText\" value=\"offText\" type=\"hidden\" /></div>"
													}
													tablehtml +="			<div class=\"working_yzm\"><span>验证码操作：请按图片中显示的大写数字来在下边选择相应的数字</span></div>";
													tablehtml +="			<div class=\"yianzhengma\">";
													tablehtml +="						<img src=\"/bmpWork.asp?r="+Math.random()+"\" /><input name=\"yzm\" id=\"yzm\" type=\"hidden\" /><br />";
													tablehtml +="						<span id=\"yzm1\" class=\"nosel\" onclick=\"selectyzm(1);\">1</span>";
													tablehtml +="						<span id=\"yzm2\" class=\"nosel\" onclick=\"selectyzm(2);\">2</span>";
													tablehtml +="						<span id=\"yzm3\" class=\"nosel\" onclick=\"selectyzm(3);\">3</span><br />";
													tablehtml +="						<span id=\"yzm4\" class=\"nosel\" onclick=\"selectyzm(4);\">4</span>";
													tablehtml +="						<span id=\"yzm5\" class=\"nosel\" onclick=\"selectyzm(5);\">5</span>";
													tablehtml +="						<span id=\"yzm6\" class=\"nosel\" onclick=\"selectyzm(6);\">6</span><br />";
													tablehtml +="						<span id=\"yzm7\" class=\"nosel\" onclick=\"selectyzm(7);\">7</span>";
													tablehtml +="						<span id=\"yzm8\" class=\"nosel\" onclick=\"selectyzm(8);\">8</span>";
													tablehtml +="						<span id=\"yzm9\" class=\"nosel\" onclick=\"selectyzm(9);\">9</span>";
													tablehtml +="						<p>注：选中的数字会绿色底显示；再次点击可取消选择！</p>";
													tablehtml +="			</div>";
													tablehtml +="				<div class=\"br sub\">";
													tablehtml +="					<input type=\"button\" class=\"disabled\" value=\"提交广告\" id=\"TijiaoButton\" onclick=\"isSubmit = false;chksendBtn();\" disabled='disabled'/>";
													tablehtml +="					<a class=\"jibao\" target=\"_blank\" href=\"Customer/jibao.asp?jibaotype=click&AdverName="+$(".zhuanclick .title").eq(index).html()+"&jubaoObj=1&jibaoid="+json_content.id+ "\">举报</a>";
													tablehtml +="					<input type=\"button\" class=\"abandon\" value=\"放弃\" id=\"abandon\" />";
													tablehtml +="				</div>";
													tablehtml +="				<div class=\"br\">";
													tablehtml +="					<div class=\"error_div\"><span id=\"errortishi\"></span></div>";
													tablehtml +="					<input name=\"clickid\" id=\"clickid\" value=" +json_content.id+ " type=\"hidden\" />";
													tablehtml +="					<input name=\"action\" id=\"action\" value=" +json_content.action+ " type=\"hidden\" />";
													tablehtml +="					<input name=\"YzmCheck\" id=\"YzmCheck\" value=\"wait\" type=\"hidden\" />";
													tablehtml +="					<input name=\"sign\" id=\"sign\" value=" +json_content.sign+ " type=\"hidden\"/>";
													tablehtml +="					<input name=\"firstCk\" id=\"firstCk\" value=\"1\" type=\"hidden\" />";
													tablehtml +="				</div>";
													tablehtml +="			</form>";
													tablehtml +="			</div>";
													tablehtml +="		</div>";
													tablehtml +="	</div>";
													tablehtml +="</div>";
													if (!isIe()){
														tablehtml +="<script type=\"text/javascript\">";
														tablehtml +="$(\".my_clip_button\").each(function(){ ";
														tablehtml +="var id=this.id; ";
														tablehtml +="var pid = $(this).prev().attr(\"id\");";
														tablehtml +="var clip = new ZeroClipboard(document.getElementById(id), {";
														tablehtml +="moviePath: \"include/js/ZeroClipboard.swf\"";
														tablehtml +="} );	";
														tablehtml +="clip.on( 'complete', function(client, args) {";
														tablehtml +="firstclick();";
														tablehtml +=' success_UI("复制成功，复制内容为:",args.text,500); ';
														tablehtml +="$('#fristtishi').html('网址已复制，请手动粘贴到浏览器地栏中');";
														tablehtml +="} );";
														tablehtml +="}) ;";
														tablehtml +="</"+"script>";
													}
													//alert(value.id); 
													a_id = json_content.id;
													$('#tasklist_dig').html(tablehtml).text();
													//内容页图片点击放大效果
													var imgBoxMod=$(".yaoqiu img ,.imageTip img");
													imgPop(imgBoxMod);
													break;
												default :
													tablehtml +="<!------加载错误 开始-------->";
													tablehtml +="<div id=\"list_loadErr\" class=\"link_list_none\" style=\"display: block;\">";
													tablehtml +="	<img src=\"/include/images/jinggao.gif\">";
													tablehtml +="	<span>";
													tablehtml +="		<h4 id=\"h_no\">亲，系统开小差了！</h4>";
													tablehtml +="		<p>建议您：联系网站客服打它小屁股^_^。</p><br>";
													tablehtml +="		<p><a target=\"_blank\" href=\"/help.asp\">联系网站客服&gt;&gt;</a><a href=\"javascript:dialog_close('tasklist_dig')\">关闭对话框&gt;&gt;</a></p>";
													tablehtml +="	</span>";
													tablehtml +="	<div class=\"clear\"></div>";
													tablehtml +="</div>";
													tablehtml +="<!------加载错误 结束-------->";
													$('#tasklist_dig').html(tablehtml).text();
													break;
											}
										
											setTimeout(function(){
												if (clickVerify ==0){$('#tasklist_dig').dialog('open');$('#YzmCheck').val('success');$("#tasklist_dig").css({height: 'auto'})}
												loadingClose();	//关闭loading

												afterPopShow();
											},300);																					
										}
									}
							});		
															
						});
					});
				/*显示广告内容结束*/
			}else{
				$('#tasklist_dig').html('数据加载超时！请稍候再刷新试试！')
			}
		}
	})
}






$(function(){
	loadClickList();
})





// 获取到任务列表后的操作
function afterGetList(){
	displayId();
}

// 打开悬浮窗之后的操作
function afterPopShow(){
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

}



// 在任务名称后显示id
function displayId(){
	$('.zhuanitem').each(function(){
		var _this = $(this),
			clickid = _this.attr('dataid');
		var realId = clickid.charAt(2)+clickid.charAt(3)+clickid.charAt(5)+clickid.charAt(7)+clickid.charAt(9);
		var html = '<em>真实任务id：</em><span style="color:blue" class="realid">'+realId+'</span><span style="display:none" class="myid">'+clickid+'</span>';
		_this.find('.zhuanclick').append(html);
	})
}