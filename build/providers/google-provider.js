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
var GoogleLoginProvider = /** @class */ (function (_super) {
    __extends(GoogleLoginProvider, _super);
    function GoogleLoginProvider(apiKey, clientId, opt) {
        if (opt === void 0) { opt = { scope: 'https://www.googleapis.com/auth/userinfo.profile' }; }
        var _this_1 = _super.call(this) || this;
        _this_1.apiKey = apiKey;
        _this_1.clientId = clientId;
        _this_1.opt = opt;
        return _this_1;
    }
    GoogleLoginProvider.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://apis.google.com/js/api.js', function () {
                gapi.load('client:auth2', function () {
                    gapi.client.init({
                        'apiKey': _this.apiKey,
                        'clientId': _this.clientId,
                        'discoveryDocs': [],
                        'scope': _this.opt.scope
                    }).then(function () {
                        _this.GoogleAuth = gapi.auth2.getAuthInstance();
                        _this.onInitFinished();
                        resolve(_this);
                    }).catch(function (err) {
                        reject(err);
                    });
                    ;
                });
            });
        });
    };
    GoogleLoginProvider.prototype.getLoginStatus = function () {
        if (this.isReady) {
            return this.checkGoogleLoginStatus();
        }
        else {
            return new Promise(function (resolve, reject) {
                reject('No user is currently logged in.');
            });
        }
    };
    GoogleLoginProvider.prototype.checkGoogleLoginStatus = function () {
        var _this_1 = this;
        return new Promise(function (resolve, reject) {
            var user = _this_1.GoogleAuth.currentUser.get();
            var isAuthorized = user.hasGrantedScopes(_this_1.opt.scope);
            if (isAuthorized) {
                var _user = new user_1.User(GoogleLoginProvider.PROVIDER_ID);
                var profile = user.getBasicProfile();
                var token = user.getAuthResponse(true).access_token;
                var backendToken = user.getAuthResponse(true).id_token;
                _user.id = profile.getId();
                _user.name = profile.getName();
                _user.email = profile.getEmail();
                _user.photoUrl = profile.getImageUrl();
                _user.firstName = profile.getGivenName();
                _user.lastName = profile.getFamilyName();
                _user.authToken = token;
                _user.idToken = backendToken;
                resolve(_user);
            }
            else {
                reject('No user is currently logged in.');
            }
        });
    };
    GoogleLoginProvider.prototype.signIn = function (opt) {
        var _this_1 = this;
        if (this.isReady) {
            return this.googleLogin(opt);
        }
        return new Promise(function (resolve, reject) {
            _this_1.event.on(base_auth_provider_1.PROVIDERINITEVENT, function () {
                _this_1.googleLogin(opt).then(function (user) {
                    resolve(user);
                }, function (err) {
                    reject(err);
                });
            });
        });
    };
    GoogleLoginProvider.prototype.googleLogin = function (option) {
        var _this = this;
        var opt = option ? option : this.opt;
        return new Promise(function (resolve, reject) {
            var offlineAccess = (opt && opt.offline_access);
            var promise = !offlineAccess ? _this.GoogleAuth.signIn(opt) : _this.GoogleAuth.grantOfflineAccess(opt);
            promise.then(function (response) {
                var user = new user_1.User(GoogleLoginProvider.PROVIDER_ID);
                var profile = _this.GoogleAuth.currentUser.get().getBasicProfile();
                var token = _this.GoogleAuth.currentUser.get().getAuthResponse(true).access_token;
                var backendToken = _this.GoogleAuth.currentUser.get().getAuthResponse(true).id_token;
                user.id = profile.getId();
                user.name = profile.getName();
                user.email = profile.getEmail();
                user.photoUrl = profile.getImageUrl();
                user.firstName = profile.getGivenName();
                user.lastName = profile.getFamilyName();
                user.authToken = token;
                user.idToken = backendToken;
                if (response && response.code) {
                    user.authorizationCode = response.code;
                }
                resolve(user);
            }, function (closed) {
                reject('User cancelled login or did not fully authorize.');
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    GoogleLoginProvider.prototype.signOut = function () {
        if (this.isReady) {
            return this.googleLogout();
        }
        else {
            return new Promise(function (resolve, reject) {
                reject('No user is currently logged in.');
            });
        }
    };
    GoogleLoginProvider.prototype.googleLogout = function () {
        var _this_1 = this;
        return new Promise(function (resolve, reject) {
            _this_1.GoogleAuth.signOut().then(function () {
                resolve();
            }, function (err) {
                reject(err);
            });
        });
    };
    GoogleLoginProvider.PROVIDER_ID = "Google";
    return GoogleLoginProvider;
}(base_auth_provider_1.BaseAuthProvider));
exports.GoogleLoginProvider = GoogleLoginProvider;
