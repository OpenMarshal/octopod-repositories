"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var octopod_1 = require("octopod");
var directTransport = require("nodemailer-direct-transport");
var nodemailer = require("nodemailer");
var NotifierService = (function (_super) {
    __extends(NotifierService, _super);
    function NotifierService(coreUrl, options) {
        var _this = _super.call(this, 'notifier', coreUrl) || this;
        _this.defaultOperations = [];
        if (!options)
            options = {
                destinations: []
            };
        if (options.destinations)
            _this.defaultOperations = options.destinations;
        return _this;
    }
    NotifierService.prototype.execDestination = function (type, data, callback) {
        var _this = this;
        switch (type.type) {
            case 'email':
                {
                    var transporter = nodemailer.createTransport(directTransport(undefined));
                    var mailData_1 = JSON.parse(JSON.stringify(type.settings));
                    mailData_1.subject = data.title;
                    mailData_1.html = data.body;
                    transporter.sendMail(mailData_1, function (e, info) {
                        if (e) {
                            _this.error('transporter.sendMail(...) : Error', e);
                            setTimeout(function () { return _this.execDestination(type, data, callback); }, type.retryTimeout ? type.retryTimeout : 1000 * 60 * 10); // retry in 10 minutes
                        }
                        else {
                            _this.log('Notified by email', mailData_1);
                            callback();
                        }
                    });
                    break;
                }
        }
    };
    NotifierService.prototype.start = function () {
        var _this = this;
        this.reference({
            inputs: {
                'notify': {
                    mainOutputMethod: 'notify-done',
                    outputs: {
                        'notify-done': 1
                    }
                }
            }
        }, function (e) {
            if (e)
                throw e;
            _this.bindMethod('notify', function (data, info) {
                var operations = data.operations ? data.operations : _this.defaultOperations;
                var nb = operations.length;
                operations.forEach(function (dest) { return _this.execDestination(dest, data, function () {
                    if (--nb === 0)
                        _this.dispose(info);
                }); });
            });
        });
    };
    return NotifierService;
}(octopod_1.Service));
exports.NotifierService = NotifierService;
