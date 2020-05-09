"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_config_1 = require("../config/auth-config");
var events_1 = require("events");
exports.AUTHSTATECHANGEDEVENT = "authStateChanged";
exports.PROVIDERSTATECHANGEDEVENT = "providerStateChanged";
exports.ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
exports.ERR_NOT_LOGGED_IN = 'Not logged in';
var AuthService = /** @class */ (function () {
    function AuthService(config) {
        var _this_1 = this;
        this._providerIds = [];
        if (!config) {
            throw new Error('Configuration is missing.');
        }
        this.event = new events_1.EventEmitter();
        this._providerIds = [];
        this._user = null;
        this.initialized = false;
        if (config.isInitialized) {
            this.initialiseProviders(config.providers, config.lazyLoad);
        }
        else {
            config.event.on(auth_config_1.AUTHCONFIGINITEVENT, function (providers) {
                if (providers) {
                    _this_1.initialiseProviders(providers, config.lazyLoad);
                }
            });
        }
    }
    AuthService.prototype.initialiseProviders = function (providers, lazyLoad) {
        var _this_1 = this;
        if (lazyLoad === void 0) { lazyLoad = false; }
        this.providers = providers;
        providers.forEach(function (provider, key) {
            _this_1._providerIds.push(key);
        });
        if (!lazyLoad) {
            this.initialize();
        }
    };
    AuthService.prototype.initialize = function () {
        var _this_1 = this;
        this.initialized = true;
        if (this.providers) {
            this.providers.forEach(function (provider, key) {
                var _this = _this_1;
                provider.initialize().then(function () {
                    // if(_this._providerIds){
                    //     _this._providerIds.push(key);
                    //     _this.event.emit(PROVIDERSTATECHANGEDEVENT,_this._providerIds);
                    // provider.getLoginStatus().then(function (user:User) {
                    //     user.provider = key;
                    //     _this._user = user;
                    //     _this.event.emit(AUTHSTATECHANGEDEVENT, user);
                    // }).catch(function (err) {
                    //     _this.event.emit(AUTHSTATECHANGEDEVENT, null);
                    // });
                    // }                    
                });
            });
        }
    };
    AuthService.prototype.signIn = function (providerId, opt) {
        var _this_1 = this;
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this_1.providers) {
                var providerObject = _this_1.providers.get(providerId);
                if (providerObject) {
                    if (!_this_1.initialized) {
                        providerObject.initialize().then(function (provider) {
                            provider.signIn(opt).then(function (user) {
                                user.provider = providerId;
                                _this._user = user;
                                _this.event.emit(exports.AUTHSTATECHANGEDEVENT, user);
                                resolve(user);
                            }).catch(function (err) {
                                reject(err);
                            });
                        });
                    }
                    else {
                        providerObject.signIn(opt).then(function (user) {
                            user.provider = providerId;
                            _this._user = user;
                            _this.event.emit(exports.AUTHSTATECHANGEDEVENT, user);
                            resolve(user);
                        }).catch(function (err) {
                            reject(err);
                        });
                    }
                }
                else {
                    reject(exports.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
            else {
                reject(exports.ERR_LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    };
    AuthService.prototype.signOut = function (revoke) {
        var _this_1 = this;
        var _this = this;
        if (revoke === void 0) {
            revoke = false;
        }
        if (!this.initialized) {
            return new Promise(function (resolve, reject) {
                reject(exports.ERR_LOGIN_PROVIDER_NOT_FOUND);
            });
        }
        return new Promise(function (resolve, reject) {
            if (!_this_1._user) {
                reject(exports.ERR_NOT_LOGGED_IN);
            }
            else if (_this_1.providers) {
                var providerId = _this_1._user.provider;
                var providerObject = _this_1.providers.get(providerId);
                if (providerObject) {
                    providerObject.signOut(revoke).then(function () {
                        resolve();
                        _this._user = null;
                        _this.event.emit(exports.AUTHSTATECHANGEDEVENT, null);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    reject(exports.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
            else {
                reject(exports.ERR_LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
