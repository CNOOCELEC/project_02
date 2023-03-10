( function() {
	if (window.LUI != null)
		return;

	LUI = function(id) {
		if (Object.isString(id))
			return LUI.cachedInstances[id];
		else if (id.id)
			return LUI.cachedInstances[id.id];
		return null;
	};
	
	LUI.cachedInstances = {};
	
	LUI.syncAjax = function(requestUrl) {
		var http = {};
		if (window.XMLHttpRequest) {
			http = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			http = new ActiveXObject("Microsoft.XMLHTTP");
		}
		http.open("GET", requestUrl, false);
		http.setRequestHeader("Accept", "text/plain");
		http.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
		http.send(null);
		return http.responseText;
	};
	
	LUI.toJSON = function(str) {
		return (new Function("return (" + str + ");"))();
	};
	
	LUI.stringify = function(val) {
		return domain.stringify(val);
	};
	
	var zindex = 50;
	LUI.zindex = function() {
		zindex = zindex + 10;
		return zindex;
	};
	
	LUI._ready = [];

	LUI.ready = function(fn) {
		if (!LUI._ready)
			LUI._ready = [];
		LUI._ready.push(fn);
	};
	
	LUI.unplaceholder = function(dom) {
		if (document.documentMode != null && document.documentMode < 10) {
			$(dom).css("background-image", "");
		}
	};
	
	LUI.placeholder = function(dom) {
		
		if (document.documentMode != null && document.documentMode < 10) {
			seajs.use([ 'lui/jquery','lui/util/str' ],function($,str) {
				dom = $(dom);
				var base = seajs.data.base;
				
				dom.find("[placeholder]").each(function() {
					var obj = $(this);
					placeh();
					obj.focus(function(evt){
						if(!evt)
							return;
						obj = $(evt.target);
						obj.css("background-image","");
						obj.css("background-repeat","");
					});
					
					obj.blur(placeh);
					//obj.keyup(placeh);
//					obj.change(placeh);
					function placeh(evt) {
						
						if(evt)
							obj = $(evt.target);
						
						if (obj.val() == "") {
							
//							obj.isBack = true;
							obj.css("background-image",	"url('" + base
									+ "/resource/placeholder.jsp?text="
									+ str.encryptStr(encodeURIComponent(obj.attr("placeholder"))) 
									+ "&fontSize=" + str.encryptStr(obj.css("fontSize"))
									+ "&paddingLeft=" + str.encryptStr(obj.css("paddingLeft"))
									+ "')");
							
							obj.css("background-repeat","no-repeat");
							obj.css("background-position","left center");
						} else {
//							if (obj.isBack) {
								obj.css("background-image","");
								obj.css("background-repeat","");
//							}
						}
					}
				});
			});
		}
	};

	//??????????????????
	domain.register("fireEvent", function(event) {
		if (event.type == 'event') {
			seajs.use( [ 'lui/base' ], function(base) {
				var evented = base.byId(event.target);
				if (evented) {
					evented.emit(event.name, event.data);
				}
			});
		} else if (event.type == 'topic') {
			seajs.use( [ 'lui/topic' ], function(topic) {
				if (event.target) {
					topic.group(event.target).publish(event.name, event);
				} else {
					topic.publish(event.name, event);
				}
			});
		}
	});
	
	var dialogAgent = function(luiid){
		this.luiid = luiid;
	};
	
	dialogAgent.prototype.hide =  function(data) {
		domain.call(window.parent,"dialogAgentCall",[this.luiid,"hide",data]);
	};
	
	domain.register("dialogAgent",function(luiid){
		window['$dialog'] = new dialogAgent(luiid);
	});
	domain.register("dialogAgentCall",function(luiid,method,data){
		LUI(luiid)[method](data);
	});
	
	var lastReloadTime = 0;
	//?????????????????????,?????????????????????????????????10?????????????????????????????????
	domain.register("login",function(){
		seajs.use(['lui/jquery'],function($){
			var now = new Date().getTime();
			if(window.self == window.top && (now-lastReloadTime>1000*60*10)){
				lastReloadTime = now;
				var loginInfo = LUI.syncAjax(Com_Parameter.ContextPath +"sys/ui/resources/user.jsp?s_ajax=true");
				loginInfo = loginInfo!=null?$.trim(loginInfo):loginInfo;
				if(loginInfo!="" && loginInfo == "anonymous"){
					window.location.reload();
				}
			}
		});
	});
	
	LUI.fire = function(event, win) {
		if (win && window != win) {
			domain.call(win, 'fireEvent', [ event ]);
		} else {
			// {type:"event", target:"id", name="selectChanged", data{}}
			if (event.type == 'event') {
				seajs.use( [ 'lui/base' ], function(base) {
					var evented = base.byId(event.target);
					evented.emit(event.name, event.data);
				});
			} else if (event.type == 'topic') {
				seajs.use( [ 'lui/topic' ], function(topic) {
					if (event.target) {
						topic.group(event.target).publish(event.name, event);
					} else {
						topic.publish(event.name, event);
					}
				});
			}
		}
	};
	
	// ????????????????????????????????????????????????
	var regLoginPage = /<input[^>]+type=(\"|\')?(username|password)(\"|\')?[^>]*>/gi;
	LUI.ajaxComplete = function(xhr) {
		if (xhr.getResponseHeader("isloginpage") != null
				&& xhr.getResponseHeader("isloginpage") == "true") {
			if(window.self == window.top){//????????????ajax????????????
				window.location.reload();
			}else{
				domain.call(window.top,"login");
			}
		} else {
			if (xhr.responseText && xhr.responseText.search && xhr.responseText.search(regLoginPage) > 0) {
				if(window.self == window.top){
					window.location.reload();
				}else{
					domain.call(window.top,"login");
				}
			}
		}
	};
	
	
	var pinArray = [];
	
	//?????????????????????????????????????????????
	___hasPin = function(curObj){
		var isBind = false;
		for(var i=0; i<pinArray.length; i++){
			if(pinArray[i] && pinArray[i].obj == curObj){
				isBind = true;
				break;
			}
		}
		return isBind;
	};
	
	LUI.person = function(event, element){
		seajs.use(['lui/jquery','lui/parser','lui/pinwheel'],function($,parser,p){
			
			p($,parser);
			var events = $._data($(element)[0],'events');
			if(events && events["click"] ){ 
				//alert(111);
			}else{
				$(element).pinwheel();
			}
		});
	};
	
	LUI.maindata = function(event, element){
		seajs.use(['lui/jquery','lui/parser','lui/pinwheel'],function($,parser,p){
			p($,parser,441,190);
			var events = $._data($(element)[0],'events');
			if(events && events["click"] ){ 
				
			}else{
				$(element).pinwheel();
			}
			
		});
	};
	
	// RTF????????????????????????????????????????????????
	LUI.replaceRtfMainDataCard = function(objName){
		//debugger;
		seajs.use(['lui/jquery'],function($){
			$("[name='"+objName+"']").find("a").each(
					function(){
					     var href = $(this).attr("href");
					     if(href && href.indexOf('/sys/xform/maindata/main_data_show/sysFormMainDataShow.do?method=show')>=0){
							$(this).addClass("com_author");
							$(this).removeAttr("target");
							$(this).attr("href","javascript:void(0)");
							$(this).attr("ajax-href",href.replace('method=show','method=cardInfo'));
							$(this).attr("onmouseover","if(window.LUI && window.LUI.maindata)window.LUI.maindata(event,this);");
						} 
					}
				);
			
		});
		
	};
	
	// ?????????????????????
	if (navigator.userAgent.indexOf("MSIE") > -1
			&& document.documentMode == null || document.documentMode < 8) {
		if (!!window.ActiveXObject || "ActiveXObject" in window && (parseFloat(navigator.appVersion.split("MSIE")[1]) >7)) {
			return;
    	}
		function use(url, isCss) {
			var type = isCss ? 'link' : 'script';
			var node = document.createElement(type), head = document
					.getElementsByTagName("head")[0];
			if (isCss) {
				node.rel = "stylesheet";
				node.href = url;
			} else {
				node.src = url;
			}
			node.src = url;
			head.appendChild(node);
		}
		use(Com_Parameter.ContextPath + 'resource/js/jquery.js', false);
		use(Com_Parameter.ContextPath + 'sys/ui/extend/theme/default/style/common.css', true);
		use(Com_Parameter.ContextPath + 'sys/ui/extend/theme/default/style/icon.css', true);
		window.onload = function(){
			var $tip = $(
					'<div>??????????????? Internet Explorer ????????????IE?????????????????????????????????????????????????????????????????????IE8???????????????????????????Firefox/Chrome/Safari/Opera</div>')
					.appendTo($(document.body))
					.addClass('browserTip');
			var $close = $('<div class="lui_icon_s_icon_16 lui_icon_s" title="????????????">').click(function(evt) {
						$tip.remove();
					});
			$tip.append($close);
			window.onscroll = function() {
				$tip.css('top', $('body,html').scrollTop()+ 'px');
			};
		};
	}
	
	var _____pageOpen = function(url, target, features, customHashParams){
		var targets = '_blank;_self;_parent;_top';
		if(target == '_rIframe' && typeof(openPage) !== 'undefined'){
			openPage(url, {
				closeable : false 
			});
			return;
		}
		if(targets.indexOf(target) == -1){
			target = '_top';
		}
		LUI.addHashParamToCookie(url,customHashParams);
		window.open(url, target);
	};
	
	/**
	* ????????????Hash???????????????Cookie??????Cookie???????????????60??????
	* @param url      URL??????
	* @param customHashParams  ?????????Hash??????
	* @return
	*/
	LUI.addHashParamToCookie = function(url,customHashParams){
		// ??????IE8???????????????????????????startsWith??????
		if (typeof String.prototype.startsWith !== 'function') {
		    String.prototype.startsWith = function(prefix) {
		        return this.slice(0, prefix.length) === prefix;
		    };
		}
        // ????????????Cookie????????????60????????????
		var setHashParamCookie = function(name,value){
			var exp = new Date();
			exp.setTime(exp.getTime() + 60*1000); // ??????cookie???????????????60???
			document.cookie = name+"="+ escape(value) + ";expires="+exp.toGMTString()+";path=/";
		};
		var resultUrl = url;
        if(url && customHashParams && !url.startsWith("http") && !url.startsWith("https")){
			for(key in customHashParams){
				var value = customHashParams[key];
				if(key.indexOf("c_")==0){ 
					var cookieKey = "ekp_url_hash_param_"+key;
					var cookieValue = value;
					setHashParamCookie(cookieKey,cookieValue);
				}
			}     	
        }
	};
	
	/**
	* ???Cookie??????????????????Hash?????????
	* @param customHashName    ?????????Hash???????????????
	* @return
	*/
	LUI.getHashParamFromCookie = function(customHashName){
		var getHashParamCookie = function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
			else
			return null;
		};
		var cookieKey = "ekp_url_hash_param_"+customHashName;
		var cookieValue = getHashParamCookie(cookieKey);
		LUI.deleteHashParamFromCookie(customHashName);
		return cookieValue;
	};
	
	/**
	* ???Cookie??????????????????Hash?????????
	* @param customHashName    ?????????Hash???????????????
	* @return
	*/
	LUI.deleteHashParamFromCookie = function(customHashName){
		var getHashParamCookie = function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
			else
			return null;
		}
		var deleteHashParamCookie = function(name){
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var value=getHashParamCookie(name);
			if(value!=null){
				document.cookie = name+"="+ escape(value) + ";expires="+exp.toGMTString()+";path=/";
			}
		};
	    var cookieKey = "ekp_url_hash_param_"+customHashName;
	    deleteHashParamCookie(cookieKey);
	};

	LUI.getPageView = function(){
		if(LUI.$GetRootView$){
			return LUI.$GetRootView$();
		}
		try{
			var win = window;
			while(1){
				win = win.parent;
				if(win.LUI && win.LUI.$GetRootView$){
					return win.LUI.$GetRootView$();
				}
				if(win == top){
					break;
				}
			}
		}catch(e){
			return null;
		}
		return null;
	};
	
	/**
	 * ??????????????????
	 */
	LUI.setPageTitle = function(value){
		var content = LUI.getPageView();
		if(content){
			content.setPageTitle(value);
		}
	}
	
	/**
	 * ????????????
	 * @param {String} url:????????????????????????target??????????????????????????????????????????????????????HTML??????
	 * @param {String} target:???????????????_blank(???????????????)???_self(??????????????????)???_content(??????content)???_iframe(??????Iframe)???_rIframe(????????????Iframe)
	 * @param {Object} features:??????,???{ transition : 'slideDown' , pageClass : 'my custom pageClass'  }
	 * @param customHashParams {Object} ?????????hash????????????j_start???j_target???j_path???????????????hash????????????????????????hash???????????????????????????"c_"??????????????????c_app_title???c_app_url
	 */
	LUI.pageOpen = function(url, target, features, customHashParams){
		var view = LUI.getPageView();
		
		if("_rIframe" == target) {
			seajs.use( [ 'lui/topic' ], function(topic) {
				topic.publish("lui/page/show/rIrame", features);
			});
		}
		
		if(view){
			features = features || {};
			features.curWindow = window;
			view.open(url, target, features, customHashParams);
		}else{
			_____pageOpen(url, target, features, customHashParams);
		}
	};
	
	/**
	 * ????????????
	 * @param {String} target:???????????????_content(?????????)???_iframe(Iframe??????)???_rIframe(??????Iframe??????)
	 */
	LUI.pageHide = function(target, features){
		var view = LUI.getPageView();
		if(view){
			features = features || {};
			features.curWindow = window;
			view.hide(target, features);
		}else{
			if(target == '_rIframe' && typeof(openQuery) !== 'undefined'){ //bad hack
				
				seajs.use( [ 'lui/topic' ], function(topic) {
					topic.publish("lui/page/hide/rIrame", features);
				});
				
				openQuery();
			}
		}
	};
	
	/**
	 * ?????????????????????????????????,default:????????????quick:????????????
	 */
	LUI.pageMode = function(){
		var view = LUI.getPageView();
		if(view){
			return view.mode;
		}
		return 'default';
	};
	
	/**
	 * ????????????
	 * ??????:???????????????(?????????LUI.pageOpen()????????????)
	 */
	LUI.pageQuickOpen = function(url, target, features, customHashParams){
		LUI.pageOpen(url, target, features, customHashParams);
	};
	
	/**
	 * ?????????????????????????????????
	 * ??????:???????????????(?????????LUI.pageMode()????????????????????????)
	 */
	LUI.pageQuickMode = function(){
		return LUI.pageMode() == 'quick';
	}
	
})();