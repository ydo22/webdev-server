import "express-session";

// Lets req.session.currentUser type-check.
declare module "express-session" {
  interface SessionData {
    currentUser: any;
  }
}
