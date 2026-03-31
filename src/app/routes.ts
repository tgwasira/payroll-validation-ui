// @ts-nocheck
import { sign } from "crypto";

function makeRoutesObject(base, extra = {}) {
  return {
    base,
    list: base,
    ...Object.fromEntries(
      Object.entries(extra).map(([key, sub]) => [key, `${base}${sub}`]),
    ),
  };
}

const routes = {
  validationJobs: makeRoutesObject("/en/validation-jobs", {
    new: "/new",
  }),
  validationRuleGroups: makeRoutesObject("/en/validation-rule-groups", {
    new: "/new",
  }),
  validationRules: makeRoutesObject("/en/validation-rules", {
    new: "/new",
  }),
  signup: "/en/signup",
  completeSignup: "/en/complete-signup",
  login: "/en/login",

  nextServer: {
    ...makeRoutesObject("/api"),
    auth: makeRoutesObject("/api/auth", {
      login: "/login",
    }),
  },
};

export default routes;
