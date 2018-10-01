var usb = require('usb');
var Luxafor;
const LUX_PID = 0xf372;
const LUX_VID = 0x04d8;

Luxafor = function () {
	this.pid = LUX_PID;
	this.vid = LUX_VID;
	this.endpoint = undefined;
}

Luxafor.prototype.init = function (cb) {
	var device = undefined,
	interface = undefined;

	device = usb.findByIds(this.vid, this.pid);
	device.open();

	interface = device.interface(0);

	if (interface.isKernelDriverActive()) {
		interface.detachKernelDriver();
	}

	interface.claim();

	this.endpoint = interface.endpoint(1);

	//Dummy data
	var buff = new Buffer([0, 0]);
	this.endpoint.transfer(buff, function () {
		if (cb) {
			cb();
		}
	});
};

/*
Luxafor.prototype.setLuxaforColor = function (color, cb) {
	var buff =  new Buffer(2);

	//Padding
	buff.writeUInt8(0, 0);

	buff.writeUInt8(color, 1);

	this.endpoint.transfer(buff, function () {
		if (cb) {
			cb();
		}
	});
};
*/

Luxafor.prototype.flashColor = function (r, g, b, cb) {
	var buff = new Buffer(8);

	//Strobe
	buff.writeUInt8(3, 0);
	//"Both Sides"
	buff.writeUInt8(255, 1);

	buff.writeUInt8(r, 2);
	buff.writeUInt8(g, 3);
	buff.writeUInt8(b, 4);

	//"t" 10. Time?
	buff.writeUInt8(10, 5);

	//"d" ?
	buff.writeUInt8(0, 6);

	//"Re" 3. Repeat?
	buff.writeUInt8(3, 7);

	this.endpoint.transfer(buff, function () {
		if (cb) {
			cb();
		}
	});
};

Luxafor.prototype.setColor = function  (r, g, b, cb) {
	var buff = new Buffer(5);

	//Jump
	buff.writeUInt8(1, 0);
	//"Both Sides"
	buff.writeUInt8(255, 1);

	buff.writeUInt8(r, 2);
	buff.writeUInt8(g, 3);
	buff.writeUInt8(b, 4);

	this.endpoint.transfer(buff, function () {
		if (cb) {
			cb();
		}
	});
};

module.exports = function () {
	return new Luxafor();
}
