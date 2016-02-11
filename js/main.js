(function (wpm, $) {
	// trigger an event telling all of the backends to render themselves a button
	$(document).triggerHandler("initBackend.wpm", function (name, label) {
		$("#accountPanel form").append("<button class=\"btn btn-default\" data-backend=\"" + name + "\">" + label + "</button> ");
	});

	var displayError = function (message) {
		// close any existing alerts
		$("#accountPanel div.alert").fadeOut(300);

		var alertEl = $("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" style=\"margin-bottom: 0; margin-top: 15px;\">" +
			message +
			"</div>");
		alertEl.insertAfter("#accountPanel form")
	}

	// handle a backend being chosen
	$("#accountPanel").delegate("button", "click", function () {
		try {
			var backend = $(this).data("backend");
			$(document).triggerHandler("activateBackend.wpm", { "backend": backend, "password": $("#accountPanel input").val() });
		} catch (e) {
			if ("WPM_DECRYPT_FAILED" === e) {
				displayError("Failed to decrypt saved database; check your password and try again");
			} else {
				displayError("An unknown error occured while decrypting the saved database");
			}
			return;
		}

		// fill out password table with loaded records (if any) and show it
		$.each(wpm.db.getRecords(), function (id, record) {
			wpm.passwordTable.displayRecord(record);
		});
		$("#accountPanel").hide();
		$("#passwordPanel").show();
	});
})(wpm, jQuery);
