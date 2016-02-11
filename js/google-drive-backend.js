(function ($) {
	"use strict";

	$(document).on("initBackend.wpm", function (event, register) {
		register("google", "Google Drive");
	});

})(jQuery);
