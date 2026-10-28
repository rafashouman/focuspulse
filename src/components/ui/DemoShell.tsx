"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export const DEMO_CONTENT_ID = "conteudo";

export default function DemoShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="demo-shell">
        <a href={`#${DEMO_CONTENT_ID}`} className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
      </div>
    </MotionConfig>
  );
}
