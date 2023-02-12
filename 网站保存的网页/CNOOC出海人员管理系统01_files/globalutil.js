/* 全局使用的javascript */
var queryString ;
var strRows_Current;
//document.onreadystatechange = initMessage();
//alert(window.name);

//在mteaf中自动实现非空项的判断
function beforeFormSubmit(formObj){
  formObj.stritem.value="";
  for(i=0;i<formObj.elements.length;i++){
    //处理非空项、数字项、日期项
    if(formObj.elements[i].notnull){
      if(document.all(formObj.elements[i].name+"Error")){
        document.all(formObj.elements[i].name+"Error").innerHTML = "";
      }
      formObj.stritem.value=formObj.stritem.value+"$"+formObj.elements[i].name+"/notnull";
    }
    //处理数字项
    if(formObj.elements[i].isnumber){
      if(document.all(formObj.elements[i].name+"Error")){
        document.all(formObj.elements[i].name+"Error").innerHTML = "";
      }
      formObj.stritem.value=formObj.stritem.value+"$"+formObj.elements[i].name+"/isnumber";
    }
    //处理日期项
    if(formObj.elements[i].isdate){
      if(document.all(formObj.elements[i].name+"Error")){
        document.all(formObj.elements[i].name+"Error").innerHTML = "";
      }
      formObj.stritem.value=formObj.stritem.value+"$"+formObj.elements[i].name+"/isdate";
    }
    
    var itemtype = formObj.elements[i].type;
    //禁用按钮
    if(itemtype=="button"||itemtype=="submit"||itemtype=="reset"){
      formObj.elements[i].disabled = "true";
    }
  }
  //正在传输数据
  startTransferMessage();
}

//正在传输数据
function startTransferMessage(){
  if(top.leftFrame){
    if(top.leftFrame.leftBottomFrame.document.all("transNote")){
      top.leftFrame.leftBottomFrame.document.all("transNote").innerHTML="正在传输数据......";
    }
  }
}

function endTransferMessage(){
  if(top.leftFrame){
    if(top.leftFrame.leftBottomFrame.document.all("transNote")){
      top.leftFrame.leftBottomFrame.document.all("transNote").innerHTML="";
    }
  }
}

//在transaction执行完毕后将所有item变为enable
function afterFormSubmit(isSuccess){
  if(top.workareaFrame.mainFrame.document.forms.length!=0){
    top.workareaFrame.mainFrame.document.body.disabled = false;
    for(i=0;i<top.workareaFrame.mainFrame.document.forms.length;i++){
      if(isSuccess=="true"){
        top.workareaFrame.mainFrame.document.forms[i].reset();
      }
      for(j=0;j<top.workareaFrame.mainFrame.document.forms[i].elements.length;j++){
        top.workareaFrame.mainFrame.document.forms[i].elements[j].disabled = false;
      }
    }
  }
  endTransferMessage();
}

//在录入页面显示提示信息
function displayErrMsg(itemname,warning){
  var obj = top.workareaFrame.mainFrame.document.all(itemname);
  if(obj.altnote){
    if(top.workareaFrame.mainFrame.document.all(itemname+"Error")){
      top.workareaFrame.mainFrame.document.all(itemname+"Error").innerHTML = obj.altnote+warning;
    }
  }
  else{
    if(top.workareaFrame.mainFrame.document.all(itemname+"Error")){
      top.workareaFrame.mainFrame.document.all(itemname+"Error").innerHTML = warning;
    }
  }
}

//显示提示窗口
function showMessageBox(warning){
  if(top.workareaFrame.mainFrame.document.messageboxLayer){
    top.workareaFrame.mainFrame.showMessagebox(warning);
  }
  else{
    alert(warning);
  }
}

//初始化排序窗口
function initOrderPage(qString,orderColumn,orderType){
  queryString=qString;
  for(i=0;i<mainOrderTable.tHead.all("orderHead").cells.length;i++){
    if(mainOrderTable.tHead.all("orderHead").cells[i].id==orderColumn){
      var theCell = mainOrderTable.tHead.all("orderHead").cells[i];
      theCell.orderColumn=orderColumn;
      theCell.orderType=orderType;
      if(orderType=="asc"){
        theCell.innerHTML = theCell.title+"↓";
      }
      else if(orderType=="desc"){
        theCell.innerHTML = theCell.title+"↑";
      }
    }
  }
  endTransferMessage();
}

//实现列表页面的排序
function changeOrder(orderObj){
  //document.write("↑");
  if(!orderObj.orderType){
    orderObj.orderType="asc";
    orderObj.orderColumn = orderObj.id;
    //orderObj.innerHTML = orderObj.name+"↓";
  }
  else if(orderObj.orderType=="asc"){
    orderObj.orderType="desc";
    orderObj.orderColumn = orderObj.id;
  }
  else if(orderObj.orderType=="desc"){
    orderObj.orderType="asc";
    orderObj.orderColumn = orderObj.id;
  }
  location = "MainServlet.action?"+queryString+"&orderColumn="+orderObj.orderColumn+"&orderType="+orderObj.orderType;
}

function doJump(theSelect){
  var toPage = theSelect.options[theSelect.selectedIndex].value;
  var toUrl = "MainServlet.action?"+toPage;
  location = toUrl;
}

function SetCwinHeight(obj)
{
  var cwin=obj;
  if (document.getElementById)
  {
    if (cwin && !window.opera)
    {
      if (cwin.contentDocument && cwin.contentDocument.body.offsetHeight)
        cwin.height = cwin.contentDocument.body.offsetHeight; 
      else if(cwin.Document && cwin.Document.body.scrollHeight)
        cwin.height = cwin.Document.body.scrollHeight;
    }
  }
}
function AddItem(f,t){
  for (var i=0;i<f.length;i++){
    if (f.options[i].selected){
      t.options[t.length]=new Option(f.options[i].text,f.options[i].value);
    }
  }
  for (var i=f.length-1;i>-1;i--){
    if (f.options[i].selected){
      f.options[i]=null;
    }
  }
}

function AItem(f,t){
  for(i=0;i<f.options.length;i++)
    f.options(i).selected=true;
  for(i=0;i<f.options.length;i++){
    var oOption = document.createElement("OPTION");
    oOption.text=f.options(i).text;
    oOption.value=f.options(i).value;
    t.add(oOption);
  }
  for (var i=f.length-1;i>-1;i--){
    if (f.options[i].selected){
      f.options[i]=null;
    }
  }
}  

function selectParent(f,t){
  var val = f.options[f.selectedIndex].value;
  if(val){
    if(val.substring(5,7)=='00'){  //是父菜单
      for(i=0;i<f.options.length;i++){
        if(f.options[i].value.substring(0,5)+'00'==val){ //是子菜单
          f.options[i].selected = true;
        }
      }
    }
    else{  //子菜单
      for(i=0;i<f.options.length;i++){
        if(val.substring(0,5)+'00'==f.options[i].value){ //是子菜单
          f.options[i].selected = true;
        }
      }
    }
  }
}

function selectNoParent(f,t){
  var val = f.options[f.selectedIndex].value;
  var m = 0;
  if(val){
    if(val.substring(5,7)=='00'){  //是父菜单
      for(i=0;i<f.options.length;i++){
        if(f.options[i].value.substring(0,5)+'00'==val){ //是子菜单
          f.options[i].selected = true;
        }
      }
    }
    else{  //子菜单
      for(i=0;i<f.options.length;i++){
        if(val.substring(0,5)==f.options[i].value.substring(0,5)){
          if(i!=f.selectedIndex){
            if(f.options[i].value.substring(5,7)!='00'){ //判断是否剩下一个子菜单
              m = 1;
            }
          }
        }
      }
      for(i=0;i<f.options.length;i++){
        if(val.substring(0,5)+'00'==f.options[i].value&&m!='1'){ //是父菜单
          f.options[i].selected = true;
        }
      }
    }
  }
}

function showmenu(id){
  if (document.all("menu_"+id).style.display=="block"){
    document.all("menu_"+id).style.display="none";
  }
  else{
    document.all("menu_"+id).style.display="block";
  }
}

function blockall(v_num){
  for(i = 0;i<v_num;i++){
    document.all("menu_"+i).style.display = "block";
  }
}

function noneall(v_num){
  for(i = 0;i<v_num;i++){
    document.all("menu_"+i).style.display = "none";
  }
}

//设定select项的默认值
function selectOption(sname, ovalue){
  var obj = document.getElementById(sname);
  for(i=0; i<obj.options.length;i++){
    if(obj.options[i].value==ovalue){
      obj.options[i].selected = true;
    }
  }
}

function confirmDel(){
  return confirm("是否确认操作");
}

//多级菜单联动控制
function changeMultiSelect(firstObj,secondid){
  var recnumber = 1;
  if(firstObj.recordNumber){
    recnumber = firstObj.recordNumber;
  }
  top.submitframe.location = '/multi_select_ctl.jsp?firstval='+firstObj.value+'&ctlsql='+firstObj.ctlsql+'&recordnumber='+recnumber+'&secondid='+secondid;
}

//通过ID取得多项值得信息，例如通过IMEI得到手机的其他信息显示到当前页面上
function getMultiInfo(ctlObj){
  var recnumber = 0;
  if(ctlObj.recordNumber){
    recnumber = ctlObj.recordNumber;
  }
  top.submitframe.location = '/multi_info_ctl.jsp?ctlval='+ctlObj.value+'&ctlsql='+ctlObj.ctlsql+'&recordnumber='+recnumber+'&idset='+ctlObj.idset+'&ctlname='+ctlObj.name;
}

//空值转化为0
function nvl(instr){
  if(!instr){
    return 0;
  }
  else if(instr==null||isNaN(instr)){
    return 0;
  }
  else{
    return Math.round(parseFloat(instr)*10)/10;
  }
}

//打开一个url在主界面中
function openUrl(v_url,v_target){
  if(v_target==null||v_target=='mainFrame'){
    top.workareaFrame.mainFrame.location = v_url;
  }
  if(v_target=='submitframe'){
    top.submitframe.location = v_url;
  }
}

//调整工作区的大小 add by offsider 06.10.19
function resizeTop(){ 
  //strRows_Current = top.topframeset.rows;
  if(top.topframeset.rows=="0,86,*"){
    top.topframeset.rows="0,26,*"
    top.topFrame.scrollBy(0,1000);
    top.topFrame.topctlimg.src="images/vndown.gif";
  }
  else{
    top.topframeset.rows="0,86,*"
    top.topFrame.topctlimg.src="images/vnup.gif";
  }
}

function resizeWorkArea(){
  if(top.mainFrameset.cols == "1,*"){
    top.leftFrame.leftTopFrame.showtoc("158,*");
  }
  else{
    top.leftFrame.leftTopFrame.hidetoc();
  }
}

var strColumns ;

function resizeNoteArea(){
  //strColumns = top.nFrameset.rows;
  if(top.nFrameset.rows == "*,23"){
    top.nFrameset.rows="*,100"
  }
  else{
    top.nFrameset.rows="*,23";
  }
}
//end

//打印
function doPrint(v_rptname,v_param){
  var theurl = '/viewreport.jsp?report='+v_rptname+v_param;
  window.open(theurl,'printwindow',"height=400,width=800,status=yes,toolbar=no,menubar=no,location=no,resizeable=yes");
}
//判断输入日期有效性
function validate(str){  
  if(!/^19\d\d-[0-1]\d-[0-3]\d+$/.test(str)&&!/^20\d\d-[0-1]\d-[0-3]\d+$/.test(str)){
    return false ;
  }else{
    return true;
  }
}
//判断数字
function   IsNum(theField)
 {
  if   (!IsNum2(theField.value))
  {alert("该区域只能输入数字！");
  theField.focus();
  theField.value   =   '';}
  }
function   IsNum2(s)
 { 
  var Number   =   "0123456789.";
  for (i = 0; i< s.length;i++)
   { //   Check   that   current   character   isn't   whitespace.
    var   c   =   s.charAt(i);
    if   (Number.indexOf(c)   ==   -1)   return   false;
   }
   return   true
}
function setCookie(name,value){
	var Days = 30; //此 cookie 将被保存 30 天
	var exp = new Date(); //new Date("December 31, 9998");
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	var str = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	document.cookie = str;
}
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(arr != null) 
	return unescape(arr[2]);
}
