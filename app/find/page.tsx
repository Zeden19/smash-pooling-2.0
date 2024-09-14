"use client";
import GoogleMap from "@/components/GoogleMap";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { slug as getSlug } from "@/app/services/startggClient";

function findCarpoolPage() {
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
      toast({
        title: (
          <>
            <CheckCircle /> Successfully Found Carpools
          </>
        ),
        variant: "success",
      });
    } catch (e: any) {
      toast({
        title: (
          <>
            <XCircle /> {e.response.data.error}
          </>
        ),
        variant: "destructive",
      });
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

export default findCarpoolPage;
