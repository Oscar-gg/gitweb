import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env.mjs";

interface Commit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: {
      verified: boolean;
      reason: string;
      signature: string;
      payload: string;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  committer: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  parents: {
    sha: string;
    url: string;
    html_url: string;
  }[];
}


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

  getCommitTreeInfo: publicProcedure
  .input(z.object({ url: z.string() }))
  .query(async ({ input }) => {
    try {
      const response = await fetch(input.url, {
        headers: {
          'Authorization': `token ${env.GITHUB_API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const commitData = await response.json() as Commit[];
  
      const instructions = await Promise.all(commitData.map(async (commit : Commit) => {
        if (commit.parents.length > 0) {
          let commitName = commit.commit.message;
          let parentCommitName = '';
          try {
            const response = await fetch(commit.parents[0]?.url ?? '', {
              headers: {
                'Authorization': `token ${env.GITHUB_API_KEY}`
              }
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const singleCommitData = await response.json() as Commit;
            parentCommitName = singleCommitData.commit.message;
          } catch (error) {
            console.error("Failed to fetch parent commit name:", error);
          }
          
          commitName = commitName.slice(0, 20).replace(/[^a-zA-Z0-9 ]/g, '');
          parentCommitName = parentCommitName.slice(0, 20).replace(/[^a-zA-Z0-9 ]/g, '');
          // Create the instruction
          const formattedCommitName = commitName.replace(/ /g, '_');
          const formattedParentCommitName = parentCommitName.replace(/ /g, '_');
          return `${formattedParentCommitName}[${parentCommitName}] --> ${formattedCommitName}[${commitName}]`;
        }
        return null; // If no parents, return null
      }));
  
      // Filter out null values and remove duplicates
      const uniqueInstructions = [...new Set(instructions.filter(inst => inst !== null))];
      // Filter out null values and join the instructions
      const instructionsString = "graph TD" + '\n' + uniqueInstructions.join('\n');
  
      return instructionsString;
    } catch (error) {
      console.error("Failed to fetch commit data:", error);
      return null; // Return null or handle the error as needed
    }
  }),


});