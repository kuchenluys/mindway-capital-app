import React from 'react';
import { Toaster, toast } from 'sonner';

export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      expand
      visibleToasts={3}
    />
  );
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (id?: string | number) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

export default ToastProvider;
