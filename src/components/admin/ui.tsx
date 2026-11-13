"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

export function Submit({ children, className = "btn btn-primary" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Bezig" : children}
    </button>
  );
}

/** Formulier dat een server action aanroept en de foutmelding toont. */
export function ActionForm({
  action,
  children,
  className,
  resetOnOk,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  className?: string;
  resetOnOk?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className={className} key={resetOnOk && state.ok ? "ok" : "form"}>
      {children}
      {state.error && (
        <p className="field-error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function ConfirmButton({
  action,
  message,
  children,
  disabled,
}: {
  action: () => Promise<void>;
  message: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <button type="submit" disabled={disabled} className="text-sm text-[#9a3b33] underline underline-offset-4 disabled:opacity-40 disabled:no-underline">
        {children}
      </button>
    </form>
  );
}
