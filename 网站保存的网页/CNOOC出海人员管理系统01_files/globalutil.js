/* ȫ��ʹ�õ�javascript */
var queryString ;
var strRows_Current;
//document.onreadystatechange = initMessage();
//alert(window.name);

//��mteaf���Զ�ʵ�ַǿ�����ж�
function beforeFormSubmit(formObj){
  formObj.stritem.value="";
  for(i=0;i<formObj.elements.length;i++){
    //����ǿ�������������
    if(formObj.elements[i].notnull){
      if(document.all(formObj.elements[i].name+"Error")){
        document.all(formObj.elements[i].name+"Error").innerHTML = "";
      }
      formObj.stritem.value=formObj.stritem.value+"$"+formObj.elements[i].name+"/notnull";
    }
    //����������
    if(formObj.elements[i].isnumber){
      if(document.all(formObj.elements[i].name+"Error")){
        document.all(formObj.elements[i].name+"Error").innerHTML = "";
      }
      formObj.stritem.value=formObj.stritem.value+"$"+formObj.elements[i].name+"/isnumber";
    }
    //����������
    if(formObj.elements[i].isdate){
      if(document.all(formObj.elements[i].name+"Error")){
        document.all(formObj.elements[i].name+"Error").innerHTML = "";
      }
      formObj.stritem.value=formObj.stritem.value+"$"+formObj.elements[i].name+"/isdate";
    }
    
    var itemtype = formObj.elements[i].type;
    //���ð�ť
    if(itemtype=="button"||itemtype=="submit"||itemtype=="reset"){
      formObj.elements[i].disabled = "true";
    }
  }
  //���ڴ�������
  startTransferMessage();
}

//���ڴ�������
function startTransferMessage(){
  if(top.leftFrame){
    if(top.leftFrame.leftBottomFrame.document.all("transNote")){
      top.leftFrame.leftBottomFrame.document.all("transNote").innerHTML="���ڴ�������......";
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

//��transactionִ����Ϻ�����item��Ϊenable
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

//��¼��ҳ����ʾ��ʾ��Ϣ
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

//��ʾ��ʾ����
function showMessageBox(warning){
  if(top.workareaFrame.mainFrame.document.messageboxLayer){
    top.workareaFrame.mainFrame.showMessagebox(warning);
  }
  else{
    alert(warning);
  }
}

//��ʼ�����򴰿�
function initOrderPage(qString,orderColumn,orderType){
  queryString=qString;
  for(i=0;i<mainOrderTable.tHead.all("orderHead").cells.length;i++){
    if(mainOrderTable.tHead.all("orderHead").cells[i].id==orderColumn){
      var theCell = mainOrderTable.tHead.all("orderHead").cells[i];
      theCell.orderColumn=orderColumn;
      theCell.orderType=orderType;
      if(orderType=="asc"){
        theCell.innerHTML = theCell.title+"��";
      }
      else if(orderType=="desc"){
        theCell.innerHTML = theCell.title+"��";
      }
    }
  }
  endTransferMessage();
}

//ʵ���б�ҳ�������
function changeOrder(orderObj){
  //document.write("��");
  if(!orderObj.orderType){
    orderObj.orderType="asc";
    orderObj.orderColumn = orderObj.id;
    //orderObj.innerHTML = orderObj.name+"��";
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
    if(val.substring(5,7)=='00'){  //�Ǹ��˵�
      for(i=0;i<f.options.length;i++){
        if(f.options[i].value.substring(0,5)+'00'==val){ //���Ӳ˵�
          f.options[i].selected = true;
        }
      }
    }
    else{  //�Ӳ˵�
      for(i=0;i<f.options.length;i++){
        if(val.substring(0,5)+'00'==f.options[i].value){ //���Ӳ˵�
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
    if(val.substring(5,7)=='00'){  //�Ǹ��˵�
      for(i=0;i<f.options.length;i++){
        if(f.options[i].value.substring(0,5)+'00'==val){ //���Ӳ˵�
          f.options[i].selected = true;
        }
      }
    }
    else{  //�Ӳ˵�
      for(i=0;i<f.options.length;i++){
        if(val.substring(0,5)==f.options[i].value.substring(0,5)){
          if(i!=f.selectedIndex){
            if(f.options[i].value.substring(5,7)!='00'){ //�ж��Ƿ�ʣ��һ���Ӳ˵�
              m = 1;
            }
          }
        }
      }
      for(i=0;i<f.options.length;i++){
        if(val.substring(0,5)+'00'==f.options[i].value&&m!='1'){ //�Ǹ��˵�
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

//�趨select���Ĭ��ֵ
function selectOption(sname, ovalue){
  var obj = document.getElementById(sname);
  for(i=0; i<obj.options.length;i++){
    if(obj.options[i].value==ovalue){
      obj.options[i].selected = true;
    }
  }
}

function confirmDel(){
  return confirm("�Ƿ�ȷ�ϲ���");
}

//�༶�˵���������
function changeMultiSelect(firstObj,secondid){
  var recnumber = 1;
  if(firstObj.recordNumber){
    recnumber = firstObj.recordNumber;
  }
  top.submitframe.location = '/multi_select_ctl.jsp?firstval='+firstObj.value+'&ctlsql='+firstObj.ctlsql+'&recordnumber='+recnumber+'&secondid='+secondid;
}

//ͨ��IDȡ�ö���ֵ����Ϣ������ͨ��IMEI�õ��ֻ���������Ϣ��ʾ����ǰҳ����
function getMultiInfo(ctlObj){
  var recnumber = 0;
  if(ctlObj.recordNumber){
    recnumber = ctlObj.recordNumber;
  }
  top.submitframe.location = '/multi_info_ctl.jsp?ctlval='+ctlObj.value+'&ctlsql='+ctlObj.ctlsql+'&recordnumber='+recnumber+'&idset='+ctlObj.idset+'&ctlname='+ctlObj.name;
}

//��ֵת��Ϊ0
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

//��һ��url����������
function openUrl(v_url,v_target){
  if(v_target==null||v_target=='mainFrame'){
    top.workareaFrame.mainFrame.location = v_url;
  }
  if(v_target=='submitframe'){
    top.submitframe.location = v_url;
  }
}

//�����������Ĵ�С add by offsider 06.10.19
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

//��ӡ
function doPrint(v_rptname,v_param){
  var theurl = '/viewreport.jsp?report='+v_rptname+v_param;
  window.open(theurl,'printwindow',"height=400,width=800,status=yes,toolbar=no,menubar=no,location=no,resizeable=yes");
}
//�ж�����������Ч��
function validate(str){  
  if(!/^19\d\d-[0-1]\d-[0-3]\d+$/.test(str)&&!/^20\d\d-[0-1]\d-[0-3]\d+$/.test(str)){
    return false ;
  }else{
    return true;
  }
}
//�ж�����
function   IsNum(theField)
 {
  if   (!IsNum2(theField.value))
  {alert("������ֻ���������֣�");
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
	var Days = 30; //�� cookie �������� 30 ��
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
