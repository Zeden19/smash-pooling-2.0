"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";

interface Props {
  originInput: string;
  originError: string | null;
  loadingOrigin: boolean;
  canConfirm: boolean;
  onOriginChange: (value: string) => void;
  onSetOrigin: () => void;
  onConfirm: () => void;
}

function StepOrigin({
  originInput,
  originError,
  loadingOrigin,
  canConfirm,
  onOriginChange,
  onSetOrigin,
  onConfirm,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm uppercase tracking-wide text-muted-foreground">
          Step 1 of 5
        </div>
        <h2 className="text-lg font-semibold">Choose an origin</h2>
        <p className="text-sm text-muted-foreground">
          Enter the starting location for your carpool. We’ll place a marker and center
          the map on it.
        </p>
      </div>
      <div>
        <Label htmlFor="origin">Starting Location</Label>
        <Input
          id="origin"
          value={originInput}
          onChange={(event) => onOriginChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSetOrigin();
            }
          }}
          className={`${originError ? "border-red-600" : ""}`}
          placeholder="From"
        />
        {originError && <p className="text-sm text-red-500">{originError}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={!originInput.trim() || loadingOrigin}
          onClick={onSetOrigin}>
          Set on map
          {loadingOrigin && <LoadingSpinner />}
        </Button>
        <Button disabled={!canConfirm || loadingOrigin} onClick={onConfirm}>
          Confirm origin
        </Button>
      </div>
    </div>
  );
}

export default StepOrigin;
