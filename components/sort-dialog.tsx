"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type SortOption = {
  field: string
  direction: "asc" | "desc"
}

type SortDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplySort: (sort: SortOption) => void
  currentSort: SortOption
}

export function SortDialog({ open, onOpenChange, onApplySort, currentSort }: SortDialogProps) {
  const [sort, setSort] = useState<SortOption>(currentSort)

  const handleApply = () => {
    onApplySort(sort)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sort Applications</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Sort By</Label>
            <RadioGroup value={sort.field} onValueChange={(value) => setSort({ ...sort, field: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="created_at" id="created_at" />
                <Label htmlFor="created_at">Date Applied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="name" />
                <Label htmlFor="name">Name</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="match_score" id="match_score" />
                <Label htmlFor="match_score">Match Score</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="status" id="status" />
                <Label htmlFor="status">Status</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Direction</Label>
            <RadioGroup
              value={sort.direction}
              onValueChange={(value) => setSort({ ...sort, direction: value as "asc" | "desc" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="desc" />
                <Label htmlFor="desc">Descending (Newest/Highest first)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="asc" />
                <Label htmlFor="asc">Ascending (Oldest/Lowest first)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

