import { api } from "~/utils/api";

export const RepoList = (urlRepo: {urlRepo: string}) => {
  let repo;
  if (urlRepo) {
    repo = api.github.fetchRepos.useQuery({ linkGithub: urlRepo.urlRepo });
  }
  console.log(repo.data);

  if (repo.data) {
    repo.data.forEach((element) => {
      console.log(element);
    });
  }

  return (
    <>
      {repo.data &&
        repo.data.map((info) => (
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
