"use client";

import dynamic from "next/dynamic";
import { visualConfig } from "@/config/visualConfig";

// Three.js не должен попадать в критический путь рендера Hero.
const RobotCanvas = dynamic(() => import("./RobotCanvas").then((mod) => mod.RobotCanvas), {
  ssr: false,
});

export function StaticRobot() {
  if (!visualConfig.showRobot) return null;
  return <RobotCanvas />;
}
