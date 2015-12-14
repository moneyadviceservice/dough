## Social Sharing Icons

### Definition
This module exists to allow the display of minimally-styled SVG Social Sharing icons at all points throught a site.

Currently it includes Facebook, Twitter and Email icons within the functionality to share the specified page via those means. The module could be extended to include other icons as necessary.

There are a number of values which can be passed through as described in the rules below.

Doesn't include non-SVG fallbacks, which need to be added as CSS background-image in the icon--facebook, icon--twitter, icon--email element.

### Rules
* title: appears above the icons as a section heading
* text: this is used for the message to be shared on Twitter and the subject line in emails
* url: this is the URL that will be shared which may be the current location but may not be
* label_facebook: this is accessibility text specific to Facebook and is not visible on the page
* label_twitter: this is accessibility text specific to Twitter and is not visible on the page
* label_email: this is accessibility text specific to Email and is not visible on the page

### Examples

* [Code example](https://github.com/moneyadviceservice/frontend/blob/master/app/views/articles/show.html.erb)
* [Live example](https://www.moneyadviceservice.org.uk/en/articles/do-you-need-to-borrow-money)
