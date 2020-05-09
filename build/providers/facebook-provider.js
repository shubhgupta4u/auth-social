"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_auth_provider_1 = require("./base-auth-provider");
var user_1 = require("../types/user");
var FacebookLoginProvider = /** @class */ (function (_super) {
    __extends(FacebookLoginProvider, _super);
    function FacebookLoginProvider(appid, opt, locale, fields, version) {
        if (opt === void 0) { opt = { scope: 'email,public_profile' }; }
        if (locale === void 0) { locale = 'en_US'; }
        if (fields === void 0) { fields = 'name,email,picture,first_name,last_name'; }
        if (version === void 0) { version = 'v7.0'; }
        var _this = _super.call(this) || this;
        _this.appId = appid;
        _this.opt = opt;
        _this.locale = locale;
        _this.fields = fields;
        _this.version = version;
        return _this;
    }
    FacebookLoginProvider.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadScript(FacebookLoginProvider.PROVIDER_ID, "https://connect.facebook.net/" + _this.locale + "/sdk.js", function () {
                FB.init({
                    appId: _this.appId,
                    autoLogAppEvents: true,
                    cookie: true,
                    xfbml: true,
                    version: _this.version
                });
                // FB.AppEvents.logPageView(); #FIX for #18
                _this.onInitFinished();
                resolve(_this);
            });
        });
    };
    FacebookLoginProvider.prototype.getLoginStatus = function () {
        if (this.isReady) {
            return this.checkFBLoginStatus();
        }
        else {
            return new Promise(function (resolve, reject) {
                reject('No user is currently logged in.');
            });
        }
    };
    FacebookLoginProvider.prototype.checkFBLoginStatus = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var user = new user_1.User(FacebookLoginProvider.PROVIDER_ID);
            FB.getLoginStatus(function (response) {
                console.log(response);
                if (response.status === 'connected') {
                    var authResponse_1 = response.authResponse;
                    FB.api("/me?fields=" + _this.fields, function (fbUser) {
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.authToken = authResponse_1.accessToken;
                        user.facebook = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject('No user is currently logged in.');
                }
            });
        });
    };
    FacebookLoginProvider.prototype.signIn = function (opt) {
        var _this = this;
        if (this.isReady) {
            return this.fbLogin(opt);
        }
        return new Promise(function (resolve, reject) {
            _this.event.on(base_auth_provider_1.PROVIDERINITEVENT, function () {
                _this.fbLogin(opt).then(function (user) {
                    resolve(user);
                }, function (err) {
                    reject(err);
                });
            });
        });
    };
    FacebookLoginProvider.prototype.fbLogin = function (option) {
        var _this = this;
        var opt = option ? option : this.opt;
        var user = new user_1.User(FacebookLoginProvider.PROVIDER_ID);
        return new Promise(function (resolve, reject) {
            FB.login(function (response) {
                console.log(response);
                if (response.authResponse) {
                    var authResponse_2 = response.authResponse;
                    FB.api("/me?fields=" + _this.fields, function (fbUser) {
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.authToken = authResponse_2.accessToken;
                        user.facebook = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject('User cancelled login or did not fully authorize.');
                }
            }, opt);
        });
    };
    FacebookLoginProvider.prototype.signOut = function () {
        if (this.isReady) {
            return this.fbLogout();
        }
        else {
            return new Promise(function (resolve, reject) {
                reject('No user is currently logged in.');
            });
        }
    };
    FacebookLoginProvider.prototype.fbLogout = function () {
        return new Promise(function (resolve, reject) {
            FB.logout(function (response) {
                console.log(response);
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    FacebookLoginProvider.PROVIDER_ID = "FACEBOOK";
    return FacebookLoginProvider;
}(base_auth_provider_1.BaseAuthProvider));
exports.FacebookLoginProvider = FacebookLoginProvider;
