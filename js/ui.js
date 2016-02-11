/**
 * Password Table
 */
wpm.passwordTable = (function (wpm, $) {
	"use strict";

	var passwordTable = $("#passwordTable");

	/* delete a password button clicked */
	passwordTable.delegate("button:nth-child(3)", "click", function () {
		var recordId = $(this).closest("tr").data("recordId");
		wpm.db.deleteRecord(recordId);

		// remove it from the password table
		passwordTable.find("tr")
			.filter(function () {
				return $(this).data("recordId") === recordId;
			})
			.remove();
	});

	/* copy a password button clicked */
	passwordTable.delegate("button:nth-child(1)", "click", function () {
		alert("TODO");
	})

	return {
		displayRecord: function (record) {
			var data = [record.title, record.url, record.userName];

			// does the row already exist? kinda painful...
			var rows = passwordTable
				.find("tr")
				.filter(function () {
					return $(this).data("recordId") === record.id;
				});
			if (rows.length > 0) {
				// update existing row
				rows
					.find("td")
					.each(function (i) {
						if (data.length > i) {
							$(this).text(data[i]);
						}
					});
			} else {
				// add a new row
				$($("#passwordRow").html())
				// add text to cells
					.find("td").each(function (i) {
						if (data.length > i) {
							$(this).text(data[i]);
						}
					}).end()
				// add record id to row
					.each(function () {
						$(this).data("recordId", record["id"]);
					})
				// add row to table
					.appendTo(passwordTable);
			}
		}
	}
})(wpm, jQuery);


/**
 * Edit Password Modal
 */
wpm.editPassword = (function (wpm, $, forge) {
	var createNewRecord = function () {
		return {
			title: "",
			url: "",
			userName: "",
			password: "",
			id: forge.util.bytesToHex(forge.random.getBytesSync(12))
		};
	}

	var populateFormFromRecord = function (record) {
		$("#editTitle").val(record.title);
		$("#editUrl").val(record.url);
		$("#editUserName").val(record.userName);
		$("#editPassword").val(record.password);
	}

	var populateRecordFromForm = function (record) {
		record["title"] = $("#editTitle").val();
		record["url"] = $("#editUrl").val();
		record["userName"] = $("#editUserName").val();
		record["password"] = $("#editPassword").val();
	}

	/* when modal is shown, set state of form controls */
	$("#editModal").on("show.bs.modal", function (event) {
		var record, button = $(event.relatedTarget);
		if (button.attr("id") === "addPassword") {
			record = createNewRecord();
		} else {
			var recordId = button.closest("tr").data("recordId");
			record = wpm.db.getRecord(recordId);
		}

		$("#editModal").data("record", record);

		populateFormFromRecord(record);
	});

	/* save button clicked */
	$("#editModal button:nth-child(2)").on("click", function () {
		$("#editModal").modal("hide");

		var record = $("#editModal").data("record");
		populateRecordFromForm(record);

		wpm.db.updateRecord(record);

		wpm.passwordTable.displayRecord(record);
	});
})(wpm, jQuery, forge);
