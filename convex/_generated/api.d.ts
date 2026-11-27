/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as favorites from "../favorites.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as lib_listingImages from "../lib/listingImages.js";
import type * as lib_propertyTypes from "../lib/propertyTypes.js";
import type * as lib_realtorPlan from "../lib/realtorPlan.js";
import type * as listings from "../listings.js";
import type * as notifications from "../notifications.js";
import type * as preferential from "../preferential.js";
import type * as questions from "../questions.js";
import type * as realtors from "../realtors.js";
import type * as reports from "../reports.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  favorites: typeof favorites;
  http: typeof http;
  lib: typeof lib;
  "lib/listingImages": typeof lib_listingImages;
  "lib/propertyTypes": typeof lib_propertyTypes;
  "lib/realtorPlan": typeof lib_realtorPlan;
  listings: typeof listings;
  notifications: typeof notifications;
  preferential: typeof preferential;
  questions: typeof questions;
  realtors: typeof realtors;
  reports: typeof reports;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
