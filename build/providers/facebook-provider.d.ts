import { BaseAuthProvider } from "./base-auth-provider";
import { LoginOption } from "../types/login-option";
import { User } from "../types/user";
import { AuthProvider } from "./auth-provider";
export declare class FacebookLoginProvider extends BaseAuthProvider {
    private appId;
    private opt;
    private locale;
    private fields;
    private version;
    static readonly PROVIDER_ID: string;
    constructor(appid: string, opt?: LoginOption, locale?: string, fields?: string, version?: string);
    initialize(): Promise<AuthProvider>;
    getLoginStatus(): Promise<User>;
    private checkFBLoginStatus;
    signIn(opt?: LoginOption): Promise<User>;
    private fbLogin;
    signOut(): Promise<any>;
    private fbLogout;
}
