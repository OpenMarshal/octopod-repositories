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
var request = require("request");
var url = require("url");
var GetterService = (function (_super) {
    __extends(GetterService, _super);
    function GetterService(envUrl) {
        var _this = _super.call(this, 'getter', envUrl, false) || this;
        _this.hostnames = {};
        return _this;
    }
    GetterService.prototype.hostnameRuntime = function (host) {
        var _this = this;
        var actions = this.hostnames[host];
        //this.log(host + ' / ' + actions.length);
        if (actions.length === 0) {
            setTimeout(function () { return _this.hostnameRuntime(host); }, 1000);
            return;
        }
        var action = actions.shift();
        action(function (e) {
            if (e) {
                _this.error('Host action execution : Error', e);
                actions.push(action);
            }
            setTimeout(function () { return _this.hostnameRuntime(host); }, 10000);
        });
    };
    GetterService.prototype.start = function (callback) {
        var _this = this;
        this.reference({
            inputs: {
                'request': {
                    isVolatile: true,
                    mainOutputMethod: 'result',
                    outputs: {
                        'result': 1,
                        'webfile': 1
                    }
                },
                'direct': {
                    isVolatile: true,
                    mainOutputMethod: 'result',
                    outputs: {
                        'result': 1
                    }
                }
            }
        }, function (e) {
            _this.commands['pending'] = function (input, cb) {
                var host = url.parse(input.url).host;
                cb({
                    nb: _this.hostnames[host] ? _this.hostnames[host].length : 0
                });
            };
            _this.commands['stop'] = function (input, cb) {
                cb();
                process.exit();
            };
            _this.bindMethod('request', function (data, info) {
                var host = url.parse(data.url).host;
                if (!_this.hostnames[host]) {
                    _this.hostnames[host] = [];
                    process.nextTick(function () { return _this.hostnameRuntime(host); });
                }
                _this.hostnames[host].push(function (cb) {
                    _this.log('Downloading', data.url);
                    var filePath = info.outputs['webfile'][0];
                    var rStream = request(data.url);
                    var wStream = _this.put(filePath);
                    rStream.on('error', function (e) { return cb(e); });
                    rStream.on('end', function () {
                        _this.log('Downloaded with success', data.url);
                        _this.putObject(info.mainOutput, {
                            filePath: filePath
                        }, function (e) {
                            _this.log('Writing result', data.url);
                            cb(e);
                            _this.dispose(info);
                        });
                    });
                    rStream.pipe(wStream);
                });
            });
            _this.bindMethod('direct', function (data, info) {
                var host = url.parse(data.url).host;
                if (!_this.hostnames[host]) {
                    _this.hostnames[host] = [];
                    process.nextTick(function () { return _this.hostnameRuntime(host); });
                }
                _this.hostnames[host].push(function (cb) {
                    _this.log('Downloading', data.url);
                    var filePath = info.mainOutput;
                    request(data.url, function (e, res, body) {
                        _this.log('Downloaded with success', data.url);
                        _this.putObject(info.mainOutput, {
                            body: body ? body.toString() : null
                        }, function (e) {
                            _this.log('Writing result', data.url);
                            cb(e);
                            _this.dispose(info);
                        });
                    });
                });
            });
            if (callback)
                callback();
        });
    };
    return GetterService;
}(octopod_1.Service));
exports.GetterService = GetterService;
