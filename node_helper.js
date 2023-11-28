/* Magic Mirror
 * Node Helper: MMM-Diablo4WorldBosses
 *
 * By 
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var XMLHttpRequest = require('xhr2');

module.exports = NodeHelper.create({
	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'MMM-Diablo4WorldBosses-SET_CONFIG') {
			this.url = payload.url;
		}
		if (notification === 'PRINT') {
			console.log(payload)
		}
		if (notification === 'MMM-Diablo4WorldBosses-GET_DATA') {
				var dataRequest = new XMLHttpRequest();
				dataRequest.open("GET", this.url, true);
				dataRequest.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status === 200) {
							self.sendSocketNotification("MMM-Diablo4WorldBosses-GOT_DATA", this.response);
						}
					}
				};
				dataRequest.send();
		}
	},
});
