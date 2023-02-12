/*----------------------------------------------------------------------------\
|                       ��ϲ˵��ͱ�ǩҳ��tabmenu.js                          |
|-----------------------------------------------------------------------------|
|                          Created by offsider                                |
|-----------------------------------------------------------------------------|
|                   Copyright (c) 2004 - 2008 PUDA Software                   |
\----------------------------------------------------------------------------*/
var Class = {
//������
  create : function () {
    return function () {
      this.initialize.apply(this, arguments);
    };
  }
};

var $A = function (a) {
//ת������
  return a ? Array.apply(null, a) : new Array;
};

var $ = function (id) {
  //��ȡ����
  if(document.getElementById(id)){
    return document.getElementById(id);
  }
  else{
    if(top.indexmainframe){
      if(top.indexmainframe.workareaFrame){
        if(top.indexmainframe.workareaFrame.mainFrame){
          return top.indexmainframe.workareaFrame.mainFrame.document.getElementById(id);
        }
      }
    }
  }
};

var Try = {
//����쳣
  these : function () {
    var returnValue, arg = arguments, lambda, i;
  
    for (i = 0 ; i < arg.length ; i ++) {
      lambda = arg[i];
      try {
        returnValue = lambda();
        break;
      } catch (exp) {}
    }
  
    return returnValue;
  }
  
};

Object.extend = function (a, b) {
  //׷�ӷ���
  for (var i in b) a[i] = b[i];
  return a;
};

Object.extend(Object, {

  addEvent : function (a, b, c, d) {
  //��Ӻ���
    if (a.attachEvent) a.attachEvent(b[0], c);
    else a.addEventListener(b[1] || b[0].replace(/^on/, ""), c, d || false);
    return c;
  },
  
  delEvent : function (a, b, c, d) {
    if (a.detachEvent) a.detachEvent(b[0], c);
    else a.removeEventListener(b[1] || b[0].replace(/^on/, ""), c, d || false);
    return c;
  },
  
  reEvent : function () {
    //��ȡEvent
    return window.event ? window.event : (function (o) {
      do {
        o = o.caller;
      } while (o && !/^\[object[ A-Za-z]*Event\]$/.test(o.arguments[0]));
      return o.arguments[0];
    })(this.reEvent);
  }
  
});

Function.prototype.bind = function () {
  //���¼�
  var wc = this, a = $A(arguments), o = a.shift();
  return function () {
    wc.apply(o, a.concat($A(arguments)));
  };
};

/*--------------------------------------------------------------------------*/

var TABMENU = Class.create();

TABMENU.IE = /MSIE/.test(window.navigator.userAgent);

TABMENU.load = function (obj_string, func, time) {
   //���ض���
  var index = 0, timer = window.setInterval(function () {
    try {
      if (eval(obj_string + ".loaded")) {
        window.clearInterval(timer);
        func(eval("new " + obj_string));
      }
    } catch (exp) {}

    if (++ index == 20) window.clearInterval(timer);
  }, time + index * 3);
};

TABMENU.prototype = {
  initialize : function () {
  //��ʼ����Ա
    var wc = this;
    wc.iFunc = wc.eFunc = null;
    
    wc.tabRoot = document.createElement("div");  //��
    wc.tabRoot.innerHTML = "<div class=\"tab-pane\" id=\"tabPane1\"></div>";
    wc.tabRoot.className = "tab_root";
    wc.tabPane = wc.tabRoot.all.item("tabPane1");
    wc.subMenus = [];
    wc.TabHandler = null;
  },
  
  addSubMenu : function(text, saction, id){
     var wc = this;
     tabpage = document.createElement("div");
     
     tabpage.id = id;
     tabpage.className = "tab-page";
     tabpage.targetpage = saction;
     tabpage.innerHTML = "<h2 class=\"tab\">"+text+"</h2>";
     
     wc.subMenus.concat( tabpage );
     wc.tabPane.appendChild(tabpage);
  },
  
  show : function(){
    var wc = this;
    wc.TabHandler = document.body;

    wc.TabHandler.appendChild(wc.tabRoot);
    
    wc.tabRoot.style.display = 'block';
    
  },
  
  dispose : function(){
    var wc = this;
    
    if(wc.TabHandler){
      wc.TabHandler.removeChild(wc.tabRoot); 
    }
    
    wc.initialize();
    
  }
  
};

var tabmenu = new TABMENU;
