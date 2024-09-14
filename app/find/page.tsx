"use client";
import GoogleMap from "@/components/GoogleMap";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { slug as getSlug } from "@/app/services/startggClient";
import FailureToast from "@/components/FailureToast";
import SuccessToast from "@/components/SuccessToast";

function FindCarpoolPage() {
  async function getCarpools(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const slug = getSlug(form.url.value);
    if (!slug) {
      toast({
        title: (
          <>
            <XCircle /> Tournament not Found
          </>
        ),
        variant: "destructive",
        description: "Make sure your URL is correct",
      });
      return;
    }

    try {
      const { data } = await axios.get(`/api/carpool/find/${slug}`);
      SuccessToast("Successfully Found Carpools");
    } catch (e: any) {
      FailureToast(e.response.data.error);
    }
  }

  return (
    <>
      <div className={"flex gap-5 space-x-6 justify-start ms-5 my-3"}>
        <form onSubmit={(event) => getCarpools(event)}>
          <Input id={"url"} className={"w-96"} placeholder={"TournamentURL"} />
        </form>
      </div>
      <GoogleMap />
    </>
  );
}

export default FindCarpoolPage;
