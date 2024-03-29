import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchIsFollowed, followUser } from "../../stores/user/UserActions";
import { config } from "../../constants";
import { encodeQuery } from "../../utils";
import { isEmpty } from "lodash";
import { toast } from "react-hot-toast";

interface Post {
  id: number;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
}

function UserResult({ user, refetch }: any) {
  const dispatch = useAppDispatch();
  const { authUser } = useAppSelector((state) => state.authUserReducer);
  const [isFollowed, setIsFollowed] = useState<boolean>();

  useEffect(() => {
    followed();
  }, []);

  const handleFollowUser = async (userId: any) => {
    if (authUser?.id !== userId) {
      await dispatch(
        followUser({
          user_id: userId,
        })
      ).then(() => {
        setIsFollowed(!isFollowed);
      });
    }
  };

  const followed = async () => {
    await dispatch(fetchIsFollowed(user?.id)).then((res) => {
      setIsFollowed(res.value);
    });
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-center space-x-3">
        <Link
          href={{
            pathname: "/dashboard/profile",
            query: { user_id: user?.id },
          }}
          as={`/dashboard/profile?${encodeQuery(user?.id, "profile")}`}
          className="flex items-center justify-center"
        >
          <img
            src={
              !isEmpty(user?.profilePic)
                ? `${config.url.PUBLIC_URL}/${user?.profilePic?.name}`
                : "/images/pfp/pfp1.jpg"
            }
            className="rounded-md w-12 h-12 bg-blockd object-cover"
          />
        </Link>
        <div className="flex flex-col items-start justify-center space-y-2">
          <div className="flex flex-col items-start justify-center">
            <Link
              href={{
                pathname: "/dashboard/profile",
                query: { user_id: user?.id },
              }}
              as={`/dashboard/profile?${encodeQuery(user?.id, "profile")}`}
              className="text-sm font-bold cursor-pointer hover:underline"
            >
              @{user?.name}
            </Link>
            {/* <span className='text-l text-gray-700 dark:text-gray-300'>10K followers</span> */}
          </div>
          {/* <span className='text-l text-gray-700 dark:text-gray-300'>20 Friends in common</span> */}
        </div>
      </div>
      {authUser?.id !== user?.id && (
        <div className="flex items-center justify-center">
          <p
            className="cursor-pointer text-sm p-2 px-6 rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 dark:bg-orange-500 hover:dark:bg-orange-600 dark:text-white font-semibold"
            onClick={() => handleFollowUser(user?.id)}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </p>
        </div>
      )}
    </div>
  );
}

export default UserResult;
