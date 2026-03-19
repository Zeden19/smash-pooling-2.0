"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/DateTimePicker";

interface Props {
  date: Date | undefined;
  dateError: string | null;
  maxDate?: Date;
  price: string;
  priceError: string | null;
  description: string;
  descriptionError: string | null;
  onDateChange: (date: Date | undefined) => void;
  onPriceChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBack: () => void;
  onReview: () => void;
}

function StepDetails({
  date,
  dateError,
  maxDate,
  price,
  priceError,
  description,
  descriptionError,
  onDateChange,
  onPriceChange,
  onDescriptionChange,
  onBack,
  onReview,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm uppercase tracking-wide text-muted-foreground">
          Step 4 of 5
        </div>
        <h2 className="text-lg font-semibold">Add details</h2>
        <p className="text-sm text-muted-foreground">
          Set the date/time, price, and description. The latest date is the tournament
          start time.
        </p>
      </div>
      <DateTimePicker
        error={Boolean(dateError)}
        date={date}
        setDate={onDateChange}
        maxDate={maxDate}
      />
      {dateError && <p className="text-sm text-red-500">{dateError}</p>}
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          placeholder="Carpool Price"
          min={0}
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          className={`${priceError ? "border-red-600" : ""}`}
        />
        {priceError && <p className="text-sm text-red-500">{priceError}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Carpool Description"
          maxLength={500}
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className={`${descriptionError ? "border-red-600" : ""}`}
        />
        {descriptionError && <p className="text-sm text-red-500">{descriptionError}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onReview}>Review details</Button>
      </div>
    </div>
  );
}

export default StepDetails;
