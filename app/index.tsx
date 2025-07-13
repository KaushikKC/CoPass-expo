import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to onboarding when the app starts
  return <Redirect href="/onboarding" />;
}
