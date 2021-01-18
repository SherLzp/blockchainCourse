(function($) {
    $.fn.extend({
		// Déclaration du plugin
		setZoomPicture: function(options) {	
			//Déclaration des paramètres par défaut
			var defaults = {
				thumbsContainer: null,
				prevContainer: null,
				nextContainer: null,
				zoomContainer: null,
				zoomLevel: 2,
				loadMsg: 'Loading...'
			};

			// Initialisation de la collection de paramètres
			var _options = $.extend(defaults, options);
			
			// Création de la classe de gestion
			var diaporama = {
				_opt: null,
				_totalImg: 0,
				_currentImg: 0,
				_thumbSize: 0,

				init: function(opt) {						
					this._opt = opt;
					this._totalImg = $(this._opt.thumbsContainer).find("img").length - 1;
					this._currentImg = 0;
					this._thumbSize = $(this._opt.thumbsContainer).find("img").first().outerWidth(true) + 3;

					// Initialisation des événements 'click' sur les miniatures et les boutons
					this._attachThumbsEvent();

					// Initialisation des effets de zoom
					this._setZoomEffects();

					// Affichage de la première image de la banque
					this._showPicture($(this._opt.thumbsContainer).find("img").first());
				},

				_attachThumbsEvent: function() {
					var me = this;

					$(this._opt.thumbsContainer).find("img").click(function(e) {
						me._setDefault();

						me._currentImg = $('img').index(this) - 1;
						var thumbImg = $(this);

						me._animateThumbs(e);

						// Remplacement de l'image affiché par la nouvelle
						me._showPicture($(thumbImg));
					});

					$(this._opt.prevContainer).click(function(e) {me._previous(e);});

					$(this._opt.nextContainer).click(function(e) {me._next(e);});
				},

				_setDefault: function() {
					$(this._opt.zoomContainer)
						.unbind('mousemove')
						.hide();
							
					$(this).css('cursor', 'default');
				},

				_previous: function(pos) {
					if (this._currentImg > 0) {
						this._currentImg--;
						
						this._animateThumbs(pos);
							
						this._showPicture($(this._opt.thumbsContainer).find("img")[this._currentImg]);
					}
				},

				_next: function(pos) {
					if (this._currentImg < this._totalImg) {
						this._currentImg++;
						
						this._animateThumbs(pos);
							
						this._showPicture($(this._opt.thumbsContainer).find("img")[this._currentImg]);
					}
				},
				
				_animateThumbs: function(pos) {
					var me = this;

					if (($(document).width() / 2) < pos.pageX) {
						$(me._opt.thumbsContainer).animate(
							{scrollLeft : Math.max(0, $(me._opt.thumbsContainer).scrollLeft() + me._thumbSize)},
							800
						);
					}
					else {
						$(me._opt.thumbsContainer).animate(
							{scrollLeft : Math.max(0, $(me._opt.thumbsContainer).scrollLeft() - me._thumbSize)},
							800
						);
					}
				},

				_showPicture: function(thumb) {	
					$(this._opt.thumbsContainer).find('img').css('background', '#fff');
					$(thumb).css('background', '#ccc');
					
					var _img = new Image();
					_img.src = $(thumb).attr('src');
					
					var me = this;

					$(this._opt.jObject).find("img").fadeOut('slow', function() {
						var img = $(this);
						
						$(img).attr('src', $(thumb).attr('src'))
							  .attr('alt', $(thumb).attr('alt'));
							   
						
					
						$(me._opt.jObject).animate(
							{ height: '80%' },
							500,
							function() {
								$(img).width('80%')
									  .fadeIn('slow');
							}
						);
					});
				},
				
				_setZoomEffects: function() {
					var me = this;
					
					$(this._opt.jObject).find('img')
						.bind('mouseover', function(e) {
							var imgObject = $(this);

							me._setZoomPosition(e);
							
							$(me._opt.zoomContainer)
								.css('cursor', 'none')
								.show();

							$(document).bind('mousemove', function(pos) { 
								me._moveZoom(imgObject, pos);
							});
						});
				},
				
				_moveZoom: function(img, pos) {
					if (pos.pageX < $(img).position().left ||
						pos.pageX > $(img).position().left + $(img).width() ||
						pos.pageY < $(img).position().top ||
						pos.pageY > $(img).position().top + $(img).height() ) {
						this._setDefault();
					}
					else {
						var delta = 50 * (this._opt.zoomLevel - 1);
						
						this._setZoomPosition(pos);
						
						$(this._opt.zoomContainer)
							.css('background-image', "url('" + $(img).attr('src') + "')")
							.css('background-position', 
								(((pos.pageX - 50 - $(img).position().left) * this._opt.zoomLevel * -1) - delta).toString() + "px " + 
								(((pos.pageY - 50 - $(img).position().top) * this._opt.zoomLevel * -1) - delta).toString() + "px");
					}
				},
	
				_setZoomPosition: function(_pos) {
					$(this._opt.zoomContainer)
						.css('top', _pos.pageY - 50)
						.css('left', _pos.pageX - 50);
				}
			};

			// Retourne chaque objet jQuery
			return this.each(function() {
				// Ajoute l'objet jQuery courant à la collection 'options'
				_options.jObject = $(this);
				
				// Création d'un message d'attente pendant le chargement
				$(this).find('img').hide();
				$(this).prepend('<div id="loading">' + _options.loadMsg + '</div>');
				$('#loading')
					.css('line-height', $(this).css('height'))
					.queue(function(loop) {
						$(this).fadeIn(1000).delay(500).fadeOut(1000);
						$(this).queue(arguments.callee);
						loop();
					});

				// Chargement de la classe diaporama a la fin du téléchargement
				$(window).load(function() {
					$('#loading').remove();
					
					// Initialisation de la classe 'diaporama'
					diaporama.init(_options);
				});
			});
		}
    });
})(jQuery);


(function(){function b(a,b){return[].slice.call((b||document).querySelectorAll(a))}if(!window.addEventListener)return;var a=window.StyleFix={link:function(b){try{if(b.rel!=="stylesheet"||!b.sheet.cssRules||b.hasAttribute("data-noprefix"))return}catch(c){return}var d=b.href||b.getAttribute("data-href"),e=d.replace(/[^\/]+$/,""),f=b.parentNode,g=new XMLHttpRequest;g.open("GET",d),g.onreadystatechange=function(){if(g.readyState===4){var c=g.responseText;if(c&&b.parentNode){c=a.fix(c,!0,b),e&&(c=c.replace(/url\((?:'|")?(.+?)(?:'|")?\)/gi,function(a,b){return/^([a-z]{3,10}:|\/|#)/i.test(b)?a:'url("'+e+b+'")'}),c=c.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+e,"gi"),"$1"));var d=document.createElement("style");d.textContent=c,d.media=b.media,d.disabled=b.disabled,d.setAttribute("data-href",b.getAttribute("href")),f.insertBefore(d,b),f.removeChild(b)}}},g.send(null),b.setAttribute("data-inprogress","")},styleElement:function(b){var c=b.disabled;b.textContent=a.fix(b.textContent,!0,b),b.disabled=c},styleAttribute:function(b){var c=b.getAttribute("style");c=a.fix(c,!1,b),b.setAttribute("style",c)},process:function(){b('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link),b("style").forEach(StyleFix.styleElement),b("[style]").forEach(StyleFix.styleAttribute)},register:function(b,c){(a.fixers=a.fixers||[]).splice(c===undefined?a.fixers.length:c,0,b)},fix:function(b,c){for(var d=0;d<a.fixers.length;d++)b=a.fixers[d](b,c)||b;return b},camelCase:function(a){return a.replace(/-([a-z])/g,function(a,b){return b.toUpperCase()}).replace("-","")},deCamelCase:function(a){return a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()})}};(function(){setTimeout(function(){b('link[rel="stylesheet"]').forEach(StyleFix.link)},10),document.addEventListener("DOMContentLoaded",StyleFix.process,!1)})()})(),function(a,b){if(!window.StyleFix||!window.getComputedStyle)return;var c=window.PrefixFree={prefixCSS:function(a,b){function e(b,d,e,f){b=c[b];if(b.length){var g=RegExp(d+"("+b.join("|")+")"+e,"gi");a=a.replace(g,f)}}var d=c.prefix;e("functions","(\\s|:|,)","\\s*\\(","$1"+d+"$2("),e("keywords","(\\s|:)","(\\s|;|\\}|$)","$1"+d+"$2$3"),e("properties","(^|\\{|\\s|;)","\\s*:","$1"+d+"$2:");if(c.properties.length){var f=RegExp("\\b("+c.properties.join("|")+")(?!:)","gi");e("valueProperties","\\b",":(.+?);",function(a){return a.replace(f,d+"$1")})}return b&&(e("selectors","","\\b",c.prefixSelector),e("atrules","@","\\b","@"+d+"$1")),a=a.replace(RegExp("-"+d,"g"),"-"),a},prefixSelector:function(a){return a.replace(/^:{1,2}/,function(a){return a+c.prefix})},prefixProperty:function(a,b){var d=c.prefix+a;return b?StyleFix.camelCase(d):d}};(function(){var a={},b=[],d={},e=getComputedStyle(document.documentElement,null),f=document.createElement("div").style,g=function(c){if(c.charAt(0)==="-"){b.push(c);var d=c.split("-"),e=d[1];a[e]=++a[e]||1;while(d.length>3){d.pop();var f=d.join("-");h(f)&&b.indexOf(f)===-1&&b.push(f)}}},h=function(a){return StyleFix.camelCase(a)in f};if(e.length>0)for(var i=0;i<e.length;i++)g(e[i]);else for(var j in e)g(StyleFix.deCamelCase(j));var k={uses:0};for(var l in a){var m=a[l];k.uses<m&&(k={prefix:l,uses:m})}c.prefix="-"+k.prefix+"-",c.Prefix=StyleFix.camelCase(c.prefix),c.properties=[];for(var i=0;i<b.length;i++){var j=b[i];if(j.indexOf(c.prefix)===0){var n=j.slice(c.prefix.length);h(n)||c.properties.push(n)}}c.Prefix=="Ms"&&!("transform"in f)&&!("MsTransform"in f)&&"msTransform"in f&&c.properties.push("transform","transform-origin"),c.properties.sort()})(),function(){function e(a,b){return d[b]="",d[b]=a,!!d[b]}var a={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"}};a["repeating-linear-gradient"]=a["repeating-radial-gradient"]=a["radial-gradient"]=a["linear-gradient"];var b={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",flexbox:"display","inline-flexbox":"display"};c.functions=[],c.keywords=[];var d=document.createElement("div").style;for(var f in a){var g=a[f],h=g.property,i=f+"("+g.params+")";!e(i,h)&&e(c.prefix+i,h)&&c.functions.push(f)}for(var j in b){var h=b[j];!e(j,h)&&e(c.prefix+j,h)&&c.keywords.push(j)}}(),function(){function f(a){return e.textContent=a+"{}",!!e.sheet.cssRules.length}var b={":read-only":null,":read-write":null,":any-link":null,"::selection":null},d={keyframes:"name",viewport:null,document:'regexp(".")'};c.selectors=[],c.atrules=[];var e=a.appendChild(document.createElement("style"));for(var g in b){var h=g+(b[g]?"("+b[g]+")":"");!f(h)&&f(c.prefixSelector(h))&&c.selectors.push(g)}for(var i in d){var h=i+" "+(d[i]||"");!f("@"+h)&&f("@"+c.prefix+h)&&c.atrules.push(i)}a.removeChild(e)}(),c.valueProperties=["transition","transition-property"],a.className+=" "+c.prefix,StyleFix.register(c.prefixCSS)}(document.documentElement);
