(function (wpm, $) {
	"use strict";

	$(document).on("initBackend.wpm", function(event, register) {
		register("local", "Local Storage");
	});

	var initializeDb = function (password) {
		var dbJson = localStorage["wpm"];
		if (typeof dbJson === "undefined") {
			wpm.db.initializeBlankDb(password);
		} else {
			wpm.db.initializeFromJson(dbJson, password);
		}
	};

	var saveDb = function(event, db, record) {
		localStorage["wpm"] = JSON.stringify(db);
	};

	// listen for backend activation
	$(document).on("activateBackend.wpm", function(event, data) {
		if (data["backend"] === "local") {
			initializeDb(data["password"]);

			$(document).on("saveDb.wpm", saveDb);
		}
	})
})(wpm, jQuery);
