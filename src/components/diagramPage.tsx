import { api } from "~/utils/api";
import { Diagram } from "./diagram";

type DiagramProps = {
    url: string;
    repoName: string;
  };

export const DiagramPage = ({url, repoName} : DiagramProps) => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
            Diagrama de <span className="text-[hsl(280,100%,70%)]">{repoName}</span></h2>
            <div className="flex flex-row items-center gap-2 flex-wrap justify-center">
            <Diagram url={url}height = {1000} width = {1000}/>
            </div>
        </div>
      </main>
    </>
  );
};


