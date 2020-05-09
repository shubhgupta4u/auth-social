import { User } from "../types/user";
import { LoginOption } from "../types/login-option";

export interface AuthProvider {
    initialize(): Promise<AuthProvider>;
    getLoginStatus(): Promise<User>;
    signIn(opt?: LoginOption): Promise<User>;
    signOut(revoke?: boolean): Promise<any>;
}