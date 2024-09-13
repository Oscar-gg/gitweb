import { api } from "~/utils/api";
import { useSearchParams } from "next/navigation";

export const RepoList = () => {
    const searchParams = useSearchParams();
    const user = searchParams.get("name");
    const { data: repo } = api.github.fetchRepos.useQuery({linkGithub: user});
    console.log(repo);

    return (
        <>
        </>
      );
};