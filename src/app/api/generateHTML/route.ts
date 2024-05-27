import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    try {
        const { dataUrl } = await request.json();

        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = "You are an expert tailwind developer. I provided you a low-fidelity wireframe of an application, can you return a single html file that uses tailwind to create the website very professional and beautiful. Respond only with the html file. Do not use style tag or link tag for CSS and return whole html.";

        const image = {
            inlineData: {
                data: base64Data,
                mimeType: "image/png",
            },
        };

        const result = await model.generateContent([prompt, image]);

        const textResponse = result.response.text();

        return new Response(JSON.stringify(textResponse), {
            headers: {
              "content-type": "application/json; charset=UTF-8",
            },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(error), {
            headers: {
              "content-type": "application/json; charset=UTF-8",
            },
        });
    }
}
