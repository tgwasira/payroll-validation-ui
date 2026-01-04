import ApiClient from "@/react-ui-library/api/clients";

export const validationServiceApi = new ApiClient({
  baseURL: "http://127.0.0.1:8000",
  webSocketURL: "ws://127.0.0.1:8000/ws/01K8G9R4S6MKRVJT4EEYW73JQD",
  headers: {}, // Do not define Content-Type here because for multipart, the browser sets it including boundary
  interceptors: {
    // request: async (options) => {
    //   // Add auth token if available
    //   const token =
    //     typeof window !== "undefined"
    //       ? localStorage.getItem("auth_token")
    //       : null;
    //   if (token) {
    //     options.headers = {
    //       ...options.headers,
    //       Authorization: `Bearer ${token}`,
    //     };
    //   }
    //   return options;
    // },
    // response: async (response) => {
    //   if (!response.ok) {
    //     if (response.status === 401) {
    //       // Handle unauthorized - redirect to login
    //       if (typeof window !== "undefined") {
    //         window.location.href = "/login";
    //       }
    //     }
    //     throw new Error(`Request failed: ${response.status}`);
    //   }
    //   return response.json();
    // },
  },
  endpoints: {
    validationJobs: "/validation-jobs",
    validationJobRun: (id: number) => `/events/validation/${id}/run`,
    validationFileRecords: "/validation-file-records",
    validationRuleDataSources: "/validation-rule-data-sources",
    downloadFile: "/files/download",
  },
});

export const ragServiceApi = new ApiClient({
  baseURL: "http://127.0.0.1:8001",
  headers: {}, // Do not define Content-Type here because for multipart, the browser sets it including boundary
  interceptors: {
    // request: async (options) => {
    //   // Add auth token if available
    //   const token =
    //     typeof window !== "undefined"
    //       ? localStorage.getItem("auth_token")
    //       : null;
    //   if (token) {
    //     options.headers = {
    //       ...options.headers,
    //       Authorization: `Bearer ${token}`,
    //     };
    //   }
    //   return options;
    // },
    // response: async (response) => {
    //   if (!response.ok) {
    //     if (response.status === 401) {
    //       // Handle unauthorized - redirect to login
    //       if (typeof window !== "undefined") {
    //         window.location.href = "/login";
    //       }
    //     }
    //     throw new Error(`Request failed: ${response.status}`);
    //   }
    //   return response.json();
    // },
  },
  endpoints: {
    indexFile: "/events/rag/index-file",
    generateContext: "/events/rag/generate-context",
  },
});
