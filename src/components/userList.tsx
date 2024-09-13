import { api } from "~/utils/api";
import { env } from "~/env.mjs";

export const UserList = () => {
  const { data: users } = api.user.getUserIds.useQuery();

  return (
    <>
      {users && users.length > 0 ? (
        users.map((user) => <UserCard key={user.id} id={user.id} />)
      ) : (
        <p className="text-lg text-white">
          No users found :(, Be the first to join!
        </p>
      )}
    </>
  );
};

const UserCard = ({ id }: { id: string }) => {
  const { data: user } = api.user.getUserById.useQuery({ id });

  const itemElements = [];
  let numFollowers = 0;
  if (user?.followers != null) {
    numFollowers = user?.followers;
  }
  
  // Capping the number of pfps to return to 7
  let listOfPfps = null;
  if (user != null && user.followers_url != null) {
    const { data: tempListOfPfps } = api.user.getUserPfps.useQuery({ numOfUsers: Math.min(numFollowers, 7), followersUrl: user?.followers_url });
    listOfPfps = tempListOfPfps;
  } else {
    const { data: tempListOfPfps } = api.user.getUserPfps.useQuery({ numOfUsers: Math.min(numFollowers, 7), followersUrl: "" });
    listOfPfps = tempListOfPfps;
  }
  
  for (let i = 0; i < Math.min(numFollowers, 7); i++) {
    if (listOfPfps == null) break;
    itemElements.push(
      <img  
        className="-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
        src={String(listOfPfps[i])}
        alt="Profile picture of one of the followers of a user"
      />
    );
  }

  if (numFollowers > 7) {
    itemElements[6] = 
    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      +{numFollowers - 6}
    </span>
  }



  return (
    <div className="bg-gray-200 pt-12 dark:bg-gray-700">  
      <div className="mx-auto max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900">
        <div className="border-b px-4 pb-6">
          <div className="my-4 text-center">
            <img
              className="mx-auto my-4 h-32 w-32 rounded-full border-4 border-white dark:border-gray-800"
              src={user?.image ?? env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE}
              alt="{Profile picture}"
              
            />
            <div className="py-2">
              <h3 className="mb-1 text-2xl font-bold text-gray-800 dark:text-white">
                {user?.name}
              </h3>
              <div className="inline-flex items-center text-gray-700 dark:text-gray-300">
                <svg
                  className="mr-1 h-5 w-5 text-gray-400 dark:text-gray-600"
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
          <div className="flex items-center py-4">
            <p>Joined our web on {user?.createdAt.toDateString()}</p>
          </div>

          <div className="flex gap-2 px-2">
            <button className="flex-1 rounded-full bg-blue-600 px-4 py-2 font-bold text-white antialiased hover:bg-blue-800 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-900">
              View Repositories
            </button>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-300">
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-400"
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
              <strong className="text-black dark:text-white">
                {user?.followers}
              </strong>{" "}
              Followers
            </span>
          </div>
          <div className="flex">
            <div className="mr-2 flex justify-end">
              {itemElements}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
