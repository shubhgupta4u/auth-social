import { LoginOption } from "../types/login-option";
import { User } from "../types/user";
import { AUTHCONFIGINITEVENT, AuthConfig } from "../config/auth-config";
import { EventEmitter } from "events";
import { AuthProvider } from "../providers/auth-provider";

export const AUTHSTATECHANGEDEVENT:string="authStateChanged";
export const PROVIDERSTATECHANGEDEVENT:string="providerStateChanged";
export const ERR_LOGIN_PROVIDER_NOT_FOUND= 'Login provider not found';
export const ERR_NOT_LOGGED_IN= 'Not logged in';

export class AuthService {
     
    private _providerIds:string[]=[];
    private providers:Map<string, AuthProvider>|undefined;
    private _user:User|undefined|null;
    private initialized:boolean;
    readonly event: EventEmitter;

    constructor(config:AuthConfig){
        if(!config){
            throw new Error('Configuration is missing.');
        }
        this.event = new EventEmitter();
        this._providerIds=[];
        this._user = null;
        this.initialized = false;
        if(config.isInitialized){
            this.initialiseProviders(config.providers, config.lazyLoad);
        }else{
            config.event.on(AUTHCONFIGINITEVENT,(providers)=>{               
                if(providers){               
                    this.initialiseProviders(providers, config.lazyLoad);
                }
            })
        }
        
    }
    initialiseProviders(providers:Map<string, AuthProvider>, lazyLoad:boolean = false){
        this.providers = providers;
        providers.forEach((provider, key)=>{
            this._providerIds.push(key);
        });
        if (!lazyLoad) {
            this.initialize();
        }
    }
    private initialize(){
        this.initialized = true;
        if(this.providers){
            this.providers.forEach((provider, key)=>{
                let _this = this;
                provider.initialize().then(()=> {
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
       
    }
    signIn(providerId: string, opt?: LoginOption): Promise<User>{
        var _this = this;       
        return new Promise((resolve, reject) => {
            if(this.providers){
                var providerObject = this.providers.get(providerId);

                if (providerObject) { 
                    if (!this.initialized) {
                        providerObject.initialize().then((provider:AuthProvider)=>{
                            provider.signIn(opt).then(function (user) {
                                user.provider = providerId;                       
                                _this._user = user;
                                _this.event.emit(AUTHSTATECHANGEDEVENT, user);
                                resolve(user);
                            }).catch(function (err) {
                                reject(err);
                            });
                        });
                    }
                    else{
                        providerObject.signIn(opt).then(function (user) {
                            user.provider = providerId;                       
                            _this._user = user;
                            _this.event.emit(AUTHSTATECHANGEDEVENT, user);
                            resolve(user);
                        }).catch(function (err) {
                            reject(err);
                        });
                    }
                    
                }
                else {
                    reject(ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
            else {
                reject(ERR_LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    }
    signOut(revoke?: boolean): Promise<any>{
        var _this = this;
        if (revoke === void 0) { revoke = false; }
        if (!this.initialized) {
            return new Promise((resolve, reject) => {
                reject(ERR_LOGIN_PROVIDER_NOT_FOUND);
            });
        }
        return new Promise((resolve, reject) => {
            if (!this._user) {
                reject(ERR_NOT_LOGGED_IN);
            }
            else if(this.providers) {
                var providerId = this._user.provider;
                var providerObject = this.providers.get(providerId);
                if (providerObject) {
                    providerObject.signOut(revoke).then(function () {
                        resolve();
                        _this._user = null;
                        _this.event.emit(AUTHSTATECHANGEDEVENT, null);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    reject(ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }  else {
                reject(ERR_LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    }
}