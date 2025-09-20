import { LightBulbIcon } from "@heroicons/react/24/solid";
export default function Home() {
  return (
    <div className="w-full flex flex-col align-center justify-center p-4 m-auto text-center">
      <h1 className="m-auto inline-flex items-center gap-2 text-4xl font-bold text-amber-500 ">
        Hello Photon!
        <LightBulbIcon className="size-8" />
      </h1>
    </div>
  );
}
