/// <reference types="node" />
import { User } from "../types/user";
import { AuthProvider } from "./auth-provider";
import { LoginOption } from "../types/login-option";
import { EventEmitter } from "events";
export declare const PROVIDERINITEVENT: string;
export declare abstract class BaseAuthProvider implements AuthProvider {
    protected event: EventEmitter;
    protected isReady: boolean;
    constructor();
    protected onInitFinished(): void;
    abstract initialize(): Promise<AuthProvider>;
    abstract getLoginStatus(): Promise<User>;
    abstract signIn(opt?: LoginOption): Promise<User>;
    abstract signOut(revoke?: boolean): Promise<any>;
    loadScript(id: string, src: string, onload: any, async?: boolean, inner_text_content?: string): void;
}
