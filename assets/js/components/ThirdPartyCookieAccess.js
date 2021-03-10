/**
 * The purpose of this component is to determine if the user's browser/device will be blocked by attempted access to third party cookies. On intialisation it: 
 * - tests the user's device/browser to check if the Storage Access API is known
 *   - if not known the content is rendered as normal
 *   - if known tests if the user's device/browser has access to cookies/storage
 *     - if the user's device/browser does have access to cookies/storage the content is rendered as normal
 *     - if the user's device/browser does not have access to cookies/storage a link is rendered instead of the content
 */
define(['ThirdPartyCookieAccess'], function(ThirdPartyCookieAccess) {
	function ThirdPartyCookieAccess() {
		this.el = document.body; 
		this.init(); 
	};

	ThirdPartyCookieAccess.prototype.init = function() {
		this.hideContent(); 
		this.queryDevice(); 
	};

	ThirdPartyCookieAccess.prototype.queryDevice = function() {
		var isStorageAccessKnown = this.isStorageAccessKnown(); 

		console.log('Determining if the `hasStorageAccess` method of the Storage Access API is known to this browser ...'); 

		if (isStorageAccessKnown === false) {
			console.log('`hasStorageAccess` IS NOT known to this browser!'); 

			this.showContent();
		} else {
			console.log('`hasStorageAccess` IS known to this browser!'); 

			this.hasAccess(); 
		}; 
	}; 

	ThirdPartyCookieAccess.prototype.hasAccess = function() {
		var _this = this;

		console.log('Determining if device has access to Storage/Cookies ...'); 

		document.hasStorageAccess().then(
			function(hasAccess) {
				if (hasAccess) {
					console.log('We DO have access to Storage/Cookies!');

					_this.showContent();
				} else {
					console.log('We DO NOT have access to Storage/Cookies!'); 

					_this.renderLink();
				}
			}
		)
	}; 

	ThirdPartyCookieAccess.prototype.hideContent = function() {
		this.el.style.display = 'none';
	}; 

	ThirdPartyCookieAccess.prototype.showContent = function() {
		this.el.style.display = 'block';
	}; 

	ThirdPartyCookieAccess.prototype.renderLink = function() {
		var frame = window.frames,
				href = frame.location.href, 
				locale = frame.I18n.locale, 
				message = document.createElement('div'), 
				header, 
				headerStyles = {
					'margin-top': 0,
					'background-image': 'url(/assets/dough/assets/images/exclamation_mark.svg)',
					'background-repeat': 'no-repeat',
					'background-position': 'left center',
					'background-size': '2.25rem',
					'padding-left': '2.5rem'
				},
				messageHTML = {
					en: '<h1>Oops!</h1>' +
					'<p>Sorry, it looks like your browser has blocked our tool. This is most likely due to improved security in relation to the use of cookies.</p>' + 
					'<p>You can still load the tool on this browser by visiting the <a href="' + href + '" target="_blank" class="ThirdPartyCookieAccessReferLink">Money Advice Service tool page</a> (opens in a new window) or by visiting this page in a different browser.</p>',
					cy: '<h1>Wps!</h1>' + 
					'<p>Mae\'n ddrwg gennym, mae\'n edrych fel bod eich porwr wedi rhwystro ein teclyn. Mae hyn yn fwyaf tebygol oherwydd gwell diogelwch gan Apple mewn perthynas â defnyddio cwcis.</p>' + 
					'<p>Gallwch ddal llwytho\'r teclyn ar y porwr hwn trwy ymweld â <a href="' + href + '" target="_blank" class="ThirdPartyCookieAccessReferLink">thudalen teclynnau’r Gwasanaeth Cynghori Ariannol</a> (a fydd yn agor mewn ffenest newydd) neu trwy ymweld â\'r dudalen hon mewn porwr gwahanol.</p>'
				};

		message.innerHTML = messageHTML[locale];

		header = message.getElementsByTagName('h1')[0]; 

		this.el.innerHTML = ''; 
		this.el.appendChild(message); 
		this.el.style.display = 'block'; 

		for (var style in headerStyles) {
			header.style[style] = headerStyles[style];
		}
	}; 

	ThirdPartyCookieAccess.prototype.isStorageAccessKnown = function() {
		if (document.hasStorageAccess === undefined) {
			return false; 
		} else {
			return true; 
		}; 
	}; 

	return ThirdPartyCookieAccess;
});
