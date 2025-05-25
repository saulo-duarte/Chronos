"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AddEventForm } from "./EventForm";

export function AddEventButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Event
        </Button>
      </DialogTrigger>

      <DialogContent>
         <DialogTitle>
            Add Event
         </DialogTitle>
        <AddEventForm closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
