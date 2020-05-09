/// <reference types="node" />
import { LoginOption } from "../types/login-option";
import { User } from "../types/user";
import { AuthConfig } from "../config/auth-config";
import { EventEmitter } from "events";
import { AuthProvider } from "../providers/auth-provider";
export declare const AUTHSTATECHANGEDEVENT: string;
export declare const PROVIDERSTATECHANGEDEVENT: string;
export declare const ERR_LOGIN_PROVIDER_NOT_FOUND = "Login provider not found";
export declare const ERR_NOT_LOGGED_IN = "Not logged in";
export declare class AuthService {
    private _providerIds;
    private providers;
    private _user;
    private initialized;
    readonly event: EventEmitter;
    constructor(config: AuthConfig);
    initialiseProviders(providers: Map<string, AuthProvider>, lazyLoad?: boolean): void;
    private initialize;
    signIn(providerId: string, opt?: LoginOption): Promise<User>;
    signOut(revoke?: boolean): Promise<any>;
}
