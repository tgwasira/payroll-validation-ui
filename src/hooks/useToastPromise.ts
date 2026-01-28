// @ts-nocheck
import { useCallback } from "react";
import { toast } from "react-toastify";

type ToastMessages<T> = {
  pending?: string;
  success?: (data: T) => string;
  error?: (err: any) => string;
};

export function useToastPromise<T>() {
  return useCallback(
    async (promise: Promise<T>, messages: ToastMessages<T>): Promise<T> => {
      return toast.promise<T>(promise, {
        pending: {
          render: () => messages.pending || "Loading...",
          icon: false,
        },
        success: {
          render({ data }) {
            return messages.success ? messages.success(data as T) : "Success!";
          },
          icon: true,
        },
        error: {
          render({ data }) {
            return messages.error
              ? messages.error(data)
              : data?.message || "Something went wrong";
          },
          icon: true,
        },
      });
    },
    [],
  );
}
