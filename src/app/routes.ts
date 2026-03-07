import { sign } from "crypto";

// @ts-nocheck
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
  signin: "/en/signin",
};

export default routes;
