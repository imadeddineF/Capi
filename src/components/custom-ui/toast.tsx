"use client";

import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type React from "react";
import { toast } from "sonner";

enum ToastTypes {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

interface ToastProps {
  type: ToastTypes;
  title: string;
  description?: string | string[];
  duration?: number;
  dismissible?: boolean;
}

interface ToastConfig {
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  titleColor: string;
  descriptionColor: string;
}

const toastConfigs: Record<ToastTypes, ToastConfig> = {
  [ToastTypes.SUCCESS]: {
    icon: <CheckCircle className="w-6 h-6 text-imad" />,
    bgColor: "bg-imad/10",
    borderColor: "border-imad/20",
    iconBgColor: "bg-white",
    titleColor: "text-imad",
    descriptionColor: "text-imad/80",
  },
  [ToastTypes.ERROR]: {
    icon: <AlertCircle className="w-6 h-6 text-red-600" />,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconBgColor: "bg-white",
    titleColor: "text-red-900",
    descriptionColor: "text-red-700",
  },
  [ToastTypes.WARNING]: {
    icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconBgColor: "bg-white",
    titleColor: "text-yellow-900",
    descriptionColor: "text-yellow-700",
  },
  [ToastTypes.INFO]: {
    icon: <Info className="w-6 h-6 text-blue-600" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBgColor: "bg-white",
    titleColor: "text-blue-900",
    descriptionColor: "text-blue-700",
  },
};

function ToastContent({
  type,
  title,
  description,
  dismissible = true,
}: ToastProps) {
  const config = toastConfigs[type];
  const descriptions = Array.isArray(description)
    ? description
    : description
    ? [description]
    : [];

  return (
    <div
      className={`flex relative  z-50 items-center border-2 ${config.borderColor} rounded-xl px-4 py-4 ${config.bgColor} w-[360px] overflow-hidden shadow-lg`}
    >
      <div
        className={`flex items-center justify-center ${config.iconBgColor} rounded-full min-h-10 max-h-10 min-w-10 max-w-10 overflow-hidden shadow-sm`}
      >
        {config.icon}
      </div>

      <div className="flex flex-col gap-2 mx-3 flex-1">
        <span className={`text-sm font-bold ${config.titleColor}`}>
          {title}
        </span>
        {descriptions.map((desc, index) => (
          <span key={index} className={`text-xs ${config.descriptionColor}`}>
            {desc}
          </span>
        ))}
      </div>

      {dismissible && (
        <X
          onClick={() => toast.dismiss()}
          className="text-gray-500 cursor-pointer absolute top-3 right-3 hover:text-gray-700 transition-all duration-300"
          size={18}
        />
      )}
    </div>
  );
}

// Main toast functions
export const showToast = {
  success: (
    title: string,
    description?: string | string[],
    options?: { duration?: number; dismissible?: boolean }
  ) => {
    return toast(
      <ToastContent
        type={ToastTypes.SUCCESS}
        title={title}
        description={description}
        dismissible={options?.dismissible}
      />,
      {
        duration: options?.duration || 5000,
        unstyled: true,
      }
    );
  },

  error: (
    title: string,
    description?: string | string[],
    options?: { duration?: number; dismissible?: boolean }
  ) => {
    return toast(
      <ToastContent
        type={ToastTypes.ERROR}
        title={title}
        description={description}
        dismissible={options?.dismissible}
      />,
      {
        duration: options?.duration || 7000,
        unstyled: true,
      }
    );
  },

  warning: (
    title: string,
    description?: string | string[],
    options?: { duration?: number; dismissible?: boolean }
  ) => {
    return toast(
      <ToastContent
        type={ToastTypes.WARNING}
        title={title}
        description={description}
        dismissible={options?.dismissible}
      />,
      {
        duration: options?.duration || 6000,
        unstyled: true,
      }
    );
  },

  info: (
    title: string,
    description?: string | string[],
    options?: { duration?: number; dismissible?: boolean }
  ) => {
    return toast(
      <ToastContent
        type={ToastTypes.INFO}
        title={title}
        description={description}
        dismissible={options?.dismissible}
      />,
      {
        duration: options?.duration || 4000,
        unstyled: true,
      }
    );
  },

  custom: (props: ToastProps) => {
    return toast(<ToastContent {...props} />, {
      duration: props.duration || 5000,
      unstyled: true,
    });
  },
};

// Export types for external use
export { ToastTypes };
export type { ToastProps };
