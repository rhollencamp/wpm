wpm.db = (function (wpm, $) {
	"use strict";

	var records, encryptedRecords;
	var salt;

	return {
		getEncryptedDb: function () {
			return {
				"salt": salt,
				"records": encryptedRecords
			};
		},
		getRecords: function () {
			return records;
		},
		getRecord: function (recordId) {
			return records[recordId];
		},
		initializeFromJson: function (json, password) {
			var db = JSON.parse(json);

			encryptedRecords = db["records"];
			salt = db["salt"];

			// decrypt records
			wpm.crypt.passwordToKey(password, salt);
			records = {};
			$.each(encryptedRecords, function(recordId, encRec) {
				records[recordId] = wpm.crypt.decrypt(encRec);
			});
		},
		initializeBlankDb: function (password) {
			records = {};
			encryptedRecords = {};
			salt = wpm.crypt.generateSalt();
			wpm.crypt.passwordToKey(password, salt);
		},
		updateRecord: function (record) {
			var recordId = record["id"];
			records[recordId] = record;
			encryptedRecords[recordId] = wpm.crypt.encrypt(record);

			// inform backend to persist the updated record
			$(document).triggerHandler("saveDb.wpm", this.getEncryptedDb());
		},
		deleteRecord: function (record) {
			if (typeof (record) === "string" && typeof (records[record]) === "object") {
				delete records[record];
				delete encryptedRecords[record];
			} else {
				throw "WPM_DELETE_INVALID_RECORD";
			}

			//$(document).triggerHandler("saveDb.wpm", db);
		}
	}
})(wpm, jQuery);
