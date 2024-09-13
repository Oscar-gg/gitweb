import { api } from "~/utils/api";

type repoListProps = {
  user: string;
};

export const RepoList = ({ user } : repoListProps) => {
    const id = "hi";
    const thing = api.github.fetchRepos.useQuery({ text: id });
    console.log(thing);

    return (
        <>
          <p>here</p>
        </>
      );
};