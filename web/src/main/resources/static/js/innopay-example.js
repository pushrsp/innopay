var ediDate='';
var payActionUrl="https://pg.innopay.co.kr";
// var payActionUrl="https://dev-pg.innopay.co.kr";
var device='';
var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var iw = 680;
var ih = 680;
var formName='InnopayForm';
var rtn;
var flag=false;
var m_debug=false;
var m_test=false;
function setPayActionUrl(val) {
	payActionUrl='https://pg.innopay.co.kr';
};
function setEdiDate(f){
	var dateObj = new Date();
	var hours = dateObj.getHours();
	var minutes = dateObj.getMinutes();
	var seconds = dateObj.getSeconds();
	hours = hours ? hours : 0; // the hour '0' should be '12'
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	var strTime = hours.toString() + minutes.toString() + seconds.toString();
	var month = dateObj.getMonth() + 1;
	month = month < 10 ? '0' + month.toString() : month.toString();
	var date = dateObj.getDate();
	date = date < 10 ? '0' + date.toString() : date.toString();
	ediDate=dateObj.getFullYear()+month+date+strTime;
	addHidden(f,'ediDate',ediDate);	//add ediDate
};
var scroll_disable = function(){
	  $('html, body').addClass('of_hidden');
	};
	var scroll_enable = function(){
		  $('html, body').removeClass('of_hidden');
		};
function setMoid(frm){
	if(!checkFormField(frm,'Moid')||!checkFormValue(frm,'Moid')){
		var a = jQuery('input[name=MID]',jQuery(frm)).val();
		var b = new Date().getTime();
		addHidden(frm, 'Moid', a+b);
	}
};
var innopay={	
    goPay:function(data){
    			if(!init(data))return false;
    			var formObj = jQuery('form[name='+formName+']');
    			formObj.submit();
    },
	closeDiv:function(){
		var obj=document.getElementById('innoDiv');
		  try{
			if(obj!=null&&obj!=undefined){
				obj.style.display="none";
				document.body.removeChild(obj);
				scroll_enable();
			}
		  }catch(e){}
		  try{
              $('form[name='+formName+']').remove();
		  }catch(e){}
	},
	goPayForm:function(pform){
		var arrObj=jQuery(pform).serializeArray();
    	var fmobj = {};
    	jQuery.each(arrObj, function(k,v){
    		fmobj[v.name]=v.value;
    	});
    	innopay.goPay(fmobj);
	},
    goAcct:function(){
        loadAcctForm();
        var formObj = jQuery('form[name=InnoAcct]');
        formObj.submit();
    }
};
function init(data){
	var f = createForm(formName,'POST','','');
	setEdiDate(f);
	setPayActionUrl();
	device=checkDevice(f);
	if('mobile'==device){
		addHidden(f, 'RequestType', 'Mobile');
	}else{addHidden(f, 'RequestType', 'Web');}
	var rst=checkData(f,data);
	if(!rst) return false;
	makeEncKey(f);
	//var fwd=jQuery('input[name=FORWARD]',jQuery(f)).val();
	var fwd="X";
	f.action=payActionUrl+'/ipay/interfaceURL.jsp';
	if('X'==fwd){
		var lPos=(window.innerWidth-iw)/2;
		var tPos=(window.innerHeight-ih)/2;
		if((window.innerWidth-iw)<0){iw=422;lPos=0;}
		if((window.innerHeight-ih)<0){ih=600;tPos=0;}
		var insDiv = '';
		if('mobile'==device){
			if(data.MobileOpt == 'R' && data.PayMethod == 'CARD'){
				f.target="_self";
				f.submit();
				return true;
			}
			insDiv += "<div class=\"popWrapper iPhone_scroll\" style=\"position:fixed;top:0;left:0;width:100%;height:100%; z-index:1000000000000000;@media screen and (max-width:690px){.popWrapper{width:100%!important;height:100%!important;overflow:auto;} .bg{display:none;}	#divpop{width:100%!important;height:auto!important;position:static!important;border-radius:0!important;}}\">";
			insDiv += "<div class=\"bg\" style=\"position:absolute; top:0; left:0; width:100%; height:100%; background:#000; opacity:0.3;filter:alpha(opacity=50);opacity:0.3;filter:alpha(opacity=60);\"></div>";
			insDiv += "<div id=\"divpop\" style=\"width:calc(100% - 16px);height:calc(100% - 16px);background:#fff;border-radius:8px;overflow:hidden;position:absolute;top:8px;left:8px;z-index:100000000000000;\">";
			insDiv += "<iframe id='InnoFrame' name='InnoFrame' width='100%' height='100%' frameborder='0'></iframe>";
			insDiv += "</div></div></div>";		
		}else{
			insDiv += "<div class=\"popWrapper\" style=\"position:fixed;top:0;left:0;width:100%;height:100%; z-index:1000000000000000;@media screen and (max-width:690px){.popWrapper{width:100%!important;height:100%!important;overflow:auto;} .bg{display:none;}	#divpop{width:100%!important;height:auto!important;position:static!important;border-radius:0!important;}}\">";
			insDiv += "<div class=\"bg\" style=\"position:absolute; top:0; left:0; width:100%; height:100%; background:#000; opacity:0.3;filter:alpha(opacity=50);opacity:0.3;filter:alpha(opacity=60);\"></div>";
			insDiv += "<div id=\"divpop\" style=\"width:"+iw+"px;height:"+ih+"px;background:#fff;border-radius:5px;position:absolute;top:"+tPos+"px;left:"+lPos+"px;z-index:100000000000000;\">";
			insDiv += "<iframe id='InnoFrame' name='InnoFrame' width='100%' height='100%' frameborder='0'></iframe>";
			insDiv += "</div></div></div>";	
		}
		var attachElement = document.body;
		var innoDiv = document.createElement('div');
		innoDiv.setAttribute('id', 'innoDiv');
		innoDiv.innerHTML = insDiv;
		scroll_disable();
		attachElement.appendChild(innoDiv);	  
		f.target = "InnoFrame";
	 
		LoadEvent();
	}else if('Y'==fwd){
		var left=(window.innerWidth-iw)/2;
		var top=(window.innerHeight-ih)/2;
		var winopts= "left="+left+",top="+top+",toolbar=no,location=no,directories=no, status=no,menubar=no,scrollbars=no, resizable=no,width="+iw+"px,height="+ih+"px";			
		var InnopayWin =  window.open("about:blank", "payWindow", winopts);
		if(InnopayWin==null||InnopayWin==undefined){
			alert("팝업차단 해제 후 다시 시도해 주시기 바랍니다");
			return false;
		}
		jQuery(".popup_notice").css('display','block');
		jQuery(".popup_notice .text").center();
		f.target = "payWindow";
	}else{ // 페이지 전환
	}
	return true;
};
function checkDevice(frm){
	if(navigator.appName.indexOf("Microsoft")>-1){
		if(navigator.appVersion.indexOf("MSIE 7")>-1){addHidden(frm,'BrowserType','MSIE 7');}
		else if(navigator.appVersion.indexOf(navigator.appVersion.indexOf("MSIE 6")>-1)){addHidden(frm,'BrowserType','MSIE 6');}
	}
	var UserAgent = navigator.userAgent;
	if(UserAgent.match(/iPad|Tablet|SM-T595|SM-T583/i)){ // 태블릿인 경우 PC프로세스로 2019.10.17
	    addHidden(frm, 'device', 'pc');
        return 'pc';
	}
	else if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
		|| UserAgent.match(/LG|SAMSUNG|Samsung/)!=null){
		addHidden(frm, 'device', 'mobile');
		return 'mobile';
	}else{
		addHidden(frm, 'device', 'pc');
		return 'pc';
	}
};
function addData(frm, method){	// optional data add
	if(!checkFormField(frm,'Currency')||!checkFormValue(frm,'Currency')){
		addHidden(frm, 'Currency', 'KRW');
	}
	if(!checkFormField(frm,'MallResultFWD')||!checkFormValue(frm,'MallResultFWD')){
		addHidden(frm, 'MallResultFWD', 'N');
	}
	if(!checkFormField(frm,'DutyFreeAmt')||!checkFormValue(frm,'DutyFreeAmt')){
		addHidden(frm, 'DutyFreeAmt', '0');
	}
	if(!checkFormField(frm,'BuyerEmail')||!checkFormValue(frm,'BuyerEmail')){
		addHidden(frm, 'BuyerEmail', 'nomail@noemail.com');
	}
	if(!checkFormField(frm,'OfferingPeriod')||!checkFormValue(frm,'OfferingPeriod')){
		addHidden(frm, 'OfferingPeriod', '');
	}
	if(!checkFormField(frm,'EncodingType')||!checkFormValue(frm,'EncodingType')){
		addHidden(frm, 'EncodingType', 'utf-8');
	}
};
function checkData(frm, data){
	if('CARD'!=data.PayMethod&&'BANK'!=data.PayMethod&&'VBANK'!=data.PayMethod&&'CARS'!=data.PayMethod&&'OUTCALL'!=data.PayMethod&&'CSMS'!=data.PayMethod&&'DSMS'!=data.PayMethod&&'CKEYIN'!=data.PayMethod&&'EPAY'!=data.PayMethod&&'EBANK'!=data.PayMethod){
		alert('Invalid parameter [PayMethod]');return false;
	}else{
		addHidden(frm,'PayMethod',data.PayMethod);
	}
	if('CARD'==data.PayMethod){
		addHidden(frm,'svcPrdtCd','08');
		ih=680;
	}else if('EPAY'==data.PayMethod){
		addHidden(frm,'svcPrdtCd','08');
		ih=680;
	}else if('BANK'==data.PayMethod){
		addHidden(frm,'svcPrdtCd','01');
		ih=680;
	}else if('VBANK'==data.PayMethod){
		addHidden(frm, 'svcPrdtCd', '01');
		ih=680;
	}else if('CARS'==data.PayMethod){ //ARS WebLink
		iw=680;
		ih=775;
		addHidden(frm, 'svcPrdtCd', '06');
		if(isEmpty(data.ArsConnType)){
			addHidden(frm, 'ArsConnType', '02'); // 01:호전환, 02(가상번호), 03:대표
		}else{
			addHidden(frm, 'ArsConnType', data.ArsConnType); // 01:호전환, 02(가상번호), 03:대표
		}
		if(!checkFormField(frm,'RequestType')||!checkFormValue(frm,'RequestType')){
			addHidden(frm, 'RequestType', 'Web');
		}
	}else if ('OUTCALL'== data.PayMethod){ // ARS(아웃콜)
		iw=680;
		ih=775;
		addHidden(frm, 'svcPrdtCd', '12');
		if(!checkFormField(frm,'RequestType')||!checkFormValue(frm,'RequestType')){
			addHidden(frm, 'RequestType', 'Web');
		}
	}else if('CSMS'==data.PayMethod){
		iw=680;
		ih=740;
		addHidden(frm, 'svcPrdtCd', '04');
		if(!checkFormField(frm,'RequestType')||!checkFormValue(frm,'RequestType')){
			addHidden(frm, 'RequestType', 'Web');
		}
	}else if('DSMS'==data.PayMethod){
		iw=680;
		ih=740;
		addHidden(frm, 'svcPrdtCd', '03');
		if(!checkFormField(frm,'RequestType')||!checkFormValue(frm,'RequestType')){
			addHidden(frm, 'RequestType', 'Web');
		}
	}else if('CKEYIN'==data.PayMethod){
	    ih=680;
		addHidden(frm, 'svcPrdtCd', '01');
	}else if('EBANK'==data.PayMethod){
	    ih=680;
        addHidden(frm, 'svcPrdtCd', '01');
    }
	if(isEmpty(data.MID)){
		alert('Invalid parameter [MID]');return false;
	}else{
		addHidden(frm, 'MID',data.MID);
	}
	if(isEmpty(data.MerchantKey)){
		alert('Invalid parameter [MerchantKey]');return false;
	}else{
		addHidden(frm, 'MerchantKey',data.MerchantKey);
	}
	if(isEmpty(data.Moid)){
		setMoid(frm);
	}else{
		if(isSpecial(data.Moid)){alert("Not allowed special character on Moid");return false;
		}else{ addHidden(frm, 'Moid',data.Moid); }
	}
	if(isEmpty(data.GoodsName)){
		alert('Invalid parameter [GoodsName]');return false;
	}else{
		addHidden(frm, 'GoodsName',data.GoodsName);
	}
	if(isEmpty(data.GoodsCnt)){
		addHidden(frm, 'GoodsCnt','1');
	}else{
		if(!isNumber(data.GoodsCnt)){
			alert('Invalid parameter [GoodsCnt]');return false;
		}else{ addHidden(frm, 'GoodsCnt',data.GoodsCnt);}
	}
	if(isEmpty(data.Amt)||!isNumber(data.Amt)){
		alert('Invalid parameter [Amt]');return false;
	}else{
		addHidden(frm, 'Amt',data.Amt);
	}
	if(isEmpty(data.BuyerName)){
		alert('Invalid parameter [BuyerName]');return false;
	}else{
		addHidden(frm, 'BuyerName',data.BuyerName);
	}
	if(isEmpty(data.BuyerTel)||data.BuyerTel.length>20){
		alert('Invalid parameter [BuyerTel]');return false;
	}else{
		addHidden(frm, 'BuyerTel',data.BuyerTel);
		addHidden(frm, 'BuyerHp',data.BuyerHp);
	}
	if(!isEmpty(data.BuyerEmail)&&!EmailCheck(data.BuyerEmail)){
		alert('Invalid parameter [BuyerEmail]');return false;
	}else{
		addHidden(frm, 'BuyerEmail',data.BuyerEmail);
	}
	if(isEmpty(data.Currency)){
		addHidden(frm, 'Currency','KRW');
	}else{
		if('KRW'!=data.Currency&&'USD'!=data.Currency){
			alert('Invalid parameter [Currency]');return false;
		}else{
			addHidden(frm, 'Currency',data.Currency);
		}
	}
	if(isEmpty(data.FORWARD)||('N'!=data.FORWARD&&'X'!=data.FORWARD)){
		addHidden(frm, 'FORWARD','X');
	}else{
		addHidden(frm, 'FORWARD',data.FORWARD);
	}
	if(isEmpty(data.ResultYN)||('Y'!=data.ResultYN&&'N'!=data.ResultYN)){
		addHidden(frm, 'ResultYN','N'); //기본값:PG 결과창 미출력
	}else{
		addHidden(frm, 'ResultYN',data.ResultYN);
	}
	if(data.GoodsName.length>20){
		alert("Invalid parameter [GoodsName] max length 20.");return false;
	}
	if(!isEmpty(data.ReturnURL)){
		addHidden(frm, 'ReturnURL',data.ReturnURL);
	}
	if(!isEmpty(data.MallReserved)){
		addHidden(frm, 'MallReserved',data.MallReserved);
	}
	if(isEmpty(data.EncodingType)){
		addHidden(frm, 'EncodingType','utf-8');
	}else{
		addHidden(frm, 'EncodingType',data.EncodingType);
	}
	if(!isEmpty(data.MallIP)){
		addHidden(frm, 'MallIP',data.MallIP);
	}
	if(!isEmpty(data.UserIP)){
		addHidden(frm, 'UserIP',data.UserIP);
	}
	if(!isEmpty(data.mallUserID)){
		addHidden(frm, 'mallUserID',data.mallUserID);
	}
	if(!isEmpty(data.OfferingPeriod)){
		addHidden(frm, 'OfferingPeriod',data.OfferingPeriod);
	}
	if(!isEmpty(data.DutyFreeAmt)){
		if(isNumber(data.DutyFreeAmt)){
			addHidden(frm, 'DutyFreeAmt',data.DutyFreeAmt);	
		}else{
			addHidden(frm, 'DutyFreeAmt','0');
		}
	}
	if(!isEmpty(data.User_ID)){
		addHidden(frm, 'User_ID',data.User_ID);
	}
	if(!isEmpty(data.VbankExpDate)){
		addHidden(frm, 'VbankExpDate',data.VbankExpDate);
	}
	if(!isEmpty(data.OrderCode)){
        addHidden(frm, 'OrderCode',data.OrderCode);
    }
	if(!isEmpty(data.AppScheme)){
        addHidden(frm, 'AppScheme',data.AppScheme);
    }
	//해외 추가배송지 파라메터
	if(isEmpty(data.STCity)){
	}else{
		addHidden(frm, 'STCity' ,data.STCity);
	}
	if(isEmpty(data.STCountry)){
	}else{
		addHidden(frm, 'STCountry' ,data.STCountry);
	}
	if(isEmpty(data.STFirstName)){
	}else{
		addHidden(frm, 'STFirstName' ,data.STFirstName);
	}
	if(isEmpty(data.STLastName)){
	}else{
		addHidden(frm, 'STLastName' ,data.STLastName);
	}
	if(isEmpty(data.STPhoneNum)){
	}else{
		addHidden(frm, 'STPhoneNum' ,data.STPhoneNum);
	}
	if(isEmpty(data.STPostCode)){
	}else{
		addHidden(frm, 'STPostCode' ,data.STPostCode);
	}
	if(isEmpty(data.STState)){
	}else{
		addHidden(frm, 'STState' ,data.STState);
	}
	if(isEmpty(data.STStreet)){
	}else{
		addHidden(frm, 'STStreet' ,data.STStreet);
	}
	
	// 특정 가맹점 달러 표시   pgebs0002m, pgebs0001m  
	if("pgebs0001m" == data.MID ||"pgebs0002m" == data.MID ){
		var param = {
				"payMethod":data.PayMethod , 
				"Amt":data.Amt , 
				"MerchantKey":data.MerchantKey ,
				"GoodsName":data.GoodsName ,
				"MID":data.MID ,
				"BuyerName":data.BuyerName ,
				"BuyerTel":data.BuyerTel ,
				"Moid":data.Moid,
				"Currency":"KRW",
				"ExcCurrency":"USD" }
	 $.ajax({ 
         type : "POST",           
         url : payActionUrl+"/ipay/api/exchangeAmt.ipay",   
         contentType : 'application/json',
         dataType: 'json',
         data :JSON.stringify(param),
         async: false,
         success : function(res){ 
        	 if(res.result){
        		addHidden(frm, 'ExcCurrency', "USD" );
         		addHidden(frm, 'ExcAmt'	, res.ExcAmt );
         		addHidden(frm, 'ExcRate', res.ExcRate);
         		addHidden(frm, 'ExcTime', res.ExcTime);
        	 }else{
        		 alert(res.msg);
        		 return false;
        	 }
         },
         error : function(XMLHttpRequest, textStatus, errorThrown){ 
             alert("Error, please contact the administrator.");
             return false;
         }
     });	
	}
	
	if(isEmpty(data.PayConfirm)){
	}else{
		addHidden(frm, 'PayConfirm' ,data.PayConfirm);
	}
	
	return true;
};
/*
 *  거래 검증용 데이터 생성 function 
 */
function makeEncKey(frm){
	var strKey = '';
	var MID=jQuery('input[name=MID]', jQuery(frm)).val();
	var Amt=jQuery('input[name=Amt]', jQuery(frm)).val();
	var mKey=jQuery('input[name=MerchantKey]', jQuery(frm)).val();
	var DutyFreeAmt = 0;
	try{
		if(checkFormValue(frm, "DutyFreeAmt")){
			DutyFreeAmt = parseInt(jQuery('input[name=DutyFreeAmt]', jQuery(frm)).val());
			if(!isNaN(DutyFreeAmt))	Amt = parseInt(Amt) + DutyFreeAmt;
		}
	}catch(e){}
	strKey=ediDate+MID+Amt+mKey;
	var enc_val = encode64(MD5(strKey));
	addHidden(frm,'EncryptData',enc_val);
}
/*
 *  특수 문자 체크
 */
function isSpecial(checkStr) {
	var checkOK="~`':;{}[]<>,.!@#$%^&*()_+|\\/?";
	for(var i=0;i<checkStr.length;i++){
		ch=checkStr.charAt(i);
		for(var j=0;j<checkOK.length;j++){
			if(ch==checkOK.charAt(j)){return true;break;}
		}
	}
	return false;
};
function isEmpty(str){
	try{
		if(str==undefined||str==null||str.trim()=='')return true;
		else return false;	
	}catch(e){
		return true;
	}
};
/*
 *  E-Mail 형식 확인
 */
function EmailCheck(arg_v) {
	var	vValue="";
	arg_v = arg_v.trim();
	if(arg_v.indexOf("@")<0) return false;
	for(var i=0;i<arg_v.length;i++){
		vValue=arg_v.charAt(i);
		if(AlphaCheck(vValue)==false&&NumberCheck(vValue)==false&&EmailSpecialCheck(vValue)==false) return false;
	}
	return true;
}
/*
 *  영문 판별
 */
function AlphaCheck(arg_v) {
	var alphaStr="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if(alphaStr.indexOf(arg_v)<0) return false;
	else return true;
};
/*
 *  숫자 판별
 */
function NumberCheck(arg_v) {
	var numStr="0123456789";
	if(numStr.indexOf(arg_v)<0) return false;
	else return true;
};
function isNumber(s) {
	  s += '';
	  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
	  if (s==''||isNaN(parseInt(s))) return false;
	  return true;
};
/*
 *  Email 특수 문자 체크
 */
function EmailSpecialCheck(arg_v) {
	var SpecialStr="_-@.";
	if(SpecialStr.indexOf(arg_v)<0) return false;
	else return true;
}
/*
 * Base64 Encode / Decode 함수
 */
function encode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i=0;
   do{
     chr1=input.charCodeAt(i++);
     chr2=input.charCodeAt(i++);
     chr3=input.charCodeAt(i++);
     enc1=chr1>>2;
     enc2=((chr1&3)<<4)|(chr2>>4);
     enc3=((chr2&15)<<2)|(chr3>>6);
     enc4=chr3&63;
     if(isNaN(chr2)){
       enc3=enc4=64;
     }else if(isNaN(chr3)){
       enc4=64;
     }
     output=output+keyStr.charAt(enc1)+keyStr.charAt(enc2)+keyStr.charAt(enc3)+keyStr.charAt(enc4);
   }while(i<input.length);
   return output;
};
function createForm(name, method, action, target){
	var tmpForm = jQuery('form[name='+name+']');
	var formObj;
	if(tmpForm.length>0) formObj = tmpForm;
	else formObj = document.createElement('form');
	formObj.name = name;
	formObj.method = method;
	formObj.target = target;
	if(tmpForm.length<1)document.body.appendChild(formObj);
	return formObj;
};
function checkFormField(CheckForm, CheckFormFieldName){
    try{
	  var a=jQuery('input[name='+CheckFormFieldName+']', jQuery(CheckForm)).val();
	  write_log('checkFormField['+CheckForm.name+']['+CheckFormFieldName+']', a);
	  if(a==undefined){return false;}else{return true;}	
    }catch(e){return false;}
};
function checkFormValue(CheckForm, CheckFormFieldName){
	try{
		var a=jQuery('input[name='+CheckFormFieldName+']', jQuery(CheckForm)).val();
		write_log('checkFormValue['+CheckForm.name+']['+CheckFormFieldName+']', a);
		if(a==undefined||a.trim()==''||a==null||a=='null'){return false;}else{return true;}	
	}catch(e){return false;}
};
function addHidden(formObj, name, value){
	if(checkFormField(formObj,name)){
		jQuery('input[name='+name+']', jQuery(formObj)).val(value);
	}else{
		var m_input = getInputTag('hidden', name, value);
		try{
			formObj.appendChild(m_input);	
		}catch(e){
			var fm = jQuery('form[name='+formName+']')[0];
			fm.appendChild(m_input);
		}
		
	}
	return formObj;
};
function getInputTag(type,name,value){
	var obj = document.createElement('input');
	obj.setAttribute("type",type);
	obj.setAttribute("name",name);
	obj.setAttribute("value",value);
	return obj;
};
function write_log(target,msg){if(m_debug){if(window.console)console.log(target+' ['+msg+']');}};
function loadAcctForm(){
    LoadEvent();
    var acctFormName = 'InnoAcct';
    var f = createForm(acctFormName,'POST','','');
    setPayActionUrl();
    device=checkDevice(f);
    var lPos=(window.innerWidth-iw)/2;
    var tPos=(window.innerHeight-ih)/2;
    if((window.innerWidth-iw)<0){iw=422;lPos=0;}
    if((window.innerHeight-ih)<0){ih=600;tPos=0;}
    var insDiv = '';
    if('mobile'==device){
        insDiv += "<div class=\"popWrapper iPhone_scroll\" style=\"position:fixed;top:0;left:0;width:100%;height:100%; z-index:1000000000000000;@media screen and (max-width:690px){.popWrapper{width:100%!important;height:100%!important;overflow:auto;} .bg{display:none;}   #divpop{width:100%!important;height:auto!important;position:static!important;border-radius:0!important;}}\">";
        insDiv += "<div class=\"bg\" style=\"position:absolute; top:0; left:0; width:100%; height:100%; background:#000; opacity:0.3;filter:alpha(opacity=50);opacity:0.3;filter:alpha(opacity=60);\"></div>";
        insDiv += "<div id=\"divpop\" style=\"width:calc(100% - 16px);height:calc(100% - 16px);background:#fff;border-radius:8px;overflow:hidden;position:absolute;top:8px;left:8px;z-index:100000000000000;\">";
        insDiv += "<iframe id='InnoFrame' name='InnoFrame' width='100%' height='100%' frameborder='0' style='overflow:hidden !important;'></iframe>";
        insDiv += "</div></div></div>";     
    }else{
        insDiv += "<div class=\"popWrapper\" style=\"position:fixed;top:0;left:0;width:100%;height:100%; z-index:1000000000000000;@media screen and (max-width:690px){.popWrapper{width:100%!important;height:100%!important;overflow:auto;} .bg{display:none;} #divpop{width:100%!important;height:auto!important;position:static!important;border-radius:0!important;}}\">";
        insDiv += "<div class=\"bg\" style=\"position:absolute; top:0; left:0; width:100%; height:100%; background:#000; opacity:0.3;filter:alpha(opacity=50);opacity:0.3;filter:alpha(opacity=60);\"></div>";
        insDiv += "<div id=\"divpop\" style=\"width:"+iw+"px;height:"+ih+"px;background:#fff;border-radius:5px;position:absolute;top:"+tPos+"px;left:"+lPos+"px;z-index:100000000000000;\">";
        insDiv += "<iframe id='InnoFrame' name='InnoFrame' width='100%' height='100%' frameborder='0'></iframe>";
        insDiv += "</div></div></div>"; 
    }
    var attachElement = document.body;
    var innoDiv = document.createElement('div');
    innoDiv.setAttribute('id', 'innoDiv');
    innoDiv.innerHTML = insDiv;
    scroll_disable();
    attachElement.appendChild(innoDiv);
    f.action='https://openapi.innopay.co.kr:4443/api/easyBankAcctLogin';
    //f.action='http://172.16.10.10:8080/api/easyBankAcctLogin';
    f.target = "InnoFrame";
};
function LoadEvent(){
	flag = true;
    if(window.addEventListener){
        window.addEventListener('message',function evt(e){
    		if(flag == true && (e.origin == "https://pg.innopay.co.kr"||e.origin == "https://openapi.innopay.co.kr:4443"
    		                   ||e.origin == "https://api.innopay.co.kr"||e.origin == "https://ap.innopay.co.kr" 
    		                   ||e.origin ==  payActionUrl )){
    			flag = false;
                write_log('message data',e.data);
                write_log('message origin',e.origin);
                try{
                    var str = decodeURIComponent(e.data);
                    rtn = jQuery.parseJSON(str);    
                }catch(e1){}
                if('close'==e.data){
                    innopay.closeDiv();
                    window.removeEventListener("message", evt);
                }else if(rtn!=undefined && 'close'==rtn.action){
                    innopay.closeDiv();  
                    window.removeEventListener("message", evt);
                }else if(rtn!=undefined && 'pay'==rtn.action){
                    try{
                        innopay_result(rtn);    
                        rtn = null;
                        window.removeEventListener("message", evt);
                    }catch(e2){}
                    innopay.closeDiv();
                }else if(e.data.kind == "alert" || e.data.kind == "confirm"){ //구글 정책변경으로인한 alert, confirm 미작동 오류로 포스트메시지로 구현
                	if(e.data.kind == "alert"){
                    	alert(e.data.contents);
                    	flag = true;
                    	return;
                	}else if(e.data.kind == "confirm"){
                		var conf = confirm(e.data.contents);

                		if(conf){ //확인 누를 시 호출된곳으로 포스트메시지 보냄.
                			e.source.postMessage(true,"*");        
                		}else{//취소 클릭 시 아무일도 안일어남.
                			
                		}
                		flag = true;                		
                	}            	
                }else if(e.data.kind == "close"){ //가맹점 요청으로 인한 ReturnURL 없이 닫기버튼 클릭 시 결제 및 발급 완료 구분값 들어가게 수정.              	
                    try{            
                        innopay_ars_result(e.data.rtn);
                    }catch(e2){}
                    innopay.closeDiv();
                }else{
                	if(e.origin == "https://pg.innopay.co.kr"  ||e.origin ==  payActionUrl || e.origin == "https://api.innopay.co.kr"){
                		innopay.closeDiv();
                	}
                }
    		}
    	},false);
    }else{
        window.attachEvent('onmessage',function(e){
            write_log('message data',e.data);
            write_log('message origin',e.origin);
            try{
                var str = decodeURIComponent(e.data);
                rtn = jQuery.parseJSON(str);    
            }catch(e){}
            if('close'==e.data){
                innopay.closeDiv();
            }else if(rtn!=undefined && 'close'==rtn.action){
                innopay.closeDiv();
            }else if(rtn!=undefined && 'pay'==rtn.action){
                try{
                    innopay_result(rtn);    
                    rtn = null;
                }catch(e2){}
                innopay.closeDiv();
            }else if(e.data.kind == "alert" || e.data.kind == "confirm"){
            	if(e.data.kind == "alert"){
                	alert(e.data.contents);
                	flag = true;
                	return;
            	}else if(e.data.kind == "confirm"){
            		var conf= confirm(e.data.contents);

            		if(conf){ //확인 누를 시 호출된곳으로 포스트메시지 보냄.
            			e.source.postMessage(true,"*");        
            		}else{//취소 클릭 시 아무일도 안일어남.
            			
            		}
            		flag = true;            		
            	}           	
            }else{
                innopay.closeDiv();
            }
        });
	} 
};
var MD5=function(string){
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	};
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
	string = Utf8Encode(string);
	x = ConvertToWordArray(string);
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
	return temp.toLowerCase();
};