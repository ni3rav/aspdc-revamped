"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea" // Import Textarea

interface Field {
  name: string
  label: string
  type: "text" | "textarea" | "date" | "url" | "number" | "email"
  placeholder?: string
  defaultValue?: string | number
}

interface AddDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: Field[]
  category: string
}

export function AddDataDialog({ open, onOpenChange, fields, category }: AddDataDialogProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const data: Record<string, any> = {} // eslint-disable-line
    fields.forEach((field) => {
      data[field.name] = formData.get(field.name)
    })
    console.log(`New ${category} data submitted:`, data)
    onOpenChange(false) // Close dialog after submission
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {category}</DialogTitle>
          <DialogDescription>Fill in the details for the new {category} entry.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div className="grid grid-cols-4 items-center gap-4" key={field.name}>
                <Label htmlFor={field.name} className="text-right">
                  {field.label}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue as string}
                    className="col-span-3"
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue}
                    className="col-span-3"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Add {category}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
