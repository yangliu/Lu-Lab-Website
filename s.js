/* Created by Liu Yang (http://yangliu.name) in Espresso. All rights reserved */
(function($){$.browserTest=function(a,z){var u='unknown',x='X',m=function(r,h){for(var i=0;i<h.length;i=i+1){r=r.replace(h[i][0],h[i][1]);}return r;},c=function(i,a,b,c){var r={name:m((a.exec(i)||[u,u])[1],b)};r[r.name]=true;r.version=(c.exec(i)||[x,x,x,x])[3];if(r.name.match(/safari/)&&r.version>400){r.version='2.0';}if(r.name==='presto'){r.version=($.browser.version>9.27)?'futhark':'linear_b';}r.versionNumber=parseFloat(r.version,10)||0;r.versionX=(r.version!==x)?(r.version+'').substr(0,1):x;r.className=r.name+r.versionX;return r;};a=(a.match(/Opera|Navigator|Minefield|KHTML|Chrome/)?m(a,[[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/,''],['Chrome Safari','Chrome'],['KHTML','Konqueror'],['Minefield','Firefox'],['Navigator','Netscape']]):a).toLowerCase();$.browser=$.extend((!z)?$.browser:{},c(a,/(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/,[],/(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));$.layout=c(a,/(gecko|konqueror|msie|opera|webkit)/,[['konqueror','khtml'],['msie','trident'],['opera','presto']],/(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);$.os={name:(/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase())||[u])[0].replace('sunos','solaris')};if(!z){$('html').addClass([$.os.name,$.browser.name,$.browser.className,$.layout.name,$.layout.className].join(' '));}};$.browserTest(navigator.userAgent);})(jQuery);
//slides on homepage

//jQuery.lulab_url = "http://lulab"; //for localtest
jQuery.lulab_url = "http://projects.liuy.me/lulab"; //for development environment
//jQuery.lulab_url = "http://www.seas.ucla.edu/~lu"; //for product environment

var featured_slides = new function (){
	this.num = 0;
	this.current = 0;
	this.init = function() {
		var i=0;
		this.pic_lis = jQuery("#featured-pic li");
		this.num = this.pic_lis.length;
		if (this.num <= 0) return false;
		this.btn_as = jQuery("#featured-sel li a");
		if (this.btn_as.length != this.num) return false;
		this.pic_wnd = jQuery("#featured-pic");
		this.p_offset = this.pic_wnd.get(0).offsetLeft;
		this.des_lis = jQuery("#featured-text li");
		
		
		for (i=0;i<this.num;i++) {
			this.pic_lis.get(i).rel = i;
			this.btn_as.get(i).rel = i;
			this.des_lis.get(i).rel = i;
		}
		
		this.btn_as.click(function(){
			featured_slides.select(this.rel);
			return false;
		});
		return true;
	};
	this.select = function(which) {
		if (this.is_auto) {
			clearInterval(this.timer);
		}
		if (which == -2) { //next one
			if (this.current+1 == this.num) {
				which = 0;
			} else {
				which = this.current+1;
			}
		}
		jQuery(this.btn_as.get(this.current)).removeClass('sel');
		jQuery(this.btn_as.get(which)).addClass('sel');
		var new_left = -1 * (this.pic_lis.get(which).offsetLeft - this.p_offset)
		this.pic_wnd.animate({left: new_left + "px"},400,"swing");
		jQuery(this.des_lis.get(this.current)).fadeOut(800);
		jQuery(this.des_lis.get(which)).fadeIn(800);
		
		this.current = which;
		if (this.is_auto) {
			this.timer = setInterval("featured_slides.select(-2);",this.auto_intval);
		}
	};
	this.initselect = function(which) {
		this.pic_wnd.css({left:-1800});
		jQuery(this.btn_as.get(which)).addClass('sel');
		var new_left = -1 * (this.pic_lis.get(which).offsetLeft - this.p_offset)
		this.pic_wnd.animate({left: new_left},400,"swing");
		jQuery(this.des_lis.get(which)).fadeIn(800);
		this.current = which;
	};
	this.set_auto = function(intval) {
		if (intval == -1) {
			this.is_auto = false;
		
		}else {
			this.is_auto = true;
			this.auto_intval = intval;
			this.timer = setInterval("featured_slides.select(-2);",intval);
		}
	};
};

var smoothscroll = function(e) {
	e.preventDefault();
	var t=jQuery(this).attr('href');
	if (t=='#past-members-overlay') return false;
	$('html,body').animate({scrollTop: $(t).offset().top},1500,function(){
	       location.hash = t;
	   });
	return false;
	   
};


var parsePubXML = function(year,homepage) {
	jQuery.ajax({
		type: "GET",
		url: "papers/year-"+year+".xml",
		dataType: "xml",
		error: function(a,b,c) {
			//console.log(b);
		},
		success: function(data) {
			var sections=jQuery('#content .section');
			var i,j;
			if (!homepage) {
				for (i=0;i<sections.length;i++) {
					if (sections.get(i).getAttribute('tag')<year) {
						j=i;
						break;
					}
				}
				jQuery('#'+sections.get(j).getAttribute('id')).before('<div id="year-'+year+'" class="section" tag="'+year+'"><h2 class="sec-title">year '+year+'</h2><ul class="publist"></ul></div>');
			}
			numPapers = 0;
			$(data).find('paper').each(function(){
				if (homepage & numPapers > 2) return true;
				var papernode = $(this);
				//pdf url
				pdflink = papernode.find('pdf').text();
				if (pdflink != '#') {
					pdflink = jQuery.lulab_url+'/papers/' + pdflink;
				}
				//author
				authorspan = '<span class="dp-authors">';
				papernode.find('authors').find('author').each(function(){
					authorspan += jQuery(this).text() + '; ';
				});
				authorspan += '</span>';
				//title
				titlespan = '<span class="dp-title">"';
				titlespan += papernode.find('title').text();
				titlespan += '"</span>';
				if (homepage) {
					titlespan = '<h3 class="hl-title">'+papernode.find('title').text()+'</h3>';
				}
				//journal
				journalspan = '<span class="dp-journal">';
				journalspan += papernode.find('journal').text();
				journalspan += '</span>';
				if (homepage) {
					journalspan = '<span class="j-name">'+papernode.find('journal').text()+'</span>';
				}
				//year
				yearspan = '<span class="dp-year">'+year+'</span>';
				if (homepage) {
					yearspan = year;
				}
				//vol
				volspan = '<span class="dp-vol">'+papernode.find('vol').text()+'</span>';
				if (homepage) {
					volspan = papernode.find('vol').text();
				}
				//page
				pagespan = '<span class="dp-page">'+papernode.find('page').text()+'</span>';
				if (homepage) {
					pagespan = papernode.find('page').text();
				}
				if (homepage) {
					strli = '<li>'+titlespan+'<h4 class="hl-cite-info">'+journalspan+', '+volspan+', '+pagespan+' ('+yearspan+')</h4><div class="hl-readmore-ct"><a href="'+pdflink+'" class="hl-btn-readmore s">Read this paper</a></div>';
					jQuery('#home-list').append(strli);
				} else {
					strli='<li><a href="'+pdflink+'" class="downloadpaper"><div class="dp-icon"></div><div class="dp-citeinfo">'+authorspan+', '+titlespan+', '+journalspan+', '+yearspan+', '+volspan+', '+pagespan+'.</div></a></li>';
					jQuery('#year-'+year+" ul").append(strli);
				}
				numPapers++;
			});
			if (homepage) {
				return true;
			}
			var buttons = jQuery("#pub-years-nav .sbutton");
			for (i=0;i<buttons.length;i++) {
				if (buttons.get(i).getAttribute('tag')<year) {
					j=i;
					break;
				}
			}
			jQuery(buttons.get(j)).before('<a href="#year-'+year+'" class="sbutton" tag="'+year+'" id="btn-year-'+year+'"><span>'+year+' ('+numPapers+')</span></a>');
			jQuery('#btn-year-'+year).click(smoothscroll);
			numPapers = 0;
			
		}
	});
};


jQuery(document).ready(function(){
	//browser detection
	var ln=jQuery.layout.name.toLowerCase(), lv=jQuery.layout.versionNumber;
	if (ln=='webkit'
		|| (ln=='gecko' && lv>=1.9)
		|| (ln=='presto' && jQuery.browser.versionNumber >= 9)
		|| (ln=='trident' && lv>=8)
		) {
		//do nothing
	} else {
			//alert("Layout: "+ln+"; Version: "+jQuery.layout.version+" - "+lv);
		window.location.href = jQuery.lulab_url+"/mini.html";
	}
	
	
	if (featured_slides.init()) {
		featured_slides.initselect(0);
		//featured_slides.set_auto(5000); //bug here
		parsePubXML(2010,true);
	}
	
	if (jQuery('#resint-title').length || jQuery('#publications-title').length || jQuery('#members-title').length) {
		$('a[href*=#]').click(smoothscroll);
	}

	if (jQuery('#publications-title').length) {
		var yearList = new Array('1996','1997','1998','1999','2000','2001','2003','2004','2005','2006','2007','2008','2009','2010');
		var i=0;
		for(i=yearList.length;i>0;i--) {
			parsePubXML(yearList[i-1]);
		}
		//parsePubXML('2008');
	}

	if (jQuery('#floatnav').length > 0) {
		jQuery(window).scroll(function(){
			var t1 = jQuery('body').get(0).scrollTop;
			if (t1 > jQuery('#sidebar').get(0).offsetTop) {
				jQuery('#floatnav').stop();
				jQuery('#floatnav').animate({top: t1-jQuery('#sidebar').get(0).offsetTop+20},500);
			} else {
				jQuery('#floatnav').stop();
				jQuery('#floatnav').animate({top: 0},500);
			}
		});
	}
	if (jQuery('#members-title').length) {
		jQuery("a[class*='member-btn-']").hover(function(){
			jQuery(this).animate({opacity: 1},400);
		},function(){
			jQuery(this).animate({opacity: 0.5},700);
		});
		
		jQuery('#pastmember-trigger').click(function(){
			var o=jQuery('#past-members-overlay');
				$('html,body').animate({scrollTop: 0}, 200,function(){
					$('body').css({overflow: 'hidden'});
					o.fadeIn();
				});
				
		});
		document.getElementById('pm-overlay-close').onclick = function(){
			$('body').css({overflow: 'auto'});
			$('#past-members-overlay').fadeOut();
		};
	}
});
