"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/app/_components/LoadingSpinner";

interface Props {
  tournamentUrl: string;
  tournamentError: string | null;
  loadingTournament: boolean;
  canConfirm: boolean;
  onTournamentChange: (value: string) => void;
  onSetTournament: () => void;
  onConfirm: () => void;
  onBack: () => void;
}

function StepTournament({
  tournamentUrl,
  tournamentError,
  loadingTournament,
  canConfirm,
  onTournamentChange,
  onSetTournament,
  onConfirm,
  onBack,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm uppercase tracking-wide text-muted-foreground">
          Step 2 of 5
        </div>
        <h2 className="text-lg font-semibold">Select a tournament</h2>
        <p className="text-sm text-muted-foreground">
          Paste the start.gg tournament URL. We’ll drop a second marker at the venue
          location.
        </p>
      </div>
      <div>
        <Label htmlFor="tournament">Tournament</Label>
        <Input
          id="tournament"
          value={tournamentUrl}
          onChange={(event) => onTournamentChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSetTournament();
            }
          }}
          className={`${tournamentError ? "border-red-600" : ""}`}
          placeholder="start.gg URL"
        />
        {tournamentError && <p className="text-sm text-red-500">{tournamentError}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="secondary"
          disabled={!tournamentUrl.trim() || loadingTournament}
          onClick={onSetTournament}>
          Set on map
          {loadingTournament && <LoadingSpinner />}
        </Button>
        <Button disabled={!canConfirm || loadingTournament} onClick={onConfirm}>
          Confirm tournament
        </Button>
      </div>
    </div>
  );
}

export default StepTournament;
