import { api } from "~/utils/api";
import { Diagram } from "./diagram";

type DiagramProps = {
    url: string;
    repoName: string;
  };

export const DiagramPage = ({url, repoName} : DiagramProps) => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Diagrama  de  <span className="text-[hsl(280,100%,70%)]">{repoName}</span></h2>
            <div className="flex space-x-4">
               <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white transition-transform transform hover:scale-105 hover:shadow-xl">
                    Go back to Repos
                </button>
                <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white transition-transform transform hover:scale-105 hover:shadow-xl">
                    Go back to Start
                </button>
            </div>
            <div className="flex flex-row items-center gap-2 flex-wrap justify-center">
            <Diagram url={url}height = {1000} width = {1000}/>
            </div>
        </div>
      </main>
    </>
  );
};


