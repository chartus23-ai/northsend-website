import type { Metadata } from "next";
import RoiCalculator from "./RoiCalculator";

export const metadata: Metadata = {
  title: "ROI calculator — NorthSend",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RoiCalculator />;
}
