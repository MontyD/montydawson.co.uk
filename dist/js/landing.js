!function(){"use strict";function a(a,b,c){var d;return function(){var e=this,f=arguments,g=function(){d=null,c||a.apply(e,f)},h=c&&!d;clearTimeout(d),d=setTimeout(g,b),h&&a.apply(e,f)}}var b,c=new Blazy({offset:100}),d=document.getElementById("aboutMe"),e=function(){var a=["I'm always learning.","I like bold and clever design.","I like a challenge.","I like thinking before doing.","I take pride in what I do.","I'm always learning."],c=0,e=String(a[c]).split(""),f=function(){return console.log(e),d.innerHTML+=e.shift(),e.length>0?(b=window.setTimeout(f,80),!1):c>=a.length-1?!1:(b=window.setTimeout(g,2e3),!1)},g=function(){var h=d.innerHTML;return d.innerHTML=h.substring(0,h.length-1),h.length>0?(b=window.setTimeout(g,70),!1):(c++,c>=a.length?!1:(e=String(a[c]).split(""),f()))};b=window.setTimeout(g,700)},f=function(){try{window.clearTimeout(b)}catch(a){}return d.innerHTML="I'm always learning.",!1},g=function(){var a=new XMLHttpRequest,b="./dist/json/projects.json?t="+String(Math.random()).substr(5);return a?(a.onreadystatechange=function(){a.readyState===XMLHttpRequest.DONE&&(200===a.status?(m.projects=JSON.parse(a.response).projects,m.jsonLoaded()):console.error("Unable to receive ajax request."))},a.open("GET",b),void a.send()):(console.error("Cannot make ajax request."),!1)},h=function(a,b,c,d,e){this.order=a,this.active=c||!1,this.called=!1,this.element=document.getElementById(b),this.initFn=d,this.exitFn=e};h.prototype.init=function(){return this.active=!0,this.called||(this.element.className+=" active",this.called=!0,"function"==typeof this.initFn&&this.initFn()),!1},h.prototype.exit=function(){return"function"==typeof this.exitFn&&this.exitFn(),this.active=!1,!1};var i=new h(0,"first"),j=new h(1,"second",!1,e,f),k=new h(2,"third",!1,g),l=new h(3,"fourth"),m={doc:document.documentElement,element:document.getElementsByTagName("body")[0],scrollPosition:0,panels:[i,j,k,l],projects:[],currentProject:0,activePanel:0,menu:{element:document.getElementById("menu"),open:!1,opener:{element:document.getElementById("hamburger"),active:function(){return this.element.className+=" active"}},triggerElements:document.getElementsByClassName("toggleMenu"),toggle:function(a){var b=a||window.event;return b.preventDefault?b.preventDefault():b.returnValue=!1,this.menu.open?(this.menu.element.className="",this.menu.opener.element.className+=" active"):(this.menu.element.className="active",this.menu.opener.element.className=this.menu.opener.element.className.replace(" active","")),this.menu.open=!this.menu.open}},gentleScrollers:{elements:document.getElementsByClassName("gentleScroll"),scroll:function(a){var b=a||window.event;b.preventDefault?b.preventDefault():b.returnValue=!1;var c=this.href.substr(this.href.indexOf("#"));smoothScroll.animateScroll(c)}},toggleSkills:{elements:document.getElementsByClassName("skillsHeader"),toggle:function(a){var b=a||window.event;b.preventDefault?b.preventDefault():b.returnValue=!1;var c=this.parentNode.parentNode.className;if("skillsGroup expand"===c)for(var d=0;d<m.toggleSkills.elements.length;d++)m.toggleSkills.elements[d].parentNode.parentNode.className="skillsGroup";else{for(var e=0;e<m.toggleSkills.elements.length;e++)m.toggleSkills.elements[e].parentNode.parentNode.className="skillsGroup";this.parentNode.parentNode.className="skillsGroup expand"}return!1}},projectsToggle:{elements:{desktopImg:document.getElementById("desktopImage"),mobileImg:document.getElementById("mobileImage"),addressBar:document.getElementById("addressBar"),projectLinkButton:document.getElementById("projectLinkButton"),projectDescription:document.getElementById("projectDescription"),projectMoreInfo:document.getElementById("projectMoreInfo"),toggleNext:document.getElementById("nextProject"),togglePrevious:document.getElementById("previousProject")},toggle:function(a){this.panels[2].element.className+=" transition",a?this.currentProject--:this.currentProject++,this.currentProject===this.projects.length&&(this.currentProject=0),-1===this.currentProject&&(this.currentProject=this.projects.length-1);var b=this;window.setTimeout(function(){var a=b.projects[b.currentProject];return desktopImage.setAttribute("data-src","dist/img/"+a.desktopImage),desktopImage.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",desktopImage.className="b-lazy desktop",mobileImage.setAttribute("data-src","dist/img/"+a.mobileImage),mobileImage.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",mobileImage.className="b-lazy mobile",c.revalidate(),a.siteLink?(b.projectsToggle.elements.addressBar.href=a.siteLink,b.projectsToggle.elements.addressBar.innerHTML=a.siteLink,b.projectsToggle.elements.projectLinkButton.href=a.siteLink,b.projectsToggle.elements.projectLinkButton.title=a.title,b.projectsToggle.elements.projectLinkButton.className="linkLikeAButton"):(b.projectsToggle.elements.addressBar.href="#",b.projectsToggle.elements.addressBar.innerHTML=a.title,b.projectsToggle.elements.projectLinkButton.className="linkLikeAButton hidden"),b.projectsToggle.elements.addressBar.title=a.title,b.projectsToggle.elements.projectDescription.innerHTML=a.description,b.projectsToggle.elements.projectMoreInfo.href=a.moreInfo,b.projectsToggle.elements.projectMoreInfo.title=a.title,b.panels[2].element.className=b.panels[2].element.className.replace(" transition",""),!1},500)}},init:function(){this.element.className="";var a=this;setTimeout(function(){a.panels[0].init(),a.menu.opener.active()},2500);for(var b=0;b<this.menu.triggerElements.length;b++)this.menu.triggerElements[b].onclick=this.menu.toggle.bind(this);for(var c=0;c<this.gentleScrollers.elements.length;c++)this.gentleScrollers.elements[c].onclick=this.gentleScrollers.scroll;for(var d=0;d<this.toggleSkills.elements.length;d++)this.toggleSkills.elements[d].onclick=this.toggleSkills.toggle},scroll:a(function(){var a=this.doc.clientHeight;return this.scrollPosition=(window.pageYOffset||this.doc.scrollTop)-(this.doc.clientTop||0),this.scrollPosition>2*a+a/2?this.updateActive(3):this.scrollPosition>a+a/2?this.updateActive(2):this.scrollPosition>a/2?this.updateActive(1):this.scrollPosition<a/2?this.updateActive(0,!0):void 0},20),resize:a(function(){c.revalidate()},200),jsonLoaded:function(){this.panels[2].element.className+=" loaded";var a=this;return this.projectsToggle.elements.togglePrevious.onclick=function(b){var c=b||window.event;return c.preventDefault?c.preventDefault():c.returnValue=!1,a.projectsToggle.toggle.apply(a,[!0]),!1},this.projectsToggle.elements.toggleNext.onclick=function(b){var c=b||window.event;return c.preventDefault?c.preventDefault():c.returnValue=!1,a.projectsToggle.toggle.apply(a),!1},!1},updateActive:function(a,b){if(this.activePanel===a)return!1;b||this.panels[a].init(),this.activePanel=a;for(var c=1;c<this.panels.length;c++)c!==a&&this.panels[c].exit();return!1}};window.addEventListener("scroll",function(){m.scroll()},!1),window.addEventListener("load",function(){m.init()},!1),window.addEventListener("resize",function(){m.resize()},!1)}();