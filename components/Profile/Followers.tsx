import React, { useEffect } from 'react'
import {
  ArrowSmallRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { fetchFollowers } from '../../stores/user/UserActions';
import { isEmpty } from 'lodash';
import { config } from '../../constants';
import CustomLoadingOverlay from '../CustomLoadingOverlay';
import { toast } from 'react-hot-toast';
import { encodeQuery } from '../../utils';

function Followers({ user }: any) {
  const dispatch = useAppDispatch();
  const {
    followers,
    isFetchingFollowers,
    error
  } = useAppSelector((state) => state.userReducer);

  // useEffect(() => {
  //   if (!isEmpty(error)) {
  //     toast.error(error);
  //   }
  // }, [error]);

  useEffect(() => {
    fetchUserFollowers();
  }, []);

  const fetchUserFollowers = async () => {
    await dispatch(fetchFollowers(user?.id));
  }

  return (
    <div className="relative">
      <CustomLoadingOverlay active={isFetchingFollowers} wrapped={true} />
      {
        !isEmpty(followers) &&
        followers.map((follower: any, index: any) => (
          <div role="list" className="divide-y divide-slate-200 dark:divide-lightgray" key={index}>
            <Link
              href={{
                pathname: "/dashboard/profile",
                query: { user_id: follower?.otherUser2?.id },
              }}
              as={`/dashboard/profile?${encodeQuery(follower?.otherUser2?.id, 'profile')}`}
              className="flex items-center justify-between group/item hover:bg-slate-100 dark:hover:bg-lightgray p-4 cursor-pointer"
            >
              <div className='flex'>
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={
                    !isEmpty(follower?.otherUser2?.profilePic)
                      ? `${config.url.PUBLIC_URL}/${follower?.otherUser2?.profilePic?.name}`
                      : "/images/pfp/pfp1.jpg"
                  }
                  alt=""
                />
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">@{follower?.otherUser2?.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300 truncate">Level : {follower?.otherUser2?.level}</p>
                </div>
              </div>
              <div className='hover:bg-slate-200 dark:hover:bg-darkgray p-2 mr-6 rounded-md'>
                <Link
                  href={{
                    pathname: "/dashboard/profile",
                    query: { user_id: follower?.otherUser2?.id },
                  }}
                  as={`/dashboard/profile?${encodeQuery(follower?.otherUser2?.id, 'profile')}`}
                  className="flex invisible group-hover/item:visible"
                >
                  <span className="group-hover/edit:text-gray-700 font-semibold">View</span>
                  <div className='flex items-center ml-2'>
                    <ArrowSmallRightIcon className="group-hover/edit:text-slate-500 w-4 h-4" />
                  </div>
                </Link>
              </div>
            </Link>
          </div>
        ))
      }
    </div>
  )
}

export default Followers