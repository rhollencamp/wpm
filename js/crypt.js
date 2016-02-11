wpm.crypt = (function (wpm, $, forge) {
	"use strict";

	var key;

	return {
		generateSalt: function () {
			return forge.util.createBuffer(forge.random.getBytesSync(128), "raw").toHex();
		},
		passwordToKey: function (pw, salt) {
			var iterations = 100; // TODO
			var keySize = 32; // AES-256
			key = forge.pkcs5.pbkdf2(pw, forge.util.hexToBytes(salt), iterations, keySize);
		},
		encrypt: function (record) {
			var cipher = forge.cipher.createCipher('AES-GCM', key);
			cipher.start({
				iv: forge.util.hexToBytes(record["id"])
			});
			cipher.update(forge.util.createBuffer(JSON.stringify(record), "utf8"));
			cipher.finish();

			return {
				iv: record["id"],
				tag: cipher.mode.tag.toHex(),
				data: cipher.output.toHex()
			};
		},
		decrypt: function (encRecord) {
			var decipher = forge.cipher.createDecipher('AES-GCM', key);
			decipher.start({
				iv: forge.util.hexToBytes(encRecord["iv"]),
				tag: forge.util.hexToBytes(encRecord["tag"])
			});
			decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encRecord["data"]), "raw"));
			var pass = decipher.finish();
			if (pass) {
				var json = decipher.output.toString();
				return JSON.parse(json);
			} else {
				throw "WPM_DECRYPT_FAILED";
			}
		}
	};
})(wpm, jQuery, forge);
