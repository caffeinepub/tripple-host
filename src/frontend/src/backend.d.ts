import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PricingPlan {
    id: bigint;
    durationDays: bigint;
    features: Array<string>;
    name: string;
    description: string;
    priceCents: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPricingPlan(name: string, description: string, priceCents: bigint, durationDays: bigint, features: Array<string>): Promise<bigint>;
    deletePricingPlan(id: bigint): Promise<void>;
    getAllPricingPlans(): Promise<Array<PricingPlan>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPricingPlan(id: bigint): Promise<PricingPlan | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePricingPlan(id: bigint, name: string, description: string, priceCents: bigint, durationDays: bigint, features: Array<string>): Promise<void>;
}
