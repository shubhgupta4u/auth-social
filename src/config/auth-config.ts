import { AuthProvider } from "../providers/auth-provider";
import { EventEmitter } from "events";

export const AUTHCONFIGINITEVENT:string="onAuthConfigInit";

export declare class AuthConfigItem{
    id: string;
    provider: AuthProvider;
    /**
     * This field allows to load login providers SDKs lazily.
     * Lazy loading is activated if it's true and vice versa.
     */
    lazyLoad?: boolean;  
}
export class AuthConfig{
    lazyLoad: boolean|undefined;
    providers: Map<string, AuthProvider>;
    event: EventEmitter;
    isInitialized:boolean=false;
    constructor(providers: AuthConfigItem[]){
        this.event = new EventEmitter();
        this.lazyLoad = false;
        this.providers = new Map<string, AuthProvider>();
        this.initialize(providers);
    }
    initialize(providers: AuthConfigItem[]): void{
        for (var i = 0; i < providers.length; i++) {
            var element = providers[i];
            this.providers.set(element.id, element.provider);
            this.lazyLoad = this.lazyLoad || element.lazyLoad;
        }
        this.isInitialized = true;
        this.event.emit(AUTHCONFIGINITEVENT,this.providers);
    }
}