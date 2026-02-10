import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SiteSettings {
    footerTagline: string;
    footerSupport: string;
    statsTitle: string;
    faqSubtitle: string;
    navCtaLink: string;
    heroCta2Text: string;
    navCtaText: string;
    footerPrivacy: string;
    faqTitle: string;
    featuresSubtitle: string;
    heroBadge: string;
    heroSubtitle: string;
    featuresTitle: string;
    statsSubtitle: string;
    heroCta1Text: string;
    footerCta: string;
    footerTerms: string;
    heroTitle: string;
}
export type AdminPrincipal = string;
export interface EditableSettings {
    footerTagline?: string;
    footerSupport?: string;
    statsTitle?: string;
    faqSubtitle?: string;
    navCtaLink?: string;
    heroCta2Text?: string;
    navCtaText?: string;
    footerPrivacy?: string;
    faqTitle?: string;
    featuresSubtitle?: string;
    heroBadge?: string;
    heroSubtitle?: string;
    featuresTitle?: string;
    statsSubtitle?: string;
    heroCta1Text?: string;
    footerCta?: string;
    footerTerms?: string;
    heroTitle?: string;
}
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
    addAdmin(newAdminText: AdminPrincipal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPricingPlan(name: string, description: string, priceCents: bigint, durationDays: bigint, features: Array<string>): Promise<bigint>;
    deletePricingPlan(id: bigint): Promise<void>;
    doesAdminExist(): Promise<boolean>;
    getAdminList(): Promise<Array<AdminPrincipal>>;
    getAllPricingPlans(): Promise<Array<PricingPlan>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLogo(): Promise<ExternalBlob | null>;
    getPricingPlan(id: bigint): Promise<PricingPlan | null>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeAdmin(adminText: AdminPrincipal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateLogo(blob: ExternalBlob): Promise<void>;
    updatePricingPlan(id: bigint, name: string, description: string, priceCents: bigint, durationDays: bigint, features: Array<string>): Promise<void>;
    updateSiteSettings(settings: EditableSettings): Promise<SiteSettings>;
}
