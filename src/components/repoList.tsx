import { api } from "~/utils/api";
import { useState } from "react";

import { Diagram } from "./diagram";
import { DiagramPage } from "./diagramPage";

type RepoProps = {
  urlRepo: string;
};

interface GithubReposType {
  id: number;
  commits_url: string;
  name: string;
}

export const RepoList = ({ urlRepo }: RepoProps) => {
  const [repoClicked, changeRepoClicked] = useState('');

  function clickedOnRepo(repoName: string) {
    changeRepoClicked(repoName);
    console.log("Clicked on repo:", repoName);
  }

  let repo = null;
  if (urlRepo) {
    repo = api.github.fetchRepos.useQuery({ linkGithub: urlRepo }).data;
  }

  const repoCapped : GithubReposType[] = [];
  if (repo) {
    repo.forEach((element) => {
      console.log(element);
    });
    if (repo.length > 5) {
      for (let i = 0; i < 5; i++) {
        const currentRepo = repo[i]; // Check each repo element
        if (currentRepo) { // Ensure the element is defined
          repoCapped.push(currentRepo);
        }
      }
    }
  }

  return (
    <>
      {repoCapped &&
        repoCapped.map((info) => (
          <div
            style={{
              width: "80%",
              borderRadius: "7px",
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: "white",
              textAlign: "center",
              fontSize: "30px",
              marginBottom: "10px",
            }}
            key={info.id}
          >
            <button
              style={{ padding: "20px" }}
              onClick={() => clickedOnRepo(info.name)} // Track which button was clicked
            >
              <p>{info.name}</p>
            </button>
          </div>
        ))}
      {repoClicked && <DiagramPage url={'https://api.github.com/repos/Oscar-gg/' + repoClicked + '/commits'}  repoName={repoClicked} ></DiagramPage>} {/* Display the clicked repo */}
    </>
  );
};
