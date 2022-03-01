import { BaseAuthProvider, PROVIDERINITEVENT } from "./base-auth-provider";
import { LoginOption } from "../types/login-option";
import { User } from "../types/user";
import { AuthProvider } from "./auth-provider";

declare var gapi: any;

export class GoogleLoginProvider extends BaseAuthProvider {
    private apiKey:string;
    private clientId:string;
    private opt:LoginOption;
    static readonly PROVIDER_ID: string="Google";
    protected auth2: any;
    private GoogleAuth:any;

    constructor(apiKey:string, clientId: string, opt: LoginOption= { scope: 'https://www.googleapis.com/auth/userinfo.profile' }){
        super();
        this.apiKey =apiKey;
        this.clientId =clientId;
        this.opt =opt;
    }
    initialize(): Promise<AuthProvider>{
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://apis.google.com/js/api.js', function () {
                gapi.load('client:auth2', () => {
                    gapi.client.init({
                        'apiKey': _this.apiKey,
                        'clientId': _this.clientId,
                        'discoveryDocs': [],
                        'scope': _this.opt.scope
                    }).then(function () {
                        _this.GoogleAuth = gapi.auth2.getAuthInstance();
                        _this.onInitFinished();
                        resolve(_this);
                    }).catch((err: any) => {
                        reject(err);
                    });;
                });
            });
        });
    }
    getLoginStatus(): Promise<User> {
        if(this.isReady){
            return this.checkGoogleLoginStatus();
        }
        else{
            return new Promise((resolve, reject) => {
                reject('No user is currently logged in.');
            });
        }
    }
    private checkGoogleLoginStatus(): Promise<User>{
        return new Promise((resolve, reject)=>{
            var user = this.GoogleAuth.currentUser.get();
            var isAuthorized = user.hasGrantedScopes(this.opt.scope);
            if (isAuthorized) {
                var _user = new User(GoogleLoginProvider.PROVIDER_ID);
                var profile = user.getBasicProfile();
                var token = user.getAuthResponse(true).access_token;
                var backendToken = user.getAuthResponse(true).id_token;
                _user.id = profile.getId();
                _user.name = profile.getName();
                _user.gender = profile.getGender();
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
        })
    }
    signIn(opt?: LoginOption): Promise<User>  {
        if(this.isReady){
            return this.googleLogin(opt);
        }
        return new Promise((resolve, reject) => {
            this.event.on(PROVIDERINITEVENT,() => {
                this.googleLogin(opt).then((user:User)=>{
                    resolve(user);
                },err=>{
                    reject(err);
                })
            });
        });
    }
    private googleLogin(option?: LoginOption): Promise<User>{
        var _this = this;
        var opt = option ? option: this.opt;
        return new Promise((resolve, reject)=>{
            var offlineAccess = (opt && opt.offline_access) 
            var promise = !offlineAccess ? _this.GoogleAuth.signIn(opt) : _this.GoogleAuth.grantOfflineAccess(opt);
            promise.then(function (response:any) {
                var user = new User(GoogleLoginProvider.PROVIDER_ID);
                var profile = _this.GoogleAuth.currentUser.get().getBasicProfile();
                var token = _this.GoogleAuth.currentUser.get().getAuthResponse(true).access_token;
                var backendToken = _this.GoogleAuth.currentUser.get().getAuthResponse(true).id_token;
                user.id = profile.getId();
                user.name = profile.getName();
                user.gender = profile.getGender();
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
            }, function (closed:any) {
                reject('User cancelled login or did not fully authorize.');
            }).catch(function (err:any) {
                reject(err);
            });
        });
    }
    signOut(): Promise<any> {
        if(this.isReady){
            return this.googleLogout();
        }else{
            return new Promise((resolve, reject) => {
                reject('No user is currently logged in.');
            });
        }
        
    }
    private googleLogout(): Promise<void>{
        return new Promise((resolve, reject)=>{
            this.GoogleAuth.signOut().then(()=>{
                resolve();
            },(err:any)=>{
                reject(err);
            });
        });
    }
}
