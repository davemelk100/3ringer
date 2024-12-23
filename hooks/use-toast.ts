import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterState = {
  toasts: ToasterToast[];
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastState: ToasterState = {
  toasts: [],
};

export function useToast() {
  function toast({ ...props }: Omit<ToasterToast, "id">) {
    const id = genId();

    const update = (props: ToasterToast) =>
      toastState.toasts.map((t) =>
        t.id === props.id ? { ...t, ...props } : t
      );

    const dismiss = (toastId: string) => {
      toastState.toasts = toastState.toasts.filter(({ id }) => id !== toastId);
    };

    toastState.toasts = [{ ...props, id }, ...toastState.toasts].slice(
      0,
      TOAST_LIMIT
    );

    return {
      id,
      dismiss: () => dismiss(id),
      update: (props: ToasterToast) => update(props),
    };
  }

  return {
    toast,
    dismiss: (toastId: string) => {
      toastState.toasts = toastState.toasts.filter(({ id }) => id !== toastId);
    },
    toasts: toastState.toasts,
  };
}
