"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { createContext, useContext, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

// Context for sharing state between compound components
interface ModifyDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModifyDialogContext = createContext<ModifyDialogContextValue | null>(
  null
);

const useModifyDialog = () => {
  const context = useContext(ModifyDialogContext);
  if (!context) {
    throw new Error(
      "ModifyDialog compound components must be used within ModifyDialog"
    );
  }
  return context;
};

// Root component
interface ModifyDialogProps {
  children: React.ReactNode;
}

function ModifyDialog({ children }: ModifyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <ModifyDialogContext.Provider value={{ open, setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </ModifyDialogContext.Provider>
  );
}

// Trigger component
interface ModifyDialogTriggerProps {
  children?: React.ReactNode;
  label?: string;
}

function ModifyDialogTrigger({
  children,
  label = "Edit",
}: ModifyDialogTriggerProps) {
  return (
    <DialogTrigger asChild>
      {children || (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          {label}
        </Button>
      )}
    </DialogTrigger>
  );
}

// Content wrapper
interface ModifyDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

function ModifyDialogContent({
  children,
  className = "sm:max-w-[425px]",
}: ModifyDialogContentProps) {
  return <DialogContent className={className}>{children}</DialogContent>;
}

// Header component
interface ModifyDialogHeaderProps {
  children: React.ReactNode;
}

function ModifyDialogHeader({ children }: ModifyDialogHeaderProps) {
  return <DialogHeader>{children}</DialogHeader>;
}

// Title component
interface ModifyDialogTitleProps {
  children: React.ReactNode;
}

function ModifyDialogTitle({ children }: ModifyDialogTitleProps) {
  return <DialogTitle>{children}</DialogTitle>;
}

// Description component
interface ModifyDialogDescriptionProps {
  children: React.ReactNode;
}

function ModifyDialogDescription({ children }: ModifyDialogDescriptionProps) {
  return <DialogDescription>{children}</DialogDescription>;
}

// Form component with mutation handling
interface ModifyDialogFormProps<T> {
  mutation: UseMutationResult<
    any,
    Error,
    { id: string; data: Partial<T> },
    unknown
  >;
  initialData: T & { id: string };
  children: (props: {
    onSubmit: (data: Partial<T>) => void;
    isLoading: boolean;
    initialData: T & { id: string };
  }) => React.ReactNode;
}

function ModifyDialogForm<T>({
  mutation,
  initialData,
  children,
}: ModifyDialogFormProps<T>) {
  const { setOpen } = useModifyDialog();

  const handleSubmit = (data: Partial<T>) => {
    mutation.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <>
      {children({
        onSubmit: handleSubmit,
        isLoading: mutation.isPending,
        initialData,
      })}
    </>
  );
}

// Attach compound components
ModifyDialog.Trigger = ModifyDialogTrigger;
ModifyDialog.Content = ModifyDialogContent;
ModifyDialog.Header = ModifyDialogHeader;
ModifyDialog.Title = ModifyDialogTitle;
ModifyDialog.Description = ModifyDialogDescription;
ModifyDialog.Form = ModifyDialogForm;

export { ModifyDialog };
