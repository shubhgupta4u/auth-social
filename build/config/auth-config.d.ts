/// <reference types="node" />
import { AuthProvider } from "../providers/auth-provider";
import { EventEmitter } from "events";
export declare const AUTHCONFIGINITEVENT: string;
export declare class AuthConfigItem {
    id: string;
    provider: AuthProvider;
    /**
     * This field allows to load login providers SDKs lazily.
     * Lazy loading is activated if it's true and vice versa.
     */
    lazyLoad?: boolean;
}
export declare class AuthConfig {
    lazyLoad: boolean | undefined;
    providers: Map<string, AuthProvider>;
    event: EventEmitter;
    isInitialized: boolean;
    constructor(providers: AuthConfigItem[]);
    initialize(providers: AuthConfigItem[]): void;
}
