"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";
import { routeColors, selectedRouteColor } from "@/app/carpool/_maps/mapConfig";
import { hexToRgba } from "@/app/carpool/add/utils";
import type { RouteOption } from "@/app/carpool/add/types";

interface Props {
  routes: RouteOption[];
  selectedRouteIndex: number | null;
  routesError: string | null;
  loadingRoutes: boolean;
  onSelectRoute: (index: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

function StepRoute({
  routes,
  selectedRouteIndex,
  routesError,
  loadingRoutes,
  onSelectRoute,
  onConfirm,
  onBack,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm uppercase tracking-wide text-muted-foreground">
          Step 3 of 5
        </div>
        <h2 className="text-lg font-semibold">Pick a route</h2>
        <p className="text-sm text-muted-foreground">
          Click a route on the map or choose from the list below. The selected route will
          be highlighted.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {loadingRoutes && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Loading routes <LoadingSpinner />
          </div>
        )}
        {routesError && <p className="text-sm text-red-500">{routesError}</p>}
        {routes.length > 0 && (
          <div className="flex flex-col gap-2">
            {routes.map((route, index) => {
              const isSelected = selectedRouteIndex === index;
              const baseColor = isSelected
                ? selectedRouteColor
                : routeColors[index % routeColors.length];
              return (
                <button
                  key={`${route.polyline}-${index}`}
                  type="button"
                  onClick={() => onSelectRoute(index)}
                  className={`flex items-center justify-between rounded border px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? "border-green-500 bg-green-500/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: hexToRgba(baseColor, 0.14) }}>
                  <span>{route.summary ?? `Route ${index + 1}`}</span>
                  <span className="text-muted-foreground">
                    {route.distance ?? "Unknown"} · {route.duration ?? "Unknown"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirm}>Confirm route</Button>
      </div>
    </div>
  );
}

export default StepRoute;
