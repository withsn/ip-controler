/**
 *  ip控件
 */

//根据需要选择统一设置IP框输入数值限制还是分别设置每个框输入数值限制
(function($){
	$.fn.addIpinput = function(isIP){
		this.append("<input class=IPInput id=ip1 type=text name="+ isIP +" size=3 maxlength=3>.");
		this.append("<input class=IPInput id=ip2 type=text name="+ isIP +" size=3 maxlength=3>.");
		this.append("<input class=IPInput id=ip3 type=text name="+ isIP +" size=3 maxlength=3>.");
		this.append("<input class=IPInput id=ip4 type=text name="+ isIP +" size=3 maxlength=3>");
	}
})(jQuery);

(function($){
	$.fn.addIpinput = function(first,second,third,fourth){
		this.append("<input class=IPInput id=ip1 type=text name="+ first +" size=3 maxlength=3>.");
		this.append("<input class=IPInput id=ip2 type=text name="+ second +" size=3 maxlength=3>.");
		this.append("<input class=IPInput id=ip3 type=text name="+ third +" size=3 maxlength=3>.");
		this.append("<input class=IPInput id=ip4 type=text name="+ fourth +" size=3 maxlength=3>");
	}
})(jQuery);

$(document).on("keydown",".IPInput",function(event){
	keydown(this,event);
});

$(document).on("input",".IPInput",function(event){
	var oldpos = getPos(this);
	this.value = this.value.replace(/[^0-9]/g,'');
	setPos(this,oldpos);
});
var lastPos = null;
var keychar = null;
var curpos = null;

function replacement(str,pos){//BackSpace for FF
	var resultstr = str.substring(0,pos-1) + str.substring(pos,str.length);
	return resultstr;
}

function stopdefault(event){
	if(isIe()){
		if(isIE11()){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
		event.keyCode = 0;
	}else{
		event.preventDefault();
		event.keyCode = 0;
	}
}

function getPos(obj){		//获取光标在当前输入框的位置
	var ctrl = $(this).get(0);
	var curpos = -1;
	if(document.selection){//IE
		obj.focus();
		var workRange=document.selection.createRange();//focus后光标位置在输入框开头 
		obj.select();
		var allRange=document.selection.createRange();//select后光标位置在输入框末尾
		workRange.setEndPoint("StartToStart",allRange);
		curpos=workRange.text.length;   
		workRange.collapse(false);   
		workRange.select();
	}else{//非IE
		curpos = obj.selectionStart;
	}
	return curpos;
}

function setPos(obj,idx){		//跳转到对应输入框后，设置光标在该输入框中的位置
	
	if ( idx < 0 )
    {
        return;
    }
	var elem  = obj;
    var val   = elem.value;
    var len   = val.length;
    var index = idx;
 // 非input和textarea直接返回
    var $elem = $(elem);
    if (!$elem.is('input,textarea')) return;
	if(isIe()){
		range=obj.createTextRange();    
		range.collapse(true);    
		range.moveStart('character',idx);    
		range.select();
	}else if(elem.setSelectionRange){
		elem.setSelectionRange(index, index);
	}
}

function keydown(obj1, e){

	lastPos = getPos(obj1);
	var event = e ? e : window.event;
    var code = event.which ? event.which : event.keyCode;
/* 	
*	获取键盘具体输入值
*/
	var numcheck = /\d/;
	keychar = String.fromCharCode(code);
	res = numcheck.test(keychar);
	var Children = $("#" + obj1.offsetParent.id).children().not("[disabled]");
	var lastChild = $("#" + obj1.offsetParent.id).children().not("[disabled]").last();
	var x = $("#" + obj1.offsetParent.id).children().not("[disabled]").index(obj1);
	var next = $("#" + obj1.offsetParent.id).children().not("[disabled]").slice(x+1,x+2);
	if(obj1 == lastChild[0]){
		var y = 111111;
	}
	if(code >= 112 && code <= 123){//F1 - F12使用默认方法
		return;
	}
	
    if((code == 110 || code == 190 || code == 13 || code === 32) && getPos(obj1) == obj1.value.length
    && obj1.nextElementSibling){//110小键盘小数点      190 小数点   13 回车    32 space
			if((code == 110 || code == 190)&& obj1.value.length == 0){
				return false;
			}
    		obj1.nextElementSibling.focus();
			obj1.nextElementSibling.select();
			stopdefault(event);
			code = 0;
			return false;
    }
    
//    if(code == 9){// Tab
//    	if(obj1.nextElementSibling){
//			obj1.nextElementSibling.focus();
//			obj1.nextElementSibling.select();
//			stopdefault(event);
//			code = 0;
//			return false;
//    	}
//    }
    
	if(code == 8){//BackSpace
		if(obj1.previousElementSibling){
			if(lastPos == 0){
				obj1.previousElementSibling.focus();
				setPos(obj1.previousElementSibling,obj1.previousElementSibling.value.length);
		 		stopdefault(event);
		 		code = 0;
		  		lastPos = getPos(obj1.previousElementSibling);
		        return false;
			}
		}
		if(isFF()){//BackSpace for FF
			var nowpos = getPos(obj1);
			obj1.value = replacement(obj1.value,nowpos);
			setPos(obj1,nowpos - 1);
			return;
		}
	}

	if(code === 39){//Right arrow
		if(obj1.nextElementSibling){
			if(getPos(obj1) == obj1.value.length){
				obj1.nextElementSibling.focus();
				lastPos = getPos(obj1.nextElementSibling);
				setPos(obj1.nextElementSibling,0);
				stopdefault(event);
				code = 0;
		        return false;
			}
		}
		if(isFF()){//Right arrow for FF
			var nowpos = getPos(obj1);
			setPos(obj1,nowpos*1 + 1);
			return;
		}
	}
	
	if(code === 37){//Left arrow
		if(obj1.previousElementSibling){
			if(lastPos == 0){
				obj1.previousElementSibling.focus();
				setPos(obj1.previousElementSibling,obj1.previousElementSibling.value.length);
				stopdefault(event);
		  		lastPos = getPos(obj1.previousElementSibling);
		  		code = 0;
		        return false;
				}
			}
		if(isFF()){//Left arrow for FF
			var nowpos = getPos(obj1);
			setPos(obj1,nowpos * 1 - 1);
			return;
		}
	}
	
    if(!((code>=48&&code<=57)||(code>=96&&code<=105)||code==190||code==13
    		||code==9||code==39||code==8||code==46||code==99||code==37)){
		stopdefault(event);
		code = 0;
		return false;
    }
    
    if(event.shiftKey || event.altKey){//禁用shift || alt
		stopdefault(event);
		code = 0;
		return false;
    }
    
	setTimeout(function(){

	if(obj1.value > 254 && obj1.attributes.name.value == "1"){
		obj1.value = 254;
		setPos(obj1,0);
		return;
	}
	
	if(obj1.value > 255 && obj1.attributes.name.value == "0"){
		obj1.value = 255;
		setPos(obj1,0);
		return;
	}
	
	if(obj1.value < 1 && obj1.value.length >=3){
		obj1.value = 1;
		setPos(obj1,0);
		return;
	}
		
		if(obj1.value.length>=3&&!isNaN(keychar)&&getPos(obj1) === 3&& code!=37&&code!=39&&code!=16&&code!=9&&code!=13){
			if(obj1.nextElementSibling){
				obj1.nextElementSibling.focus();
			   	lastPos = getPos(obj1.nextElementSibling);
			   	if(isIe()||isIE11()){
			   		setPos(obj1.nextElementSibling,0);
			   	}
			   	obj1.nextElementSibling.select();
			}
		}
	},5);
}

function get_ip(modelID)
{
	var param_1 = $("#"+ modelID + " #ip1");
	var param_2 = $("#"+ modelID + " #ip2");
	var param_3 = $("#"+ modelID + " #ip3");
	var param_4 = $("#"+ modelID + " #ip4");
	
	var ip = param_1[0].value + "." + param_2[0].value + "." + param_3[0].value + "." + param_4[0].value;
	
	return ip;
}

function set_ip(modelID, value)
{
	if(value == ""){
		var parentdiv = $("#" + modelID);
		parentdiv.children("#ip1")[0].value = value;
		parentdiv.children("#ip2")[0].value = value;
		parentdiv.children("#ip3")[0].value = value;
		parentdiv.children("#ip4")[0].value = value;
	}
	
	if(!IsIP(value)){
		return;
	}
	
	var data = value.split(".");
	var parentdiv = $("#" + modelID);
	parentdiv.children("#ip1")[0].value = data[0];
	parentdiv.children("#ip2")[0].value = data[1];
	parentdiv.children("#ip3")[0].value = data[2];
	parentdiv.children("#ip4")[0].value = data[3];
}

function set_subnet(modelID, value)
{
	if(value == ""){
		var parentdiv = $("#" + modelID);
		parentdiv.children("#ip1")[0].value = value;
		parentdiv.children("#ip2")[0].value = value;
		parentdiv.children("#ip3")[0].value = value;
		parentdiv.children("#ip4")[0].value = value;
	}
	
	if(!checkMask(value)){
		return;
	}
	
	var data = value.split(".");
	var parentdiv = $("#" + modelID);
	parentdiv.children("#ip1")[0].value = data[0];
	parentdiv.children("#ip2")[0].value = data[1];
	parentdiv.children("#ip3")[0].value = data[2];
	parentdiv.children("#ip4")[0].value = data[3];
}


function disable_div(modelID)
{
	var input_list = $("#"+modelID)[0].getElementsByTagName("INPUT");
	
	$.each(input_list, function(){
		this.disabled = true;
	});
	
	$("#"+modelID).css("background","rgb(235,235,228)");
}

function enable_div(modelID)
{
	var input_list = $("#"+modelID)[0].getElementsByTagName("INPUT");
	
	$.each(input_list, function(){
		this.disabled = false;
	});
	
	$("#"+modelID).css("background","rgb(255,255,255)");
}

function value_change(modelID)
{
	var model_list = $("."+modelID);
	
	$.each(model_list, function(){
		var input_list = $(this)[0].getElementsByTagName("INPUT");
		$.each(input_list, function(){
			$(this).on("keyup", function(event){
				var e = event ? event : window.event;
			    var code = e.which ? e.which : e.keyCode;
			    if((code > 47 && code < 58) || (code > 95 && code < 106)){
			    	if(modelID == "pc_ip_base"){
						$("#SetPcmsg")[0].disabled = false;
					}else if(modelID == "pc_udp_ip"){
						dlg_need_save = 1;
					}else if(modelID == "mcs_base_ip"){
						$("#apply")[0].disabled = false;
					}else if(modelID == "sta_base_ip"){
						$("#SetStamsg")[0].disabled = false;
					}
			    }
				
			});
		});
	});	

}
