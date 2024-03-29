import React, { SVGProps } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  XMarkIcon as XIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import toast, { Toaster, ToastOptions } from "react-hot-toast";
import { Spinner } from "components";
import { classNames } from "util/css";

export const ToasterContainer = Toaster;

export enum ToastTypes {
  Success = "success",
  Error = "error",
  Pending = "pending",
  Warning = "warning",
}

export interface ToastPayload {
  actions?: JSX.Element;
  message?: string | JSX.Element;
  title: string;
  type: ToastTypes;
  dismissable?: boolean;
}

function customToast(
  { actions, title, type, message, dismissable }: ToastPayload,
  options?: ToastOptions
): any {
  let Icon: JSX.Element;

  switch (type) {
    case ToastTypes.Success: {
      Icon = (
        <CheckCircleIcon className="w-6 h-6 text-white" aria-hidden="true" />
      );
      break;
    }
    case ToastTypes.Error: {
      Icon = (
        <ExclamationCircleIcon
          className="w-6 h-6 text-white"
          aria-hidden="true"
        />
      );
      break;
    }
    case ToastTypes.Pending: {
      Icon = <Spinner className="w-6 h-6 text-white" aria-hidden="true" />;
      break;
    }
    case ToastTypes.Warning: {
      Icon = (
        <ExclamationTriangleIcon
          className="w-6 h-6 text-white"
          aria-hidden="true"
        />
      );
      break;
    }
  }

  return toast.custom(
    (t) => (
      <div
        onLoad={() => {
          setTimeout(() => toast.dismiss(t.id), 3000);
        }}
        onClick={dismissable ? () => toast.dismiss(t.id) : () => {}}
        className={classNames(
          t.visible ? "animate-enter" : "animate-leave",
          dismissable ? "cursor-pointer" : "",
          "group w-full max-w-sm bg-bg-lighter border border-white/10 shadow-lg rounded-lg pointer-events-auto p-4"
        )}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{Icon}</div>

          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-white">{title}</p>

            {message && <p className="mt-1 text-sm text-gray-400">{message}</p>}

            {actions}
          </div>
          {dismissable && (
            <div className="justify-center flex-shrink-0 hidden h-full ml-4 group-hover:flex">
              <button className="inline-flex text-white">
                <span className="sr-only">Close</span>
                <XIcon className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    ),
    options
  );
}

interface CustomToast {
  dismiss: typeof toast.dismiss;
  toast: typeof customToast;
  error: (msg: string) => void;
}

export default function useToaster(): CustomToast {
  function error(msg: string) {
    customToast({
      type: ToastTypes.Error,
      title: "Error",
      message: msg,
    });
  }

  return {
    dismiss: toast.dismiss,
    toast: customToast,
    error,
  };
}
