import { BaseAuthProvider, PROVIDERINITEVENT } from "./base-auth-provider";
import { LoginOption } from "../types/login-option";
import { User } from "../types/user";
import { AuthProvider } from "./auth-provider";

declare var FB: any;

export class FacebookLoginProvider extends BaseAuthProvider {
    private appId:string;
    private opt:LoginOption;
    private locale:string;
    private fields:string;
    private version:string;
    static readonly PROVIDER_ID: string="FACEBOOK";
  
   
    constructor(appid:string
        , opt:LoginOption = { scope: 'email,public_profile' }
        , locale:string = 'en_US'
        , fields:string = 'name,email,picture,first_name,last_name,user_gender,user_birthday'
        , version:string = 'v7.0') {
        super();
        this.appId = appid;
        this.opt = opt;
        this.locale = locale;
        this.fields = fields;
        this.version = version;
    }
    initialize():Promise<AuthProvider> {
        return new Promise((resolve, reject) => {
            this.loadScript(FacebookLoginProvider.PROVIDER_ID, `https://connect.facebook.net/${this.locale}/sdk.js`, () => {
                FB.init({
                    appId: this.appId,
                    autoLogAppEvents: true,
                    cookie: true,
                    xfbml: true,
                    version: this.version
                });
                // FB.AppEvents.logPageView(); #FIX for #18
                this.onInitFinished();
                resolve(this);
            });
        });
    }
     
    getLoginStatus(): Promise<User> {
        if(this.isReady){
            return this.checkFBLoginStatus();
        }
        else{
            return new Promise((resolve, reject) => {
                reject('No user is currently logged in.');
            });
        }
    }
    private checkFBLoginStatus(): Promise<User>{
        return new Promise((resolve, reject)=>{
            let user = new User(FacebookLoginProvider.PROVIDER_ID);
            FB.getLoginStatus((response:any) => {
                console.log(response)
                if (response.status === 'connected') {
                    let authResponse = response.authResponse;
                    FB.api(`/me?fields=${this.fields}`, (fbUser:any) => {                      
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.gender = fbUser.user_gender;
                        user.dob = fbUser.user_birthday;
                        user.authToken = authResponse.accessToken;
                        user.facebook = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject('No user is currently logged in.');
                }
            });
        })
    }
    signIn(opt?: LoginOption): Promise<User>  {
        if(this.isReady){
            return this.fbLogin(opt);
        }
        return new Promise((resolve, reject) => {
            this.event.on(PROVIDERINITEVENT,() => {
                this.fbLogin(opt).then((user:User)=>{
                    resolve(user);
                },err=>{
                    reject(err);
                })
            });
        });
    }
    private fbLogin(option?:LoginOption): Promise<User>{
        var opt = option ? option: this.opt;
        let user = new User(FacebookLoginProvider.PROVIDER_ID);
        return new Promise((resolve, reject)=>{
            FB.login((response:any) => {
                console.log(response)
                if (response.authResponse) {
                    let authResponse = response.authResponse;
                    FB.api(`/me?fields=${this.fields}`, (fbUser:any) => {                        
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.gender = fbUser.user_gender;
                        user.dob = fbUser.user_birthday; 
                        user.authToken = authResponse.accessToken;                       user.authToken = authResponse.accessToken;
                        user.facebook = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject('User cancelled login or did not fully authorize.');
                }
            }, opt);
        });
    }
    signOut(): Promise<any> {
        if(this.isReady){
            return this.fbLogout();
        }else{
            return new Promise((resolve, reject) => {
                reject('No user is currently logged in.');
            });
        }
        
    }
    private fbLogout(): Promise<void>{
        return new Promise((resolve, reject)=>{
            FB.logout((response:any) => {
                console.log(response)
                resolve();
            },(err:any)=>{
                reject(err);
            });
        });
    }
}