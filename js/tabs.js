	var $id=function(id){
		return (typeof id == "object") ? id : document.getElementById(id);
	};
	var $$=function(tag,elm){
		return elm.getElementsByTagName(tag);
	};
	var $C=function(cn,tag,elm){
		if(!tag) tag='*';
		var ts = $$(tag,elm);
		var classArr = [];
		var filter = new RegExp("(^|\\s)"+cn+"(\\s|$)");
		for(var i=0,l=ts.length;i<l;i++){
			if(filter.test(ts[i].className)){
				classArr.push(ts[i]);
			}
		}
		return classArr;
	}
	var cutover=function(arr,cur,cls){
		for(var i=0,l=arr.length;i<l;i++){
			if(i==cur){
				var t=arr[i].className.indexOf(cls);
				if (t==-1) {
					arr[i].className += ' '+cls;
				}
				else return true;
			}else{
				arr[i].className = arr[i].className.replace(cls,'');
			}
			
		}
	}
	var Bind = function(object, fun) {
		return function() {
			return fun.apply(object);
		}
	}
	var addEvent = function(eType,eFunc,eObj){
		eObj = eObj || document;
		if(window.attachEvent) eObj.attachEvent("on"+eType,eFunc);
		if(window.addEventListener) eObj.addEventListener(eType,eFunc,false);
	}
	var Tabs = function (elm,items){
		if(elm == null){return false;}
		var t=this;
		var a=items || {};
		
		/*开始缓存传入参数*/
		t.hdtag =a.hdtag || 'DIV';
		t.hdcn =a.hdcn || 'tabhd';
		t.hdtagcur =a.hdtagcur || 'cur';
		t.bdtag =a.bdtag || 'DIV';
		t.bdcn =a.bdcn || 'tabbd';
		t.bdtagcur =a.bdtagcur || 'cur';
		t.evt = a.evt || 'mouseover';
		/*缓存参数完成*/
		
		t.tabhd = $C(t.hdcn,t.hdtag,elm)[0];
		t.tabtag = t.tabhd.children;
		t.tabbd = $C(t.bdcn,t.bdtag,elm)[0];
		t.tabcon = t.tabbd.children;
		
		t.now = 0;
		t.yes = true;
		t.time =a.auto;
		t.sum = t.tabtag.length;
		if(t.sum != t.tabcon.length) {
			alert('Tab标签个数与内容个数不匹配');
			return true;
		}
		/**/
		for(var i=0;i<t.sum;i++){
			
			(function(i){
				addEvent('mouseover',function(){
					t.yes = false;
				},t.tabtag[i]);
				addEvent(t.evt,function(){
					t.now = i;
					//alert(i);
					this.run = setTimeout(Bind(t,t.change),300);
				},t.tabtag[i])
				addEvent('mouseout',function(){
					t.yes = true;
					clearTimeout(this.run);
				},t.tabtag[i]);
			})(i);
		}
		this.change();
		if(t.time){
			elm.onmouseover = function(){
				t.stop()
			}
			elm.onmouseout = function(){
				t.go()
			}
		}
	}
	Tabs.prototype = {
		change:function(){
			cutover(this.tabtag,this.now,this.hdtagcur);
			cutover(this.tabcon,this.now,this.bdtagcur);
			if(this.time && this.yes){
				this.now = (this.now == this.sum-1) ? 0 : this.now+1;
				this.go();
			}
		},
		go:function(){
			this.stop();
			this.auto = setTimeout(Bind(this,this.change),this.time)
		},
		stop:function(){
			clearTimeout(this.auto);
		}
	};
	
	$(function(){
	var $div_li =$("div.tabmenu ul li");
	$div_li.mouseover(function () {
		$(this).addClass("selected")              
			   .siblings().removeClass("selected"); 
		var index =  $div_li.index(this);         
		$("div.tabcon > div")   	
				.eq(index).show()  
				.siblings().hide(); 
	}).hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	})
})