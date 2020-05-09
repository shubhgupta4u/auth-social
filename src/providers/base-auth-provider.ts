import { User } from "../types/user";
import { AuthProvider } from "./auth-provider";
import { LoginOption } from "../types/login-option";
import { EventEmitter } from "events";

export const PROVIDERINITEVENT:string="onProviderInit";

export abstract class BaseAuthProvider implements AuthProvider{
    protected event:EventEmitter;
    protected isReady:boolean = false;
    constructor(){
        this.event = new EventEmitter();
    }
    protected onInitFinished()
    {
        this.isReady = true;
        this.event.emit(PROVIDERINITEVENT);        
    }
    abstract initialize(): Promise<AuthProvider>;
    abstract getLoginStatus(): Promise<User>;
    abstract signIn(opt?: LoginOption): Promise<User>;
    abstract signOut(revoke?: boolean): Promise<any>;

    public loadScript(id: string, src: string, onload: any, async?: boolean, inner_text_content?: string){
        if (async === void 0) { async = true; }
        if (inner_text_content === void 0) { inner_text_content = ''; }
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
    }
}