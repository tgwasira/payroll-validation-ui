function makeRoutes(base, extra = {}) {
  return {
    base,
    list: base,
    ...Object.fromEntries(
      Object.entries(extra).map(([key, sub]) => [key, `${base}${sub}`])
    ),
  };
}

const routes = {
  validationJobs: makeRoutes("/en/validation-jobs", {
    new: "/new",
  }),
  validationRuleGroups: makeRoutes("/en/validation-rule-groups", {
    new: "/new",
  }),
  validationRules: makeRoutes("/en/validation-rules", {
    new: "/new",
  }),
};

export default routes;
