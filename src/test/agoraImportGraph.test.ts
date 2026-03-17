import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Agora import graph", () => {
  const onboardingStepPath = path.resolve(process.cwd(), "src/components/onboarding/ExcitementStep.tsx");
  const liveCallPath = path.resolve(process.cwd(), "src/pages/LiveCall.tsx");
  const onboardingStepSource = fs.readFileSync(onboardingStepPath, "utf8");
  const liveCallSource = fs.readFileSync(liveCallPath, "utf8");

  it("keeps the onboarding step free of the Agora hook", () => {
    expect(onboardingStepSource).not.toContain("useAgoraCall");
    expect(onboardingStepSource).not.toContain("agora-demo-token");
  });

  it("keeps the live call route wired to the Agora hook", () => {
    expect(liveCallSource).toContain('from "@/hooks/useAgoraCall"');
  });
});
