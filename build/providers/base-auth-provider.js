"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
exports.PROVIDERINITEVENT = "onProviderInit";
var BaseAuthProvider = /** @class */ (function () {
    function BaseAuthProvider() {
        this.isReady = false;
        this.event = new events_1.EventEmitter();
    }
    BaseAuthProvider.prototype.onInitFinished = function () {
        this.isReady = true;
        this.event.emit(exports.PROVIDERINITEVENT);
    };
    BaseAuthProvider.prototype.loadScript = function (id, src, onload, async, inner_text_content) {
        if (async === void 0) {
            async = true;
        }
        if (inner_text_content === void 0) {
            inner_text_content = '';
        }
        // get document if platform is only browser
        if (typeof document !== 'undefined' && !document.getElementById(id)) {
            var signInJS = document.createElement('script');
            signInJS.async = async;
            signInJS.src = src;
            signInJS.onload = onload;
            /*
            if (inner_text_content) // LinkedIn
                signInJS.text = inner_text_content;
            */
            document.head.appendChild(signInJS);
        }
    };
    return BaseAuthProvider;
}());
exports.BaseAuthProvider = BaseAuthProvider;
