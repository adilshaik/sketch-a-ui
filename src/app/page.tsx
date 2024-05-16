'use client'

import "@tldraw/tldraw/tldraw.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const Tldraw = dynamic(() => import("@tldraw/tldraw").then(mod => mod.Tldraw), {
  ssr: false
})

export default function Home() {
  const [html, setHtml] = useState<null | string>(null);
  return (
    <>
      <div className="w-screen h-screen">
        <Tldraw persistenceKey="tldraw">
        </Tldraw>
      </div>
    </>
  );
}
