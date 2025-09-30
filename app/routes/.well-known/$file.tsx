import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // Return empty JSON to satisfy any request
  return Response.json({});
};

export default function WellKnownFile() {
  // No UI needed
  return null;
}
