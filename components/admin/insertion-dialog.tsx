"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { createContext, useContext, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface InsertionDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const InsertionDialogContext =
  createContext<InsertionDialogContextValue | null>(null);

const useInsertionDialogContext = () => {
  const context = useContext(InsertionDialogContext);
  if (!context) {
    throw new Error(
      "InsertionDialog compound components must be used within InsertionDialog"
    );
  }
  return context;
};

interface InsertionDialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function InsertionDialog({
  children,
  defaultOpen = false,
}: InsertionDialogProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <InsertionDialogContext.Provider value={{ open, setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </InsertionDialogContext.Provider>
  );
}

interface TriggerProps {
  children?: React.ReactNode;
  label?: string;
  asChild?: boolean;
}

function Trigger({ children, label = "Add New", asChild }: TriggerProps) {
  return (
    <DialogTrigger asChild={asChild}>
      {children || (
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {label}
        </Button>
      )}
    </DialogTrigger>
  );
}

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

function Content({ children, className = "sm:max-w-[425px]" }: ContentProps) {
  return <DialogContent className={className}>{children}</DialogContent>;
}

function Header({ children }: { children: React.ReactNode }) {
  return <DialogHeader>{children}</DialogHeader>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <DialogTitle>{children}</DialogTitle>;
}

function Description({ children }: { children: React.ReactNode }) {
  return <DialogDescription>{children}</DialogDescription>;
}

interface FormProps<T> {
  mutation: UseMutationResult<any, Error, T, unknown>;
  onSuccess?: (data: T) => void;
  children: (props: {
    onSubmit: (data: T) => void;
    isLoading: boolean;
  }) => React.ReactNode;
}

function Form<T>({ mutation, onSuccess, children }: FormProps<T>) {
  const { setOpen } = useInsertionDialogContext();

  const handleSubmit = (data: T) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        onSuccess?.(data);
      },
    });
  };

  return (
    <>
      {children({
        onSubmit: handleSubmit,
        isLoading: mutation.isPending,
      })}
    </>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <DialogFooter>{children}</DialogFooter>;
}

function CancelButton({
  children = "Cancel",
  onClick,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const { setOpen } = useInsertionDialogContext();

  return (
    <Button
      variant="outline"
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </Button>
  );
}

function SubmitButton({
  children = "Create",
  onClick,
  disabled,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

InsertionDialog.Trigger = Trigger;
InsertionDialog.Content = Content;
InsertionDialog.Header = Header;
InsertionDialog.Title = Title;
InsertionDialog.Description = Description;
InsertionDialog.Form = Form;
InsertionDialog.Footer = Footer;
InsertionDialog.CancelButton = CancelButton;
InsertionDialog.SubmitButton = SubmitButton;

export { InsertionDialog };
