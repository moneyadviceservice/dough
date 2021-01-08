/**
 * The purpose of this component is to determine if the user's browser/device will be blocked by attempted access to third party cookies. On intialisation it: 
 * - tests the user's device/browser to check if the Storage Access API is known
 *   - if not known the content is rendered as normal
 *   - if known tests if the user's device/browser has access to cookies/storage
 *     - if the user's device/browser does have access to cookies/storage the content is rendered as normal
 *     - if the user's device/browser does not have access to cookies/storage a link is rendered instead of the content
 */
define(['StorageAccess'], function(StorageAccess) {
  function StorageAccess() {
		this.el = document.body; 
		this.init(); 
  };

  StorageAccess.prototype.init = function() {
    this.hideContent(); 
    this.queryDevice(); 
  };

  StorageAccess.prototype.queryDevice = function() {
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

  StorageAccess.prototype.hasAccess = function() {
		console.log('Determining if device has access to Storage/Cookies ...'); 

		document.hasStorageAccess().then(
			hasAccess => {
				if (hasAccess) {
					console.log('We DO have access to Storage/Cookies!');

					this.showContent(); 
				} else {
					console.log('We DO NOT have access to Storage/Cookies!'); 

					this.renderLink(); 
				}
			}
		).catch(e => {
			console.log('Could not determine if we have access!'); 
			console.log(e); 
		})
  }; 

  StorageAccess.prototype.hideContent = function() {
	  this.el.style.display = 'none'; 
  }; 

  StorageAccess.prototype.showContent = function() {
		this.el.style.display = 'block'; 
  }; 

  StorageAccess.prototype.renderLink = function() {
		var href = window.frames.location.href; 
		var message = document.createElement('div'); 
		var header; 
		var headerStyles = {
			'margin-top': 0
		}

		message.innerHTML = 
			`<h1>Oops!</h1>
			<p>Sorry, it looks like your browser has blocked our tool. This is most likely due to improved security in relation to the use of cookies.</p>
			<p>You can still load the tool on this browser by visiting the <a href="${href}" target="_blank" class="storageAccessReferLink">Money Advice Service tool page</a> (opens in a new window) or by visiting this page in a different browser.</p>`; 

		header = message.getElementsByTagName('h1')[0]; 

		this.el.innerHTML = ''; 
		this.el.appendChild(message); 
		this.el.style.display = 'block'; 

		for (let style in headerStyles) {
			header.style[style] = headerStyles[style];
		}
  }; 

  StorageAccess.prototype.isStorageAccessKnown = function() {
		if (document.hasStorageAccess === undefined) {
			return false; 
		} else {
			return true; 
		}; 
  }; 

  return StorageAccess;
});
