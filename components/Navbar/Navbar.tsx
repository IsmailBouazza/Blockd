import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import {
  MicrophoneIcon,
  ComputerDesktopIcon,
  UserIcon,
  HomeIcon,
  PlusCircleIcon,
  LightBulbIcon,
  FireIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LockClosedIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import {
  BellIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  fetchAuthUser,
  logoutUser,
} from "../../stores/authUser/AuthUserActions";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import IconGroup from "./IconGroup";
import { useTheme } from "next-themes";
import { useChannel, configureAbly } from "@ably-labs/react-hooks";
import Ably from "ably/promises";
import {
  fetchUserNotification,
  fetchUserNotifications,
} from "../../stores/notification/NotificationActions";
import { isEmpty } from "lodash";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchUser,
  resetBell,
  resetMessages,
} from "../../stores/user/UserActions";
import { config, AblyKey } from "../../constants";
import SidebarRow from "../Sidebar/SidebarRow";
import { setCookie, deleteCookie } from "cookies-next";

interface Data {
  receiver_id: number;
  notification: number;
}
configureAbly({
  key: AblyKey,
});
const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isRegistered } = router.query;
  const { authUser } = useAppSelector((state) => state.authUserReducer);
  const { notifications } = useAppSelector(
    (state) => state.notificationReducer
  );
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownNotifOpen, setDropdownNotifOpen] = useState<boolean>(false);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [notificationInfo, setNotificationInfo] = useState<string>();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);

  const [showModal1, setShowModal1] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [showModal6, setShowModal6] = useState(false);
  const [showModal7, setShowModal7] = useState(false);
  const [showModal8, setShowModal8] = useState(false);
  const [showModal9, setShowModal9] = useState(false);

  useEffect(() => {
    setNotificationInfo("");
    dispatch(fetchAuthUser());
    handleFetchNotifications();
  }, []);

  useEffect(() => {
    if (notificationInfo) {
      handleShowNotification(notificationInfo);
    }
  }, [notificationInfo]);

  const handleShowNotification = async (notification: any) => {
    await new Promise((f) => setTimeout(f, 1000));
    toast(notification);
  };

  const handleFetchNotifications = async () => {
    await dispatch(fetchUserNotifications());
  };

  const [channel, ably] = useChannel("notifications", (message) => {
    checkUserNotification(message.data);
  });

  const [message] = useChannel(
    `messageNotification-${authUser.id}`,
    (message) => {
      fetchMessageNotification(message.data);
    }
  );

  const fetchMessageNotification = async (data: Data) => {
    await dispatch(fetchUserNotification(data?.notification)).then(
      async (result: any) => {
        setNotificationInfo(`${result?.otherUser?.name} sent you a message!`);
      }
    );
    await handleFetchNotifications();
    await dispatch(fetchAuthUser());
  };

  const checkUserNotification = async (data: Data) => {
    let localStorageAuthUser: any = "";
    if (isEmpty(authUser)) {
      // @ts-ignore
      localStorageAuthUser = JSON.parse(localStorage.getItem("authUser"));
    } else {
      localStorageAuthUser = authUser;
    }
    if (localStorageAuthUser?.id == data?.receiver_id) {
      await dispatch(fetchUserNotification(data?.notification)).then(
        async (result: any) => {
          if ("like" === result?.type) {
            setNotificationInfo(`${result?.otherUser?.name} has liked your post!`);
          } else if ("comment" === result?.type) {
            setNotificationInfo(
              `${result?.otherUser?.name} commented on your post!`
            );
          } else if ("dislike" === result?.type) {
            setNotificationInfo(`${result?.otherUser?.name} disliked your post!`);
          } else if ("follow" === result?.type) {
            setNotificationInfo(`${result?.otherUser?.name} has followed you!`);
          } else if ("levelUpgrade" === result?.type) {
            setNotificationInfo("Your level has been upgraded!");
          }
        }
      );
    }
    await handleFetchNotifications();
    await dispatch(fetchAuthUser());
  };

  const fetchUserName = async (id: any) => {
    await dispatch(fetchUser(id)).then((result: any) => {
      return result?.name;
    });
  };

  const handleMsg = async () => {
    await dispatch(resetMessages());
    await dispatch(fetchAuthUser());
    setDropdownOpen(!dropdownOpen);
    if (dropdownNotifOpen === true) {
      setDropdownNotifOpen(!dropdownNotifOpen);
    }
  };

  const handleNotif = async () => {
    await dispatch(resetBell());
    await dispatch(fetchAuthUser());
    setDropdownNotifOpen(!dropdownNotifOpen);
    if (dropdownOpen === true) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    deleteCookie("token");
    await dispatch(logoutUser());
    router.push("/auth/signin");
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  const renderThemeChanger = () => {
    if (!mounted) return null;

    if (currentTheme === "dark") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 md:h-6 md:w-6 fill-white"
          viewBox="0 0 20 20"
          fill="#9333ea"
          role="button"
          onClick={() => setTheme("light")}
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#000000"
          className="w-5 h-5 md:h-6 md:w-6 fill-white stroke-black"
          role="button"
          onClick={() => setTheme("dark")}
        >
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  return (
    <div className="w-full bg-darkblue dark:bg-lightgray">
      <div
        className={`bg-darkblue dark:bg-lightgray grid grid-cols-9 place-content-center mx-auto ${
          router.pathname === "/dashboard/myChatrooms" ||
          router.pathname === "/dashboard/myChatrooms2"
            ? "lg:max-w-7xl "
            : "xl:max-w-[80%]"
        } h-14 px-2`}
      >
        <div className="flex w-full col-span-9 md:col-span-4 place-self-start place-items-center h-14">
          <div className="relative flex items-center justify-between w-full">
            <Bars3Icon
              onClick={() => setShowSidebar(!showSidebar)}
              className="w-7 h-7 text-white cursor-pointer md:hidden"
            />
            <Link
              href="/"
              className="h-full cursor-pointer flex items-center justify-center"
            >
              <Image
                src="/images/logo/long-logo.png"
                alt="Blockd Logo"
                className="w-26 h-10 md:ml-0 hidden md:inline"
                width={140}
                height={50}
              />
              <Image
                src="/images/logo/logo.png"
                alt="Blockd Logo"
                className="md:ml-0 w-10 h-7 md:w-12 md:h-8 md:hidden"
                width={60}
                height={40}
              />
            </Link>
            <div className="flex relative">
              <Image
                src={
                  authUser?.profilePic
                    ? `${config.url.PUBLIC_URL}/${authUser?.profilePic}`
                    : "/images/pfp/pfp1.jpg"
                }
                onClick={() => setDropDown(!dropDown)}
                alt="pfp"
                className="w-10 h-10 rounded-md shadow-sm cursor-pointer md:hidden"
                width={2000}
                height={2000}
              />
              {(authUser?.unread == 0 ||
                authUser?.unread === undefined ||
                authUser?.unread === null) &&
              (authUser?.unreadMessages == 0 ||
                authUser?.unreadMessages === undefined ||
                authUser?.unreadMessages === null) ? (
                <></>
              ) : (
                <div className="absolute -bottom-1 -right-1 p-[5px] w-1 h-1 rounded-full bg-blockd md:hidden"></div>
              )}
            </div>
            {dropDown && (
              <div className="absolute right-0 top-14 z-50 md:hidden">
                <div className="flex flex-col items-center justify-start bg-white dark:bg-darkgray dark:border-lightgray shadow-lg rounded-md">
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => handleNotif()}
                    className="flex items-center justify-between space-x-2 p-2 text-sm border-b dark:border-lightgray w-full rounded-t-md"
                  >
                    <div className="flex items-center space-x-2">
                      <BellIcon className="h-5 w-5 inline" />
                      <p>Notifications</p>
                    </div>
                    {authUser?.unread == 0 ||
                    authUser?.unread === undefined ||
                    authUser?.unread === null ? (
                      ""
                    ) : (
                      <span className="text-white text-xs h-6 w-6 rounded-full bg-blockd flex justify-center items-center">
                        <span>{authUser?.unread}</span>
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    onClick={() => handleMsg()}
                    className="flex items-center justify-between space-x-2 p-2 text-sm border-b dark:border-lightgray w-full"
                  >
                    <div className="flex items-center space-x-2">
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 inline" />
                      <p>Messages</p>
                    </div>
                    {authUser?.unreadMessages == 0 ||
                    authUser?.unreadMessages === undefined ||
                    authUser?.unreadMessages === null ? (
                      ""
                    ) : (
                      <span className="text-white text-xs h-6 w-6 rounded-full bg-blockd flex justify-center items-center">
                        <span>{authUser?.unreadMessages}</span>
                      </span>
                    )}
                  </Link>
                  {currentTheme === "dark" ? (
                    <div
                      onClick={() => setTheme("light")}
                      className="flex items-center space-x-2 p-2 border-b dark:border-lightgray text-sm w-full"
                    >
                      {renderThemeChanger()}
                      <p>Light Mode</p>
                    </div>
                  ) : (
                    <div
                      onClick={() => setTheme("dark")}
                      className="flex items-center space-x-2 p-2 border-b dark:border-lightgray text-sm w-full"
                    >
                      {renderThemeChanger()}
                      <p>Dark Mode</p>
                    </div>
                  )}

                  <div
                    onClick={() => handleLogoutClick()}
                    className="flex items-center space-x-2 p-2 text-sm w-full rounded-b-md"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 inline" />
                    <p>Logout</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:inline md:col-span-5 h-14">
          <ul className="flex items-center justify-end space-x-1 z-[2] right-0 w-full pl-0 transition-all ease-in h-14">
            {/* Dark/Light Mode */}
            <li className="relative flex-col items-center text-l mr-2">
              {renderThemeChanger()}
            </li>
            {/* Messages */}
            <li className="flex-col items-center text-l hidden">
              <Link href="/dashboard/messages">
                {/*
                // @ts-ignore */}
                <IconGroup
                  //@ts-ignore
                  Icon={ChatBubbleBottomCenterTextIcon}
                  notif="10"
                ></IconGroup>
              </Link>
            </li>

            <li className="flex md:flex-col items-center text-l">
              <Link href="/dashboard/messages" onClick={() => handleMsg()}>
                {/*
                // @ts-ignore */}
                <div className="flex max-w-fit items-center space-x-2 rounded-ful transition-all duration-100 group">
                  <div className="">
                    <strong className="relative inline-flex items-center px-2.5 py-1.5">
                      {authUser?.unreadMessages == 0 ||
                      authUser?.unreadMessages === undefined ||
                      authUser?.unreadMessages === null ? (
                        ""
                      ) : (
                        <span className="text-white absolute text-xs -top-1 -right-0 h-6 w-6 rounded-full group-hover:bg-orange-600 bg-blockd flex justify-center items-center items border-2 border-[#181c44] dark:border-lightgray">
                          <span>{authUser?.unreadMessages}</span>
                        </span>
                      )}
                      <ChatBubbleBottomCenterTextIcon className="h-6 w-6 inline text-white dark:text-white" />
                    </strong>
                  </div>
                </div>
              </Link>
            </li>
            {/* Notifications */}

            <li className="flex flex-col items-center text-l">
              <Link
                href="/dashboard/notifications"
                onClick={() => handleNotif()}
              >
                {/*
                // @ts-ignore */}
                <div className="flex max-w-fit items-center space-x-2 rounded-ful transition-all duration-100 group mr-2">
                  <div className="">
                    <strong className="relative inline-flex items-center px-2.5 py-1.5">
                      {authUser?.unread == 0 ||
                      authUser?.unread === undefined ||
                      authUser?.unread === null ? (
                        ""
                      ) : (
                        <span className="text-white absolute text-xs -top-1 -right-0 h-6 w-6 rounded-full group-hover:bg-orange-600 bg-blockd flex justify-center items-center items border-2 border-[#181c44] dark:border-lightgray">
                          <span>{authUser?.unread}</span>
                        </span>
                      )}
                      <BellIcon className="h-6 w-6 inline text-white dark:text-white" />
                    </strong>
                  </div>
                </div>
              </Link>
            </li>
            {/*
          <div className={`${dropdownNotifOpen ? 'hidden md:inline' : 'hidden'}`}>
            <NotifDropDown />
          </div>*/}
            {/* Sign Up */}
            <li className="h-14 rounded-full flex items-center justify-center space-x-4">
              <p
                className="text-white cursor-pointer dark:text-white hover:text-gray-300 dark:hover:text-gray-300 font-semibold"
                onClick={() => handleLogoutClick()}
              >
                Logout
              </p>
              <Link
                href="/dashboard/profile"
                className="rounded-md p-[1px] bg-white w-full"
              >
                <img
                  src={
                    authUser?.profilePic
                      ? `${config.url.PUBLIC_URL}/${authUser?.profilePic?.name}`
                      : "/images/pfp/pfp1.jpg"
                  }
                  alt="pfp"
                  className="w-10 h-10 rounded-md shadow-sm cursor-pointer"
                />
              </Link>
            </li>
          </ul>
        </div>
        {(showSidebar || isRegistered != undefined) && (
          <div
            className={`flex flex-col bg-white dark:bg-darkgray fixed z-50 top-14 h-screen scrollbar-hide overflow-scroll p-4 left-0 w-60 transition-all duration-300 ease-linear md:hidden`}
          >
            <div className="relative w-full">
              <Link href="/" className="active">
                {location.pathname === "/" ? (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 ${
                      showModal3
                        ? "bg-gradient-to-r from-blockd via-orange-400 to-orange-300 text-white"
                        : "bg-gray-100 dark:bg-lightgray"
                    } rounded-full hover:bg-gray-100 dark:hover:bg-lightgray group`}
                  >
                    <HomeIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Home
                    </p>
                  </div>
                ) : (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-lightgray group`}
                  >
                    <HomeIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Home
                    </p>
                  </div>
                )}
              </Link>
              <div
                className={`absolute z-10 left-0 top-[60px] p-2 bg-gradient-to-r from-blockd via-orange-400 to-orange-300 rounded-md ${
                  showModal3 ? "" : "hidden"
                }`}
              >
                <div className="flex flex-col items-start justify-start space-y-2">
                  <p className="text-xs text-white text-justify">
                    The BLOCK’d feed consists of posts created by other users of
                    the platform. Members are able to interact with posts via
                    upvotes, downvotes, comments, and shares. Posts can be
                    edited after they are published.
                  </p>
                  <div className="flex items-end justify-end w-full space-x-2">
                    <p
                      onClick={() => {
                        setShowModal3(false);
                      }}
                      className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                    >
                      Skip
                    </p>
                    <p
                      onClick={() => {
                        setShowModal3(false);
                        setShowModal4(true);
                      }}
                      className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                    >
                      Next
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full">
              <Link href="/dashboard/profile" className="active">
                {location.pathname === "/dashboard/profile" ? (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 bg-gray-100 dark:bg-lightgray
                rounded-full hover:bg-gray-100 dark:hover:bg-lightgray group`}
                  >
                    <UserIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Profile
                    </p>
                  </div>
                ) : (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 rounded-full ${
                      showModal4
                        ? "bg-gradient-to-r from-blockd via-orange-400 to-orange-300 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-lightgray"
                    } group`}
                  >
                    <UserIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Profile
                    </p>
                  </div>
                )}
              </Link>
              <div
                className={`absolute z-10 left-0 top-[60px] p-2 bg-gradient-to-r from-blockd via-orange-400 to-orange-300 rounded-md ${
                  showModal4 ? "" : "hidden"
                }`}
              >
                <div className="flex flex-col items-start justify-start space-y-2">
                  <p className="text-xs text-white text-justify">
                    A user’s profile is fully customizable — the banner, profile
                    photo, short biography, and the frame for the profile photo
                    can all be personalized to accurately represent the user.
                  </p>
                  <div className="flex items-end justify-end w-full space-x-2">
                    <p
                      onClick={() => {
                        setShowModal4(false);
                      }}
                      className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                    >
                      Skip
                    </p>
                    <p
                      onClick={() => {
                        setShowModal4(false);
                        setShowModal5(true);
                      }}
                      className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                    >
                      Next
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full">
              <Link href="/dashboard/suggestion" className="active">
                {location.pathname === "/dashboard/suggestion" ? (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 bg-gray-100 dark:bg-lightgray
                rounded-full hover:bg-gray-100 dark:hover:bg-lightgray group`}
                  >
                    <LightBulbIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Suggestions
                    </p>
                  </div>
                ) : (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 rounded-full ${
                      showModal5
                        ? "bg-gradient-to-r from-blockd via-orange-400 to-orange-300 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-lightgray"
                    } group`}
                  >
                    <LightBulbIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Suggestions
                    </p>
                  </div>
                )}
              </Link>
              <div
                className={`absolute z-10 left-0 top-[60px] p-2 bg-gradient-to-r from-blockd via-orange-400 to-orange-300 rounded-md ${
                  showModal5 ? "" : "hidden"
                }`}
              >
                <div className="flex flex-col items-start justify-start space-y-2">
                  <p className="text-xs text-white text-justify">
                    It is crucial to collect feedback from the users of a social
                    media platform in order to provide better user experience.
                    Our Suggestions tab allows members of BLOCK’d to anonymously
                    post suggestions to improve the platform.
                  </p>
                  <div className="flex items-end justify-end w-full space-x-2">
                    <p
                      onClick={() => {
                        setShowModal5(false);
                      }}
                      className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                    >
                      Skip
                    </p>
                    <p
                      onClick={() => {
                        setShowModal5(false);
                        setShowModal6(true);
                      }}
                      className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                    >
                      Next
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              className="relative"
            >
              <div className="relative flex items-start justify-start">
                <Link
                  href=""
                  className={`flex mt-1 max-w-fit items-start justify-start space-x-2 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-lightgray
               group`}
                >
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                  <p className={`flex text-base lg:text-xl cursor-pointer`}>
                    ChatRooms
                  </p>
                  <div className="hidden md:inline">
                    <ChevronRightIcon
                      className={`w-4 h-4 ml-2 ${isOpen ? "hidden" : "inline"}`}
                    />
                    <ChevronDownIcon
                      className={`w-4 h-4 ml-2 ${isOpen ? "inline" : "hidden"}`}
                    />
                  </div>
                </Link>
              </div>
              {(isOpen || isRegistered != undefined) && (
                <div className="w-full flex flex-col items-center justify-start">
                  <div className="relative w-full">
                    <Link href="/dashboard/myChatrooms">
                      <div
                        className={`flex items-center justify-start p-4 space-x-2 rounded-full w-fit ${
                          showModal6
                            ? "bg-gradient-to-r from-blockd via-orange-400 to-orange-300 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-lightgray"
                        } group`}
                      >
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                        <span className="">My Chatroom</span>
                      </div>
                    </Link>
                    <div
                      className={`absolute z-10 left-0 top-[60px] p-2 bg-gradient-to-r from-blockd via-orange-400 to-orange-300 rounded-md ${
                        showModal6 ? "" : "hidden"
                      }`}
                    >
                      <div className="flex flex-col items-start justify-start space-y-2">
                        <p className="text-xs text-white text-justify">
                          The BLOCK’d chatrooms are unlike any other social
                          media chatroom on the web. In addition to creating a
                          public chatroom, users can also create private
                          chatrooms with set requirements enforced by the
                          blockchain to grant access to users.
                        </p>
                        <div className="flex items-end justify-end w-full space-x-2">
                          <p
                            onClick={() => {
                              setShowModal6(false);
                            }}
                            className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                          >
                            Skip
                          </p>
                          <p
                            onClick={() => {
                              setShowModal6(false);
                              setShowModal7(true);
                            }}
                            className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                          >
                            Next
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full">
                    <Link href="/dashboard/createChatroom">
                      <div
                        className={`flex items-center justify-start p-4 space-x-2 rounded-full w-fit ${
                          showModal7
                            ? "bg-gradient-to-r from-blockd via-orange-400 to-orange-300 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-lightgray"
                        } group`}
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span className="">Create Chatroom</span>
                      </div>
                    </Link>
                    <div
                      className={`absolute z-10 left-0 top-[60px] p-2 bg-gradient-to-r from-blockd via-orange-400 to-orange-300 rounded-md ${
                        showModal7 ? "" : "hidden"
                      }`}
                    >
                      <div className="flex flex-col items-start justify-start space-y-2">
                        <p className="text-xs text-white text-justify">
                          You can consult the create chatrooms page to create
                          either private or public chatrooms, you will also be
                          able to set requirements and add plenty of details
                        </p>
                        <div className="flex items-end justify-end w-full space-x-2">
                          <p
                            onClick={() => {
                              setShowModal7(false);
                            }}
                            className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                          >
                            Skip
                          </p>
                          <p
                            onClick={() => {
                              setShowModal7(false);
                              setShowModal8(true);
                            }}
                            className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                          >
                            Next
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full">
                    <Link href="/dashboard/allChatrooms">
                      <div
                        className={`flex items-center justify-start p-4 space-x-2 rounded-full w-fit ${
                          showModal8
                            ? "bg-gradient-to-r from-blockd via-orange-400 to-orange-300 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-lightgray"
                        } group`}
                      >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span className="">All Chatrooms</span>
                      </div>
                    </Link>
                    <div
                      className={`absolute z-10 left-0 top-[60px] p-2 bg-gradient-to-r from-blockd via-orange-400 to-orange-300 rounded-md ${
                        showModal8 ? "" : "hidden"
                      }`}
                    >
                      <div className="flex flex-col items-start justify-start space-y-2">
                        <p className="text-xs text-white text-justify">
                          You can consult the all chatrooms page and search for
                          your desired group
                        </p>
                        <div className="flex items-end justify-end w-full space-x-2">
                          <p
                            onClick={() => {
                              setShowModal8(false);
                            }}
                            className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                          >
                            Skip
                          </p>
                          <p
                            onClick={() => {
                              setShowModal8(false);
                              setShowModal9(true);
                            }}
                            className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                          >
                            Next
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full">
              <Link href="/dashboard/achievement" className="active">
                {location.pathname === "/dashboard/achievement" ? (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 bg-gray-100 dark:bg-lightgray
                rounded-full hover:bg-gray-100 dark:hover:bg-lightgray group`}
                  >
                    <FireIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Achievements
                    </p>
                  </div>
                ) : (
                  <div
                    className={`flex mt-1 max-w-fit items-start md:items-center md:justify-center space-x-2 p-3 rounded-full ${
                      showModal9
                        ? "bg-gradient-to-r from-blockd via-orange-400 to-orange-300 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-lightgray"
                    } group`}
                  >
                    <FireIcon className="h-6 w-6" />
                    <p className={`text-base lg:text-xl cursor-pointer`}>
                      Achievements
                    </p>
                  </div>
                )}
              </Link>
              <div
                className={`absolute z-10 left-0 top-[60px] p-2 bg-gradient-to-r from-blockd via-orange-400 to-orange-300 rounded-md ${
                  showModal9 ? "" : "hidden"
                }`}
              >
                <div className="flex flex-col items-start justify-start space-y-2">
                  <p className="text-xs text-white text-justify">
                    Interacting via a social media platform just became a bit
                    more exciting. Customize your account with collectibles
                    obtained through engagement and milestone-based
                    achievements. Users can personalize their experience with
                    custom frames, badges, and titles.
                  </p>
                  <div className="flex items-end justify-end w-full space-x-2">
                    <p
                      onClick={() => {
                        setShowModal9(false);
                      }}
                      className="flex items-center justify-center p-1 px-2 bg-white hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                    >
                      Begin
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <Link href="#" className="opacity-60">
              
              <SidebarRow Icon={LockClosedIcon} title="Streams" active="" />
            </Link>
            <Link href="#" className="opacity-60">
              
              <SidebarRow Icon={LockClosedIcon} title="Podcasts" active="" />
            </Link> */}
          </div>
        )}
        {isRegistered != undefined && (
          <div
            className={`fixed md:hidden top-0 left-0 flex p-4 items-center justify-center min-h-screen w-full h-full backdrop-blur-md bg-white/60 z-50 ${
              showModal1 ? "" : "hidden"
            }`}
          >
            <div className="relative w-full rounded-lg shadow-lg max-w-md h-fit bg-gray-50 scrollbar-hide overflow-scroll">
              <div className="sticky top-0 rounded-t-lg backdrop-blur-md bg-white/30">
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    Welcome to Blockd
                  </h3>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start p-4 border-y text-black text-justify">
                Welcome and thank you for being among the first to use the bot
                free social platform that will soon become home to all
                blockchain users (and soon to be blockchain users).
                <br></br>
                Be aware that only certain features are available during this
                Beta, which are:
                <br></br>
                <div className="flex w-full items-center justify-start">
                  <span className="text-orange-500 text-xl">•</span>{" "}
                  Creating/Editing a post.
                </div>
                <div className="flex w-full items-center justify-start">
                  <span className="text-orange-500 text-xl">•</span>{" "}
                  Consulting/Editing your profile page.
                </div>
                <div className="flex w-full items-center justify-start">
                  <span className="text-orange-500 text-xl">•</span> Submitting
                  Feedback.
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 p-4">
                <p
                  onClick={() => {
                    setShowModal1(false);
                    setShowModal2(true);
                  }}
                  className="p-2 px-5 cursor-pointer rounded-md bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Next
                </p>
              </div>
            </div>
          </div>
        )}
        <div
          className={`fixed top-0 left-0 p-4 flex items-center justify-center min-h-screen w-full h-full backdrop-blur-md bg-white/60 z-50 overflow-scroll scrollbar-hide ${
            showModal2 ? "" : "hidden"
          }`}
        >
          <div className="relative w-full rounded-lg shadow-lg max-w-md h-fit bg-gray-50 overflow-scroll scrollbar-hide">
            <div className="sticky top-0 rounded-t-lg backdrop-blur-md bg-white/30">
              <div className="p-4">
                <h3 className="text-xl font-medium text-gray-900">
                  Welcome to Blockd
                </h3>
              </div>
            </div>
            <div className="flex flex-col items-center justify-start p-4 border-y text-black text-justify">
              We appreciate you taking your time  during our Beta and providing
              feedback which is very important to us, as this is a community
              driven platform.
              <br></br>
              <div className="flex w-full items-center justify-start">
                <span className="text-orange-500 text-xl">*</span>To submit
                feedback:<span className="text-orange-500 text-xl">*</span>
              </div>
              Please visit our Suggestions page, select the "Beta Feedback"
              Category and hit Submit!
            </div>
            <div className="flex items-center justify-end space-x-3 p-4">
              <p
                onClick={() => {
                  setShowModal1(true);
                  setShowModal2(false);
                }}
                className="p-2 px-5 cursor-pointer rounded-md bg-gray-400 hover:bg-gray-500 text-white"
              >
                Back
              </p>
              <p
                onClick={() => {
                  setShowModal1(false);
                  setShowModal2(false);
                  setShowModal3(true);
                }}
                className="p-2 px-5 cursor-pointer rounded-md bg-gray-400 hover:bg-gray-500 text-white"
              >
                Start
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
