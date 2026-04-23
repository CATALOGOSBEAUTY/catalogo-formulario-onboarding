/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Layout } from "@/src/modules/Layout";
import { HeroBanner } from "@/src/modules/Hero";
import { OnboardingForm } from "@/src/modules/OnboardingForm";

export default function App() {
  React.useEffect(() => {
    document.title = "Sistematize";
  }, []);

  return (
    <Layout>
      <div className="w-full relative">
        <HeroBanner />
        <OnboardingForm />
      </div>
    </Layout>
  );
}
