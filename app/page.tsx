"use client";

import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import InitialScreen from "./components/InitialScreen";
import VariantSelectionScreen from "./components/VariantSelectionScreen";
import OnboardingSheet from "./components/OnboardingSheet";

type Variant = "A" | "B";

export default function Home() {
  const [screen, setScreen] = useState<"select" | "home" | "futures">("select");
  const [variant, setVariant] = useState<Variant>("A");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  function handleVariantSelect(v: Variant) {
    setVariant(v);
    setScreen("home");
  }

  function handleNavigateFutures() {
    if (variant === "A" && !onboardingDone) {
      // Show InitialScreen behind, then overlay onboarding on top
      setScreen("futures");
      setShowOnboarding(true);
    } else {
      setScreen("futures");
    }
  }

  function handleOnboardingDone() {
    setShowOnboarding(false);
    setOnboardingDone(true);
  }

  return (
    <main className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="relative w-[390px] h-[844px] overflow-hidden shadow-2xl">
        {screen === "select" && (
          <VariantSelectionScreen onSelect={handleVariantSelect} />
        )}
        {screen === "futures" && (
          <InitialScreen
            variant={variant}
            onNavigateHome={() => setScreen("home")}
          />
        )}
        {screen === "home" && (
          <HomeScreen variant={variant} onNavigateFutures={handleNavigateFutures} />
        )}
        {showOnboarding && (
          <OnboardingSheet onDone={handleOnboardingDone} />
        )}
      </div>
    </main>
  );
}
