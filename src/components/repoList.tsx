import { api } from "~/utils/api";

type RepoProps = {
  urlRepo: string;
};

export const RepoList = ({urlRepo} : RepoProps) => {
  let repo = null;
  if (urlRepo) {
    repo = api.github.fetchRepos.useQuery({ linkGithub: urlRepo }).data;
  }

  if (repo) {
    repo.forEach((element) => {
      console.log(element);
    });
  }

  return (
    <>
      {repo &&
        repo.map((info) => (
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
              padding: "20px",
              fontSize: "30px",
            }}
            key = {info.id}
          >
            <p>{info.name}</p>
          </div>
        ))}
    </>
  );
};
