import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const diagramRouter = createTRPCRouter({
  fetchSvgPost: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      try {
        let response = await fetch("https://kroki.io/mermaid/svg", {
          method: 'POST',
          body: input.text,
        });
        // Trying to fetch 50 times because the api is not very reliable
        for (let i = 0; i < 50; i++) {
          if (response.ok) break;
          response = await fetch("https://kroki.io/mermaid/svg", {
            method: 'POST',
            body: input.text,
          });
          // Wait 100 ms
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        // The response is SVG content in text format
        const svgContent = await response.text();
        return svgContent;
      } catch (error) {
        console.error("Error fetching SVG:", error);
        return "";
      }
    }),
});