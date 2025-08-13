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
import { Trash2 } from "lucide-react";

interface DeleteDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DeleteDialogContext = createContext<DeleteDialogContextValue | null>(
  null
);

const useDeleteDialogContext = () => {
  const context = useContext(DeleteDialogContext);
  if (!context) {
    throw new Error(
      "DeleteDialog compound components must be used within DeleteDialog"
    );
  }
  return context;
};

interface DeleteDialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function DeleteDialog({ children, defaultOpen = false }: DeleteDialogProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <DeleteDialogContext.Provider value={{ open, setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </DeleteDialogContext.Provider>
  );
}

interface TriggerProps {
  children?: React.ReactNode;
  label?: string;
  asChild?: boolean;
}

function Trigger({ children, label = "Delete", asChild }: TriggerProps) {
  return (
    <DialogTrigger asChild={asChild}>
      {children || (
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
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

interface ConfirmationProps {
  mutation: UseMutationResult<any, Error, string, unknown>;
  itemId: string;
  itemName?: string;
  onSuccess?: () => void;
  customMessage?: string;
}

function Confirmation({
  mutation,
  itemId,
  itemName = "item",
  onSuccess,
  customMessage,
}: ConfirmationProps) {
  const { setOpen } = useDeleteDialogContext();

  const handleDelete = () => {
    mutation.mutate(itemId, {
      onSuccess: () => {
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <>
      <DialogDescription>
        {customMessage ||
          `Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
      </DialogDescription>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
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
  const { setOpen } = useDeleteDialogContext();

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

function DeleteButton({
  children = "Delete",
  onClick,
  disabled,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button variant="destructive" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

DeleteDialog.Trigger = Trigger;
DeleteDialog.Content = Content;
DeleteDialog.Header = Header;
DeleteDialog.Title = Title;
DeleteDialog.Description = Description;
DeleteDialog.Confirmation = Confirmation;
DeleteDialog.Footer = Footer;
DeleteDialog.CancelButton = CancelButton;
DeleteDialog.DeleteButton = DeleteButton;

export { DeleteDialog };
