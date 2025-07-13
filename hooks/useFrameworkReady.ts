import { useEffect } from "react";

export function useFrameworkReady() {
  useEffect(() => {
    // Framework ready logic for React Native
    // This can be used for any initialization that needs to happen when the app starts
    console.log("Framework ready");
  }, []);
}
