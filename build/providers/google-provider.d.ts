import { BaseAuthProvider } from "./base-auth-provider";
import { LoginOption } from "../types/login-option";
import { User } from "../types/user";
import { AuthProvider } from "./auth-provider";
export declare class GoogleLoginProvider extends BaseAuthProvider {
    private apiKey;
    private clientId;
    private opt;
    static readonly PROVIDER_ID: string;
    protected auth2: any;
    private GoogleAuth;
    constructor(apiKey: string, clientId: string, opt?: LoginOption);
    initialize(): Promise<AuthProvider>;
    getLoginStatus(): Promise<User>;
    private checkGoogleLoginStatus;
    signIn(opt?: LoginOption): Promise<User>;
    private googleLogin;
    signOut(): Promise<any>;
    private googleLogout;
}
