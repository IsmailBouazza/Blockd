import React, { useEffect } from 'react'
import Image from "next/image";
import {
  ArrowSmallRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { readNotification } from '../../stores/notification/NotificationActions';
import { isEmpty } from 'lodash';
import { config } from '../../constants';
import moment from 'moment';
import { encodeQuery } from '../../utils';
import { toast } from 'react-hot-toast';

function Messages({ notification, handleFetchNotifications }: any) {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.notificationReducer)

  // useEffect(() => {
  //   if (!isEmpty(error)) {
  //     toast.error(error);
  //   }
  // }, [error]);

  const handleReadNotification = async () => {
    await dispatch(readNotification(notification?.id)).then(() => {
      handleFetchNotifications();
    });
  };

  return (
    <div className="divide-slate-200 dark:divide-lightgray">
      <Link
        onClick={() => handleReadNotification()}
        href={{
          pathname: '/dashboard/myChatrooms/',
          query: { chatReceiverId: notification?.otherUser?.id },
        }}
        // @ts-ignore
        className={`flex items-center justify-between group/item border-b dark:border-lightgray ${
          notification?.read == 0 ? "bg-slate-100 dark:bg-lightgray" : ""
        } p-4 cursor-pointer`}
      >
        <div className="flex mr-2">
          <Link
            onClick={() => handleReadNotification()}
            href={{
              pathname: "/dashboard/profile",
              query: { user_id: notification?.otherUser?.id },
            }}
            as={`/dashboard/profile?${encodeQuery(notification?.otherUser?.id, 'profile')}`}
          >
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={
                !isEmpty(notification?.otherUser?.profilePic)
                  ? `${config.url.PUBLIC_URL}/${notification?.otherUser?.profilePic?.name}`
                  : "/images/pfp/pfp1.jpg"
              }
              alt=""
              width={2000}
              height={2000}
            />
          </Link>
          <div className="ml-3 flex items-center justify-center">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {notification?.otherUser?.name} Sent you a private message.
              <br></br>
              <span className="text-xs">{moment(notification?.createdAt).fromNow()}</span>
            </p>
          </div>
        </div>
        <div className="hover:bg-slate-200 dark:hover:bg-darkgray p-2 mr-1 md:mr-2 lg:mr-6 rounded-md">
          <Link
            onClick={() => handleReadNotification()}
            href={{
              pathname: '/dashboard/myChatrooms/',
              query: { chatReceiverId: notification?.otherUser?.id },
            }}
            className="flex invisible group-hover/item:visible">
            <span className="group-hover/edit:text-gray-700 font-semibold">View</span>
            <div className='flex items-center ml-2'>
              <ArrowSmallRightIcon className="group-hover/edit:text-slate-500 w-4 h-4" />
            </div>
          </Link>
        </div>
      </Link>
    </div>
  );
}

export default Messages;
