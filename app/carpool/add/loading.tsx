import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mapSize } from "@/components/GoogleMap";

function loading() {
  return (
    <>
      <div className={"flex flex-row gap-5 space-x-6 justify-start ms-5 my-3"}>
        <Skeleton>
          <Input className={"w-96"} disabled />
        </Skeleton>

        <Skeleton>
          <Input className={"w-96"} disabled />
        </Skeleton>

        <Skeleton>
          <Button disabled>
            <div className={"invisible"}>Get route</div>
          </Button>
        </Skeleton>

        <Skeleton>
          <Button disabled>
            <div className={"invisible"}>Add Carpool</div>
          </Button>
        </Skeleton>
      </div>
      <Skeleton style={mapSize} className={"mx-8"} />
    </>
  );
}

export default loading;
