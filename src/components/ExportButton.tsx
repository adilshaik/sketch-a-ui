import React, { useState } from 'react'
import { useEditor } from '@tldraw/tldraw';
import { getSvgAsImage } from '@/lib/getSvgAsImage';
import { blobToBase64 } from '@/lib/blobToBase64';
import { Loading } from './Loading';

export const ExportButton = ({setHtml} : {setHtml : (html: string) => void}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const editor = useEditor();

    const handleClick = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            e.preventDefault();
            const svg = await editor.getSvgElement(Array.from(editor.getCurrentPageShapeIds()))
        
            if(!svg) return;
            
            const png = await getSvgAsImage(svg?.svg, {
              type: "png",
              quality: 1,
              scale: 1,
            });

            const dataUrl = await blobToBase64(png!);

            const resp = await fetch("/api/generateHTML", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ dataUrl }),
            });

            const data = await resp.json();
  
            if (data.error) {
              alert("Error from Gemini: " + JSON.stringify(data.error));
              return;
            }
  
            const start = data.indexOf("<!DOCTYPE html>");
            const end = data.indexOf("</html>");
            const html = data.slice(start, end + "</html>".length);
            setHtml(html);
          } finally {
            setLoading(false);
          }
    }

  return (
    <button onClick={(e) => handleClick(e)} style={{zIndex: "1000"}} className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>
        {loading ? <Loading/> : "Draw UI"}
    </button>
  )
}
