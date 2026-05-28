/**
 * Usage page — redirects to payments with a notice banner.
 */
import { redirect } from "next/navigation";

export default function UsagePage() {
  redirect("/dashboard/payments");
}
