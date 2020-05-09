"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
exports.AUTHCONFIGINITEVENT = "onAuthConfigInit";
var AuthConfig = /** @class */ (function () {
    function AuthConfig(providers) {
        this.isInitialized = false;
        this.event = new events_1.EventEmitter();
        this.lazyLoad = false;
        this.providers = new Map();
        this.initialize(providers);
    }
    AuthConfig.prototype.initialize = function (providers) {
        for (var i = 0; i < providers.length; i++) {
            var element = providers[i];
            this.providers.set(element.id, element.provider);
            this.lazyLoad = this.lazyLoad || element.lazyLoad;
        }
        this.isInitialized = true;
        this.event.emit(exports.AUTHCONFIGINITEVENT, this.providers);
    };
    return AuthConfig;
}());
exports.AuthConfig = AuthConfig;
