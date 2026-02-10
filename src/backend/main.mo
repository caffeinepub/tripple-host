import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
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

  stable let pricingPlans = Map.empty<Nat, PricingPlan>();
  stable var nextPlanId : Nat = 0;
  stable let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Pricing Plan Management (Admin only for CUD, public for R)

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
    // Public read access - no authorization check needed
    pricingPlans.get(id);
  };

  public query func getAllPricingPlans() : async [PricingPlan] {
    // Public read access - no authorization check needed
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
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
