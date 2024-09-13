import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import PulseLoader from "react-spinners/PulseLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const UserList = ({ onChange }: { onChange: (urlRepos: string) => void }) => {
  const { data: users, isLoading } = api.user.getUserIds.useQuery();

  return (
    <>
      {isLoading && (
        <div>
          <PulseLoader color="white" />
          <p className="text-white">Loading...</p>
        </div>
      )}
      {users &&
        users.length > 0 &&
        users.map((user) => <UserCard key={user.id} id={user.id} onChangeFunc={onChange} />)}
    </>
  );
};

const UserCard = ({ id, onChangeFunc }: { id: string, onChangeFunc: (urlRepos: string) => void }) => {
  const { data: user } = api.user.getUserById.useQuery({ id });
  const session = useSession();
  const router = useRouter();

  function removeParentheses(str : string) {
    return str.replace(/\s*\(.*?\)\s*/g, '');
  }

  const mutate = api.user.deleteUserById.useMutation({
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      alert("You have deleted your profile.");
      router.refresh();
    },
  });

  const bioCropped = (user?.bio?.slice(0, 40) ?? "") + "...";

  const itemElements = [];
  let numFollowers = 0;
  if (user?.followers != null) {
    numFollowers = user?.followers;
  }

  // Capping the number of pfps to return to 7
  let listOfPfps = null;
  if (user != null && user.followers_url != null) {
    const { data: tempListOfPfps } = api.user.getUserPfps.useQuery({
      numOfUsers: Math.min(numFollowers, 7),
      followersUrl: user?.followers_url,
    });
    listOfPfps = tempListOfPfps;
  } else {
    const { data: tempListOfPfps } = api.user.getUserPfps.useQuery({
      numOfUsers: Math.min(numFollowers, 7),
      followersUrl: "",
    });
    listOfPfps = tempListOfPfps;
  }

  for (let i = 0; i < Math.min(numFollowers, 7); i++) {
    if (listOfPfps == null) break;
    itemElements.push(
      <img
        key={i}
        className="-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
        src={String(listOfPfps[i])}
        alt="Profile picture of one of the followers of a user"
      />
    );
  }

  if (numFollowers > 7) {
    itemElements[6] = (
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        +{numFollowers - 6}
      </span>
    );
  }

  return (
    <div className="flex flex-col bg-gray-300">
      {session.data?.user.id === user?.id && (
        <button
          className="m-2 rounded-lg bg-red-600 p-2 font-bold text-white"
          onClick={() => {
            if (confirm("Are you sure you want to delete your profile?")) {
              mutate.mutate();
            }
          }}
        >
          Delete Profile
        </button>
      )}
      <div className="mx-auto max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ">
        <div className="border-b px-4 pb-6">
          <div className="my-4 text-center">
            <img
              className="mx-auto my-4 h-32 w-32 rounded-full border-4 border-white"
              src={user?.image ?? env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE}
              alt="Profile picture"
            />
            <div className="py-2">
              <h3 className="mb-1 text-2xl font-bold text-gray-800 ">
                {user?.name}
              </h3>
              <div className="inline-flex items-center text-gray-700 ">
                <svg
                  className="mr-1 h-5 w-5 text-gray-400 "
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    className=""
                    d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                  />
                </svg>
                {user?.location}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-4 py-4">
            <p>Bio: {bioCropped}</p>
            <p>Joined our web on {user?.createdAt.toDateString()}</p>
            <p>Last login on {removeParentheses(user?.lastLogin?.toTimeString() ?? "")}</p>
          </div>

          <div className="flex gap-2 px-2">
            <button
              className="flex-1 rounded-full bg-blue-600 px-4 py-2 font-bold text-white antialiased hover:bg-blue-800"
              onClick={() => {
                console.log(onChangeFunc);
                onChangeFunc(user?.repos ?? '');
              }}
            >
              View Repositories
            </button>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="mb-4 flex items-center gap-2 text-gray-800 ">
            <svg
              className="h-6 w-6 text-gray-600 "
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                className=""
                d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
              />
            </svg>
            <span>
              <strong className="text-black ">{user?.followers}</strong>{" "}
              Followers
            </span>
          </div>
          <div className="flex">
            <div className="mr-2 flex justify-end">{itemElements}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
