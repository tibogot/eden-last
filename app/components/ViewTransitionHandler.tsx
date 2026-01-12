"use client";

import { useEffect } from "react";

export default function ViewTransitionHandler() {
  useEffect(() => {
    // Listen for view transition completion
    const handleViewTransitionStart = () => {
      window.dispatchEvent(new Event("pageTransitionStart"));
    };

    const handleViewTransitionEnd = () => {
      // Dispatch the same event that PushOverNav dispatches
      // so ScrollTrigger-based animations can initialize
      window.dispatchEvent(new Event("pageTransitionComplete"));
    };

    // Check if the browser supports View Transitions API
    if (typeof window !== "undefined" && "startViewTransition" in document) {
      // Create a MutationObserver to detect when view transitions are happening
      const observer = new MutationObserver(() => {
        // Check if a view transition is active by looking for the pseudo-elements
        const isTransitioning =
          document.documentElement.classList.contains("view-transition");

        if (isTransitioning) {
          handleViewTransitionStart();
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // Also listen for navigation end to dispatch completion event
      const handleNavigationComplete = () => {
        // Small delay to ensure DOM is settled
        setTimeout(handleViewTransitionEnd, 100);
      };

      // Listen for when navigation completes
      window.addEventListener("popstate", handleNavigationComplete);

      // For programmatic navigation, we need to hook into next-view-transitions
      // The library dispatches events we can listen to
      const handleRouteChange = () => {
        setTimeout(handleViewTransitionEnd, 100);
      };

      // Listen for route changes
      window.addEventListener("routeChangeComplete", handleRouteChange);

      return () => {
        observer.disconnect();
        window.removeEventListener("popstate", handleNavigationComplete);
        window.removeEventListener("routeChangeComplete", handleRouteChange);
      };
    }
  }, []);

  return null;
}
