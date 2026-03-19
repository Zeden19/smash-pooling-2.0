"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import type { RouteOption } from "@/app/carpool/add/types";

interface Props {
  originName?: string;
  destinationName?: string;
  tournamentStartAt?: Date | null;
  selectedRouteIndex: number | null;
  selectedRoute?: RouteOption | null;
  date?: Date;
  price: string;
  description: string;
  addingCarpool: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

function StepReview({
  originName,
  destinationName,
  tournamentStartAt,
  selectedRouteIndex,
  selectedRoute,
  date,
  price,
  description,
  addingCarpool,
  onBack,
  onSubmit,
}: Props) {
  const priceValue = price.trim() === "" ? 0 : Number(price);
  const safePrice = Number.isFinite(priceValue) ? priceValue : 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm uppercase tracking-wide text-muted-foreground">
          Step 5 of 5
        </div>
        <h2 className="text-lg font-semibold">Review & confirm</h2>
        <p className="text-sm text-muted-foreground">
          Double-check everything before creating your carpool.
        </p>
      </div>
      <div className="grid gap-3 text-sm">
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="text-xs uppercase text-muted-foreground">Origin</div>
          <div className="font-medium">{originName ?? "Not set"}</div>
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="text-xs uppercase text-muted-foreground">Tournament</div>
          <div className="font-medium">{destinationName ?? "Not set"}</div>
          {tournamentStartAt && (
            <div className="text-xs text-muted-foreground">
              Starts {tournamentStartAt.toLocaleString()}
            </div>
          )}
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="text-xs uppercase text-muted-foreground">Route</div>
          <div className="font-medium">
            {selectedRoute?.summary ??
              (selectedRouteIndex != null
                ? `Route ${selectedRouteIndex + 1}`
                : "Not set")}
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedRoute?.distance ?? "Unknown"} ·{" "}
            {selectedRoute?.duration ?? "Unknown"}
          </div>
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="text-xs uppercase text-muted-foreground">Date & time</div>
          <div className="font-medium">{date ? date.toLocaleString() : "Not set"}</div>
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="text-xs uppercase text-muted-foreground">Price</div>
          <div className="font-medium">{safePrice > 0 ? `$${safePrice}` : "Free"}</div>
        </div>
        <div className="rounded border border-border/60 bg-muted/20 p-3">
          <div className="text-xs uppercase text-muted-foreground">Description</div>
          <div className="font-medium">
            {description.trim().length ? description.trim() : "None"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button disabled={addingCarpool} onClick={onSubmit}>
          Add Carpool
          {addingCarpool && <LoadingSpinner />}
        </Button>
      </div>
    </div>
  );
}

export default StepReview;
