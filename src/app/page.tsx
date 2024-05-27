'use client'

import "@tldraw/tldraw/tldraw.css";

import dynamic from "next/dynamic";
import ReactDOM from "react-dom";
import { useState } from "react";

import { ExportButton } from "@/components/ExportButton";
import { PreviewModal } from "@/components/PreviewModal";

const Tldraw = dynamic(() => import("@tldraw/tldraw").then(mod => mod.Tldraw), {
  ssr: false
})

export default function Home() {
  const [html, setHtml] = useState<null | string>(null);
  return (
    <>
      <div className="w-screen h-screen">
        <Tldraw persistenceKey="tldraw">
          <ExportButton setHtml={setHtml} />
        </Tldraw>
      </div>
      {html &&
        ReactDOM.createPortal(
          <div
            className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
            style={{ zIndex: 2000, backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setHtml(null)}
          >
            <PreviewModal html={html} setHtml={setHtml} />
          </div>,
          document.body
        )}
    </>
  );
}
