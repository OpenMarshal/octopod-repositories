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
        if (!options)
            options = {
                operations: []
            };
        _this.operations = options.operations ? options.operations : [];
        _this.types = options.types ? options.types : {};
        if (_this.types['email'] === undefined) {
            _this.types['email'] = function (type, data, callback) {
                var _this = this;
                var transporter = nodemailer.createTransport(directTransport(undefined));
                var mailData = JSON.parse(JSON.stringify(type.settings));
                mailData.subject = data.title;
                mailData.html = data.body;
                transporter.sendMail(mailData, function (e, info) {
                    if (e) {
                        _this.error('transporter.sendMail(...) : Error', e);
                        setTimeout(function () { return _this.execDestination(type, data, callback); }, type.retryTimeout ? type.retryTimeout : 1000 * 60 * 10); // retry in 10 minutes
                    }
                    else {
                        _this.log('Notified by email', mailData);
                        callback();
                    }
                });
            };
        }
        return _this;
    }
    NotifierService.prototype.execDestination = function (type, data, callback) {
        var exec = this.types[type.type];
        if (!exec) {
            this.error('Type not defined', JSON.stringify(type));
            return callback();
        }
        exec.bind(this)(type, data, callback);
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
                var operations = data.operations ? data.operations : _this.operations;
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
