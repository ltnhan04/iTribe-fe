import { Spinner } from "@/components/ui/spinner";
import { Html } from "@react-three/drei";
import React from "react";

export default function Loader() {
  return (
    <Html>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <Spinner className="text-white" size={"large"} />
      </div>
    </Html>
  );
}
