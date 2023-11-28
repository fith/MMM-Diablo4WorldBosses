/* global Module */

/* Magic Mirror
 * Module: MMM-Diablo4WorldBosses
 *
 * By 
 * MIT Licensed.
 */

Module.register("MMM-Diablo4WorldBosses", {
	defaults: {
		updateInterval: 360000,
		url: 'https://diablo4.life/api/trackers/list',
		shortNames: false,
		showLocation: true
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		this.payload = null;
		this.bossDisplayName = '';
		this.bossDisplayTime = '';
		this.bossDisplayLocation = '';
		
		this.sendSocketNotification('MMM-Diablo4WorldBosses-SET_CONFIG', this.config);
		this.getData();

		setInterval(function() {
			this.getData();
		}, this.config.updateInterval);
	},

	getDom: function() {
		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		wrapper.classList.add("MMM-Diablo4WorldBosses");
		
		var name = document.createElement("span");
		name.classList.add("name");
		name.innerHTML = this.bossDisplayName;
		if (this.config.glow) {
			name.classList.add("glow");
		}
		wrapper.appendChild(name);

		var timer = document.createElement("span");
		timer.classList.add("timer");
		timer.innerHTML = this.bossDisplayTime;
		wrapper.appendChild(timer);

		if (this.config.showLocation) {
			var location = document.createElement("span");
			location.classList.add("location");
			location.innerHTML = this.bossDisplayLocation;
			wrapper.appendChild(location);
		}

		return wrapper;
	},

	getData: function() {
		this.sendSocketNotification('MMM-Diablo4WorldBosses-GET_DATA', this.config);
	},

	padNumber: function(num, size) {
		num = num.toString();
		while (num.length < size) num = "0" + num;
		return num;
	},

	getUnixTime: function() {
		return Math.floor(new Date().getTime());
	},

	getBossTitle: function(dataName, shortName) {
		var name = '';
		if (dataName.toLowerCase().includes('ashava')) {
			name = "ASHAVA_";
		}
		if (dataName.toLowerCase().includes('avarice')) {
			name = "AVARICE_";
		}
		if (dataName.toLowerCase().includes('death')) {
			name = "WANDERINGDEATH_";
		}
		return name + (shortName ? 'SHORT' : 'LONG');
	},

	startTimer: function() {
		this.stopTimer()
		this.updateTimer();
		var self = this
		this.timer = setInterval(function() {
			self.updateTimer();
		}, 1000);
		
	},

	stopTimer: function() {
		if (this.timer != null) {
			clearInterval(this.timer)
			this.timer = null;
		}
	},

	updateTimer: function() {
		var unixTime = this.getUnixTime();
		var length = Math.floor((this.payload.worldBoss.time - unixTime) / 1000);
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		if (length > 0) {
			minutes = Math.floor(length / 60.0);
			if (minutes > 60) {
				hours = Math.floor(minutes / 60);
				minutes = minutes % 60;
			}
			seconds = length % 60;
		} else {
			this.stopTimer();
			return;
		}
		this.bossDisplayTime = '';
		if (hours > 0) {
			this.bossDisplayTime = hours + ":" + this.padNumber(minutes, 2) + ":" + this.padNumber(seconds, 2);
		} else if (minutes > 0 ) {
			this.bossDisplayTime = minutes + ":" + this.padNumber(seconds, 2);
		} else {
			this.bossDisplayTime = seconds;
		}
		this.updateDom();
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-Diablo4WorldBosses.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json"
		};
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-Diablo4WorldBosses-GOT_DATA") {
			// set dataNotification
			this.payload = null;
			this.bossDisplayName = '';
			this.bossDisplayTime = '';
			this.bossDisplayLocation = '';
			this.payload = JSON.parse(payload);
			if (this.payload.hasOwnProperty("worldBoss")) {
				this.bossDisplayName = this.translate(this.getBossTitle(this.payload.worldBoss.name, this.config.shortNames));
				if (this.payload.worldBoss.hasOwnProperty("location")) {
					this.bossDisplayLocation = this.payload.worldBoss.location;
				}
				this.startTimer();
			}
		}
	},
});
