import { api } from "~/utils/api";

type repoListProps = {
  user: string;
};

export const RepoList = ({ user } : repoListProps) => {
    const { data: repo } = api.github.fetchRepos.useQuery({linkGithub: "https://api.github.com/users/Oscar-gg/repos"});
    console.log(repo);

    return (
        <>
        </>
      );
};