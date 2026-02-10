import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Types
  public type PricingPlan = {
    id : Nat;
    name : Text;
    description : Text;
    priceCents : Nat;
    durationDays : Nat;
    features : [Text];
  };

  public type UserProfile = {
    name : Text;
  };

  public type SiteSettings = {
    navCtaText : Text;
    navCtaLink : Text;
    heroBadge : Text;
    heroTitle : Text;
    heroSubtitle : Text;
    heroCta1Text : Text;
    heroCta2Text : Text;
    statsTitle : Text;
    statsSubtitle : Text;
    featuresTitle : Text;
    featuresSubtitle : Text;
    faqTitle : Text;
    faqSubtitle : Text;
    footerTagline : Text;
    footerCta : Text;
    footerTerms : Text;
    footerPrivacy : Text;
    footerSupport : Text;
  };

  public type EditableSettings = {
    navCtaText : ?Text;
    navCtaLink : ?Text;
    heroBadge : ?Text;
    heroTitle : ?Text;
    heroSubtitle : ?Text;
    heroCta1Text : ?Text;
    heroCta2Text : ?Text;
    statsTitle : ?Text;
    statsSubtitle : ?Text;
    featuresTitle : ?Text;
    featuresSubtitle : ?Text;
    faqTitle : ?Text;
    faqSubtitle : ?Text;
    footerTagline : ?Text;
    footerCta : ?Text;
    footerTerms : ?Text;
    footerPrivacy : ?Text;
    footerSupport : ?Text;
  };

  // Persistent State
  let pricingPlans = Map.empty<Nat, PricingPlan>();
  var nextPlanId : Nat = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();
  var siteSettings : SiteSettings = {
    navCtaText = "Try Now";
    navCtaLink = "#pricing";
    heroBadge = "NEW";
    heroTitle = "Premium, Ready-to-Use Websites";
    heroSubtitle = "Get a fully functional, production-grade website in minutes.";
    heroCta1Text = "Get Started";
    heroCta2Text = "View Templates";
    statsTitle = "";
    statsSubtitle = "";
    featuresTitle = "All-in-One Solution";
    featuresSubtitle = "Everything you need for a professional site.";
    faqTitle = "FAQs";
    faqSubtitle = "Common questions answered.";
    footerTagline = "Built with Moonpup";
    footerCta = "Get Started";
    footerTerms = "Terms of Service";
    footerPrivacy = "Privacy Policy";
    footerSupport = "Support";
  };

  var logo : ?Storage.ExternalBlob = null;
  var adminPrincipals = Map.empty<Text, Bool>();
  let accessControlState = AccessControl.initState();

  // Include Mixins
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Pricing Plan Management
  public shared ({ caller }) func createPricingPlan(name : Text, description : Text, priceCents : Nat, durationDays : Nat, features : [Text]) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create pricing plans");
    };

    let plan : PricingPlan = {
      id = nextPlanId;
      name;
      description;
      priceCents;
      durationDays;
      features;
    };
    let planId = nextPlanId;
    nextPlanId += 1;
    pricingPlans.add(planId, plan);
    planId;
  };

  public shared ({ caller }) func updatePricingPlan(id : Nat, name : Text, description : Text, priceCents : Nat, durationDays : Nat, features : [Text]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update pricing plans");
    };

    switch (pricingPlans.get(id)) {
      case (null) { Runtime.trap("Pricing plan not found") };
      case (?_) {
        let updatedPlan : PricingPlan = {
          id;
          name;
          description;
          priceCents;
          durationDays;
          features;
        };
        pricingPlans.add(id, updatedPlan);
      };
    };
  };

  public shared ({ caller }) func deletePricingPlan(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete pricing plans");
    };

    if (not pricingPlans.containsKey(id)) {
      Runtime.trap("Pricing plan not found");
    };

    pricingPlans.remove(id);
  };

  public query func getPricingPlan(id : Nat) : async ?PricingPlan {
    pricingPlans.get(id);
  };

  public query func getAllPricingPlans() : async [PricingPlan] {
    pricingPlans.values().toArray();
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // CMS-like Customization (Admin Only)
  public query func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(settings : EditableSettings) : async SiteSettings {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update site settings");
    };

    siteSettings := {
      navCtaText = switch (settings.navCtaText) {
        case (?text) { text };
        case (null) { siteSettings.navCtaText };
      };
      navCtaLink = switch (settings.navCtaLink) {
        case (?link) { link };
        case (null) { siteSettings.navCtaLink };
      };
      heroBadge = switch (settings.heroBadge) {
        case (?badge) { badge };
        case (null) { siteSettings.heroBadge };
      };
      heroTitle = switch (settings.heroTitle) {
        case (?title) { title };
        case (null) { siteSettings.heroTitle };
      };
      heroSubtitle = switch (settings.heroSubtitle) {
        case (?subtitle) { subtitle };
        case (null) { siteSettings.heroSubtitle };
      };
      heroCta1Text = switch (settings.heroCta1Text) {
        case (?cta1) { cta1 };
        case (null) { siteSettings.heroCta1Text };
      };
      heroCta2Text = switch (settings.heroCta2Text) {
        case (?cta2) { cta2 };
        case (null) { siteSettings.heroCta2Text };
      };
      statsTitle = switch (settings.statsTitle) {
        case (?stats) { stats };
        case (null) { siteSettings.statsTitle };
      };
      statsSubtitle = switch (settings.statsSubtitle) {
        case (?stats) { stats };
        case (null) { siteSettings.statsSubtitle };
      };
      featuresTitle = switch (settings.featuresTitle) {
        case (?features) { features };
        case (null) { siteSettings.featuresTitle };
      };
      featuresSubtitle = switch (settings.featuresSubtitle) {
        case (?features) { features };
        case (null) { siteSettings.featuresSubtitle };
      };
      faqTitle = switch (settings.faqTitle) {
        case (?faq) { faq };
        case (null) { siteSettings.faqTitle };
      };
      faqSubtitle = switch (settings.faqSubtitle) {
        case (?faq) { faq };
        case (null) { siteSettings.faqSubtitle };
      };
      footerTagline = switch (settings.footerTagline) {
        case (?tagline) { tagline };
        case (null) { siteSettings.footerTagline };
      };
      footerCta = switch (settings.footerCta) {
        case (?cta) { cta };
        case (null) { siteSettings.footerCta };
      };
      footerTerms = switch (settings.footerTerms) {
        case (?terms) { terms };
        case (null) { siteSettings.footerTerms };
      };
      footerPrivacy = switch (settings.footerPrivacy) {
        case (?privacy) { privacy };
        case (null) { siteSettings.footerPrivacy };
      };
      footerSupport = switch (settings.footerSupport) {
        case (?support) { support };
        case (null) { siteSettings.footerSupport };
      };
    };
    siteSettings;
  };

  // Logo Management
  public query func getLogo() : async ?Storage.ExternalBlob {
    logo;
  };

  public shared ({ caller }) func updateLogo(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update logo");
    };

    logo := ?blob;
  };

  // Admin List Management
  public type AdminPrincipal = Text;

  public query func doesAdminExist() : async Bool {
    adminPrincipals.size() > 0;
  };

  public query ({ caller }) func getAdminList() : async [AdminPrincipal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view admin list");
    };
    adminPrincipals.keys().toArray();
  };

  public type AdminToken = Text;

  // Function to claim admin privileges if no admins exist, includes adminToken and userProvidedToken
  public shared ({ caller }) func claimAdminIfNoneExist(adminToken : Text, userProvidedToken : Text) : async Bool {
    // SECURITY: Only authenticated users (not guests/anonymous) can claim admin
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can claim admin privileges");
    };

    // Check if any admins exist
    if (adminPrincipals.size() > 0) {
      Runtime.trap("Admin privileges cannot be claimed after setup. Please contact an existing admin for access.");
    };

    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
    adminPrincipals.add(caller.toText(), true);
    true;
  };

  public shared ({ caller }) func addAdmin(newAdminText : AdminPrincipal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add new admins");
    };

    let newAdminPrincipal = Principal.fromText(newAdminText);
    AccessControl.assignRole(accessControlState, caller, newAdminPrincipal, #admin);
    adminPrincipals.add(newAdminText, true);
  };

  public shared ({ caller }) func removeAdmin(adminText : AdminPrincipal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove admins");
    };

    if (adminPrincipals.size() <= 1) {
      Runtime.trap("Cannot remove the last admin");
    };

    if (caller.toText() == adminText) {
      Runtime.trap("Cannot remove yourself as admin");
    };

    adminPrincipals.remove(adminText);
  };
};
