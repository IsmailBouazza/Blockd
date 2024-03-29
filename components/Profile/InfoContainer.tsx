import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import {
  CheckBadgeIcon,
  Cog8ToothIcon,
  PencilSquareIcon,
  EyeIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { fetchAuthUser } from "../../stores/authUser/AuthUserActions";
import {
  fetchFollowers,
  fetchIsFollowed,
  fetchUserRewards,
  followUser,
  setUserFrame,
  updateProfilcePicture,
  updateProfileBanner,
  updateUser,
} from "../../stores/user/UserActions";
import { fetchPostImage } from "../../stores/post/PostActions";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { isEmpty } from "lodash";
import { config } from "../../constants";
import { toast } from "react-hot-toast";
import CropImage from "../Cropper/CropperEasy";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicId: number;
  bannerPicId: number;
  score: number;
  level: number;
  levelTotal: number;
  frameName: string;
  bio: string;
  twitter: string;
  lensProtocol: string;
  facebook: string;
  instagram: string;
  linktree: string;
}

interface Props {
  user: User;
  refetchUser: () => void;
  userId: string;
}

function InfoContainer({ user, refetchUser, userId }: Props) {
  const dispatch = useAppDispatch();
  const { authUser, isFetchingAuthUser } = useAppSelector(
    (state) => state.authUserReducer
  );
  const { rewards, followers, isFollowed, error } = useAppSelector(
    (state) => state.userReducer
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isCropperVisible, setIsCropperVisible] = useState<boolean>(false);
  const [isDisplayModal, setIsDisplayModal] = useState<boolean>(false);
  const [color, setColor] = useState<string>("bg-blue-300");
  const [userName, setUserName] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [profilePicture, setProfilePicture] = useState<string>();
  const [bannerPicture, setBannerPicture] = useState<string>();
  const [scorePercentage, setScorePercentage] = useState<any>(0);
  const [bio, setBio] = useState<string>();
  const [twitter, setTwitter] = useState<string>();
  const [lens, setLens] = useState<string>();
  const [facebook, setFacebook] = useState<string>();
  const [insta, setInsta] = useState<string>();
  const [linktree, setLinktree] = useState<string>();
  const [fullScreenImage, setFullScreenImage] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  // const [isFollowed, setIsFollowed] = useState<any>(false);
  let [frameColor, setFrameColor] = useState<string>();

  //Hide dropdown when clicking outside it

  const dropdown = useRef<any>(null);

  useEffect(() => {
    setUserName("");
    setUserEmail("");
    setBio("");
    setInsta("");
    setLinktree("");
    setFacebook("");
  }, [isFetchingAuthUser]);

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!isDropdownVisible) return;
    function handleClick(event: any) {
      if (isDropdownVisible === true) {
        if (dropdown.current && !dropdown.current.contains(event.target)) {
          setIsDropdownVisible(false);
        }
      }
    }
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
  }, [isDropdownVisible]);

  useEffect(() => {
    if (!isEmpty(user)) {
      setUserName(user?.name);
      setUserEmail(user?.email);
      fetchProfilePicture(user?.profilePicId);
      fetchBannerPicture(user?.bannerPicId);
      setBio(user?.bio);
      setTwitter(user?.twitter);
      setLens(user?.lensProtocol);
      setInsta(user?.instagram);
      setLinktree(user?.linktree);
      setFacebook(user?.facebook);
      getScorePercentage();
      fetchRewards();
      fetchUserFollowers();
      followed();
    }
    if (!isEmpty(user?.frameName)) {
      setFrameColor(user?.frameName);
    }
  }, [user]);

  const fetchUserFollowers = async () => {
    await dispatch(fetchFollowers(user?.id));
  };

  const followed = async () => {
    await dispatch(fetchIsFollowed(user?.id));
  };

  const fetchRewards = async () => {
    await dispatch(fetchUserRewards());
  };

  const getScorePercentage = () => {
    setScorePercentage(Math.round((user?.score * 100) / user?.levelTotal));
    // setScorePercentage('1/2');
  };

  const fetchProfilePicture = async (id: number) => {
    if (id != undefined || id != null) {
      await dispatch(fetchPostImage(id)).then((result: any) => {
        setProfilePicture(result[0]?.name);
      });
    }
  };

  const fetchBannerPicture = async (id: number) => {
    if (id != undefined || id != null) {
      await dispatch(fetchPostImage(id)).then((result: any) => {
        setBannerPicture(result[0]?.name);
      });
    }
  };

  //Set a color for the frame

  const changeFrameColor = (color: any) => {
    setColor(color);
  };

  useEffect(() => {
    frameColor = color;
    setFrameColor(frameColor);
  }, [color]);

  //Click on the Camera Icon to change Banner

  const inputFileBanner = useRef<HTMLInputElement | null>(null);

  const onBannerClick = () => {
    // `current` points to the mounted file input element
    if (inputFileBanner.current) {
      inputFileBanner.current.click();
    }
  };

  //Click on the Camera Icon to change Banner

  const inputFilePfp = useRef<HTMLInputElement | null>(null);

  const onPfpClick = () => {
    // `current` points to the mounted file input element
    if (inputFilePfp.current) {
      inputFilePfp.current.click();
    }
  };

  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    await dispatch(
      updateUser({
        name: userName,
        email: userEmail,
        facebook: facebook ? facebook : "",
        instagram: insta ? insta : "",
        linktree: linktree ? linktree : "",
        bio: bio ? bio : "",
        twitter: twitter ? twitter : "",
        lensProtocol: lens ? lens : "",
      })
    ).then(() => {
      setIsModalVisible(false);
      setIsDisplayModal(false);
      refetchUser();
    });
  };

  const handleUploadProfilePicture = async (file: object) => {
    await dispatch(
      updateProfilcePicture({
        user_id: user?.id,
        image: file,
      })
    ).then(() => {
      setOpenCrop(false);
      refetchUser();
    });
  };

  const handleUploadProfileBanner = async (file: object) => {
    await dispatch(
      updateProfileBanner({
        user_id: user?.id,
        image: file,
      })
    ).then(() => {
      setOpenCrop(false);
      refetchUser();
    });
  };

  const handleFollowUser = async () => {
    if (authUser?.id !== user?.id) {
      await dispatch(
        followUser({
          user_id: user?.id,
        })
      );
    }
    refetchUser();
  };

  const setFrame = async (id: any) => {
    await dispatch(setUserFrame(id));
    refetchUser();
  };

  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [openCrop, setOpenCrop] = useState<boolean>(false);
  const [openCropPfp, setOpenCropPfp] = useState<boolean>(false);
  const [openCropBanner, setOpenCropBanner] = useState<boolean>(false);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoURL(reader.result);
        }
      };
    }
    e.target.files = null;
    setOpenCrop(true);
  };

  const renderLink = (tarea: any, type: any) => {
    if (tarea.indexOf("http://") == 0 || tarea.indexOf("https://") == 0) {
      return (
        <a href={`${tarea}`} target="_blank">
          <img
            src={`/images/logo/${type}`}
            className="w-8 h-8 object-cover rounded-md"
          />
        </a>
      );
    }
    return (
      <a href={`https://${tarea}`} target="_blank">
        <img
          src={`/images/logo/${type}`}
          className="w-8 h-8 object-cover rounded-md"
        />
      </a>
    );
  };

  return (
    <div className="flex flex-col items-start justify-center relative mx-auto border-b dark:border-lightgray">
      <div className="relative flex items-center justify-center mt-5  w-full bg-white dark:bg-lightgray group">
        <img
          src={
            !isEmpty(bannerPicture)
              ? `${config.url.PUBLIC_URL}/${bannerPicture}`
              : "/images/blockdbg.jpg"
          }
          alt="Banner"
          className={`w-full max-h-72 ${
            user?.id === authUser?.id && "group-hover:opacity-50"
          }`}
          width="720"
          height="350"
        />
        {user?.id === authUser?.id && (
          <div
            onClick={() => onBannerClick()}
            className="group-hover:flex items-center justify-center absolute top-50 left-50 hidden cursor-pointer w-10 h-10 p-2 bg-white rounded-full"
          >
            <CameraIcon className="w-8 h-8 text-black cursor-pointer" />
          </div>
        )}
        <input
          type="file"
          id="file"
          ref={inputFileBanner}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            onImageChange(e), (e.target.value = "");
            setOpenCropPfp(false);
            setOpenCropBanner(true);
          }}
        />
      </div>
      <div className="flex items-start justify-between p-3 w-full bg-white dark:bg-darkgray">
        <div className="flex items-center justify-start ">
          <circle className="flex items-center justify-start p-3">
            <div className="z-0">
              <div className={`relative rounded-md z-10`}>
                <Image
                  src={
                    !isEmpty(user?.frameName)
                      ? `/${user?.frameName}`
                      : "/images/frames/frame4.jpg"
                  }
                  alt="pfp"
                  className="relative w-24 h-24 z-0 border-white"
                  width={2000}
                  height={2000}
                />
                <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto w-[83px] h-[83px] bg-white dark:bg-darkgray">
                  <Image
                    src={
                      !isEmpty(profilePicture)
                        ? `${config.url.PUBLIC_URL}/${profilePicture}`
                        : "/images/pfp/pfp1.jpg"
                    }
                    alt="pfp"
                    className="absolute cursor-pointer top-0 bottom-0 left-0 right-0 mx-auto my-auto w-[75px] h-[75px] object-cover rounded-sm"
                    width={2000}
                    height={2000}
                    onClick={() => setFullScreenImage(!fullScreenImage)}
                  />
                </div>
                <div
                  className={`absolute z-20 -bottom-3 -left-3 flex rounded-lg`}
                >
                  <div className="relative">
                    <Image
                      src={
                        !isEmpty(user?.frameName)
                          ? `/${user?.frameName}`
                          : "/images/frames/frame4.jpg"
                      }
                      alt="pfp"
                      className="relative w-9 h-9"
                      width={2000}
                      height={2000}
                    />
                    <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto z-[1] w-[31px] h-[31px] flex items-center justify-center text-black dark:text-white font-semibold text-sm bg-white dark:bg-darkgray">
                      {user?.level}
                    </div>
                  </div>
                </div>
                {user?.id === authUser?.id && (
                  <div
                    onClick={() => onPfpClick()}
                    className="flex items-center z-20 justify-center absolute -bottom-3 -right-3 cursor-pointer w-8 h-8 md:w-10 md:h-10 p-[5px] bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-300 border-4 border-white dark:border-darkgray rounded-full"
                  >
                    <CameraIcon className="w-6 h-6 md:w-8 md:h-8 text-white dark:text-darkgray" />
                  </div>
                )}
                <input
                  type="file"
                  id="file"
                  ref={inputFilePfp}
                  className="hidden"
                  accept="image/*"
                  //onClick={(target) =>  {target = null;}}

                  //onImageChange onChange={onImageChange}
                  onChange={(e) => {
                    onImageChange(e), (e.target.value = "");
                    setOpenCropPfp(true);
                    setOpenCropBanner(false);
                  }}
                />
              </div>
            </div>
          </circle>
          <div className="flex flex-col items-start justify-end rounded-md p-3">
            <div className="flex items-center space-x-1">
              <p className="mr-1 text-sm lg:text-base group-hover:underline">
                @{user?.name}
              </p>
              {user?.level == 20 && (
                <img
                  src="/images/badges/verified.png"
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              )}
            </div>
            <div>
              <p className="mr-1 text-xs md:text-sm group-hover:underline mt-2">
                {followers.length} Followers
              </p>
            </div>
            <div className="flex items-center justify-start w-32 md:w-48 h-5 rounded bg-gray-200 mb-2 relative group">
              <div
                className="flex items-center justify-center bg-gradient-to-r from-orange-700 via-orange-500 to-orange-300 p-1 h-5 rounded"
                style={{ width: `${scorePercentage}%` }}
              >
                <span className="text-xs font-semibold cursor-pointer text-white inline">
                  {user?.score > 0 && user?.score + "XP"}
                </span>
              </div>
              {/* <div className="flex items-center justify-center w-1/4">
                <span className='text-xs font-semibold cursor-pointer text-black'>60 XP</span>
              </div> */}
            </div>
            {/* <div className='text-sm'>
              <span className='font-semibold'>Level 5 :</span> 75%
            </div> */}
            {user?.id !== authUser?.id ? (
              <>
                <div className="flex items-center justify-center xl:hidden">
                  <Link
                    type="button"
                    // href="/dashboard/myChatrooms"
                    href={{
                      pathname: "/dashboard/myChatrooms",
                      query: { chatReceiverId: user?.id },
                    }}
                    as="/dashboard/myChatrooms"
                    className="flex items-center justify-center cursor-pointer rounded-md bg-gray-100 dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray"
                  >
                    <p className="text-xs lg:text-base p-2 cursor-pointer rounded-md bg-gray-100 dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray">
                      Message
                    </p>
                  </Link>
                  {isFollowed ? (
                    <div className="w-fit h-fit p-2 flex items-center justify-center rounded-md">
                      <p
                        className="text-xs lg:text-base p-2 cursor-pointer rounded-md text-white bg-gradient-to-r from-blockd via-orange-400 to-orange-300"
                        onClick={() => handleFollowUser()}
                      >
                        Unfollow
                      </p>
                    </div>
                  ) : (
                    <div className="w-fit h-fit p-2 flex items-center justify-center rounded-md">
                      <p
                        className="text-xs lg:text-base p-2 cursor-pointer rounded-md text-white bg-gradient-to-r from-blockd via-orange-400 to-orange-300"
                        onClick={() => handleFollowUser()}
                      >
                        Follow
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-md bg-white dark:bg-darkgray md:hidden">
                <p
                  className="flex items-center text-xs p-2 cursor-pointer rounded-md bg-gray-100 dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray"
                  onClick={() => setIsModalVisible(!isModalVisible)}
                >
                  <PencilSquareIcon className="w-5 h-5 mr-2" />
                  Edit Profile
                </p>
              </div>
            )}
          </div>
        </div>
        <div ref={dropdown} className="hidden md:flex">
          {user?.id === authUser?.id ? (
            <div className="w-fit h-fit p-4 flex items-center justify-center rounded-md bg-white dark:bg-darkgray">
              <Cog8ToothIcon
                onClick={() => setIsDropdownVisible((b) => !b)}
                className="h-6 w-6 text-black dark:fill-white cursor-pointer transition-transform duration-500 ease-out hover:rotate-180 active-scale"
              />
            </div>
          ) : (
            <>
              <div className="hidden xl:flex items-center justify-center">
                <Link
                  type="button"
                  // href="/dashboard/myChatrooms"
                  href={{
                    pathname: "/dashboard/myChatrooms",
                    query: { chatReceiverId: user?.id },
                  }}
                  as="/dashboard/myChatrooms"
                  className="flex items-center justify-center h-10 py-0 px-2 cursor-pointer rounded-md bg-gray-100 dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                </Link>
                {isFollowed ? (
                  <div className="w-fit h-fit p-2 flex items-center justify-center rounded-md">
                    <p
                      className="text-xs lg:text-base p-2 cursor-pointer text-white rounded-md bg-gradient-to-r from-blockd via-orange-400 to-orange-300 hover:from-orange-300 hover:via-orange-400 hover:to-blockd"
                      onClick={() => handleFollowUser()}
                    >
                      Unfollow
                    </p>
                  </div>
                ) : (
                  <div className="w-fit h-fit p-2 flex items-center justify-center rounded-md">
                    <p
                      className="text-xs lg:text-base p-2 cursor-pointer rounded-md text-white bg-gradient-to-r from-blockd via-orange-400 to-orange-300 hover:from-orange-300 hover:via-orange-400 hover:to-blockd"
                      onClick={() => handleFollowUser()}
                    >
                      Follow
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
          <ul
            className={`absolute right-3 cursor-pointer bg-white dark:bg-darkgray rounded-lg shadow-lg ${
              isDropdownVisible ? "" : "hidden"
            }`}
          >
            <Link
              type="button"
              onClick={() => setIsModalVisible(!isModalVisible)}
              href=""
              className="flex items-center justify-start p-3 hover:bg-gray-200 hover:rounded-t-md dark:hover:bg-lightgray/50"
            >
              <PencilSquareIcon className="w-5 h-5 mr-2" />
              Edit Profile
            </Link>
            {/* <Link
              type="button"
              href=""
              className="flex items-center justify-start p-3 hover:bg-gray-200 hover:rounded-b-md dark:hover:bg-lightgray/50"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
              Help Center
            </Link> */}
          </ul>
        </div>
      </div>

      {/* TODO HASAN SAADO    */}
      {!isEmpty(user?.bio) && (
        <div className="py-2 w-full md:w-3/4 px-6 pr-10">
          <p className="text-sm w-full">{user?.bio} </p>
        </div>
      )}
      <div className="flex items-end justify-start py-2 px-6 space-x-2 mb-2">
        {user?.twitter && renderLink(user?.twitter, "twitter.png")}
        {user?.lensProtocol &&
          renderLink(user?.lensProtocol, "lensProtocol.jpeg")}
        {user?.facebook && renderLink(user?.facebook, "facebook.png")}
        {user?.instagram && renderLink(user?.instagram, "instagram.png")}
        {user?.linktree && renderLink(user?.linktree, "linktree.png")}
      </div>

      <div
        className={`fixed top-0 left-0 p-4 flex flex-col items-center justify-center min-h-screen w-full h-full scrollbar-hide overflow-scroll backdrop-blur-md bg-white/60 z-50 py-4 ${
          openCrop ? "" : "hidden"
        }`}
      >
        <div className="relative w-full h-full shadow-xl rounded-lg max-w-2xl  bg-white scrollbar-hide overflow-scroll">
          <div className="relative p-10 h-auto w-auto bg-white">
            <button
              type="button"
              onClick={() => setOpenCrop(!openCrop)}
              className="absolute top-2 right-2 bg-transparent hover:bg-gray-200 text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="">
              {!openCropPfp && (
                <CropImage
                  photoURL={photoURL}
                  setOpenCrop={setOpenCrop}
                  setPhotoURL={setPhotoURL}
                  setFile={setFile}
                  submit={handleUploadProfileBanner}
                  aspect={3}
                />
              )}
              {!openCropBanner && (
                <CropImage
                  photoURL={photoURL}
                  setOpenCrop={setOpenCrop}
                  setPhotoURL={setPhotoURL}
                  setFile={setFile}
                  submit={handleUploadProfilePicture}
                  aspect={1}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 p-4 flex items-stretch justify-center min-h-screen w-full h-full scrollbar-hide overflow-scroll backdrop-blur-md bg-white/60 z-50 py-4 ${
          isModalVisible ? "" : "hidden"
        }`}
      >
        <div className="relative w-full h-full shadow-xl rounded-lg max-w-md bg-white scrollbar-hide overflow-scroll">
          <div className="relative bg-white rounded-lg">
            <div className="sticky top-0 left-0 z-[1] flex items-center justify-between p-4 border-b backdrop-blur-md bg-white/30">
              <h3 className="text-xl font-medium text-gray-900">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsModalVisible(!isModalVisible)}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="px-6 py-6 lg:px-8">
              <form className="space-y-3" action="#">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="Name"
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                {/* TODO HASAN SAADO */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Bio
                  </label>
                  <textarea
                    placeholder="Write something ..."
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Twitter
                  </label>
                  <input
                    placeholder="Type your link"
                    type="text"
                    name="twitter"
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Lens Protocol
                  </label>
                  <input
                    placeholder="Type your link"
                    type="text"
                    name="lens"
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={lens}
                    onChange={(e) => setLens(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Instagram
                  </label>
                  <input
                    placeholder="Type your link"
                    type="text"
                    name="insta"
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={insta}
                    onChange={(e) => setInsta(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Facebook
                  </label>
                  <input
                    placeholder="Type your link"
                    type="text"
                    name="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    LinkTree
                  </label>
                  <input
                    placeholder="Type your link"
                    type="text"
                    name="linkTree"
                    value={linktree}
                    onChange={(e) => setLinktree(e.target.value)}
                    className="bg-gray-100 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
                <button
                  onClick={(e) => handleUpdateUser(e)}
                  className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Save
                </button>
              </form>
            </div>
            <div className="relative">
              <div className="w-full flex items-center justify-between p-4 border-y backdrop-blur-md bg-white/30">
                <h3 className="text-xl font-medium text-gray-900">
                  Change Frame Color
                </h3>
              </div>
            </div>
            <div className="relative flex flex-col items-start p-4">
              <div className="flex flex-col items-start justify-start space-y-2 mb-2">
                <p className="flex items-center justify-start text-base font-semibold w-32">
                  Current frame
                </p>
                <div className="">
                  <Image
                    src={
                      !isEmpty(user?.frameName)
                        ? `/${user?.frameName}`
                        : "/images/frames/frame4.jpg"
                    }
                    alt="pfp"
                    className="relative w-20 h-20 z-0 rounded-md"
                    width={2000}
                    height={2000}
                  />
                </div>
              </div>
              <h3 className="font-semibold py-2 text-black">My collection</h3>
              <div className="grid grid-cols-12 z-0 lg:grid-cols-8 w-full place-items-center">
                {!isEmpty(rewards) &&
                  rewards.map((reward: any, index: any) => (
                    <img
                      className={`w-24 h-40 mt-2 opacity-80 hover:opacity-100 col-span-4 lg:col-span-2 cursor-pointer mr-1 rounded-md`}
                      src={`/${reward?.name}`}
                      key={index}
                      onClick={() => {
                        changeFrameColor(reward?.name), setFrame(reward?.id);
                      }}
                    />
                  ))}
                {/* <div
                  onClick={() => changeFrameColor("bg-orange-500")}
                  className="w-24 h-40 opacity-80 hover:opacity-100 col-span-4 lg:col-span-2 cursor-pointer mt-3 mr-1 bg-orange-500 rounded-md"
                ></div>
                <div
                  onClick={() => changeFrameColor("bg-blue-300")}
                  className="w-24 h-40 opacity-80 hover:opacity-100 col-span-4 lg:col-span-2 cursor-pointer mt-3 mr-1 bg-blue-300 rounded-md"
                ></div>
                <div
                  onClick={() =>
                    changeFrameColor("bg-[url('/images/frames/frame2.jpg')]")
                  }
                  className="w-24 h-40 opacity-80 hover:opacity-100 col-span-4 lg:col-span-2 cursor-pointer mt-3 mr-1 bg-[url('/images/frames/frame2.jpg')] rounded-md"
                ></div>
                <div
                  onClick={() =>
                    changeFrameColor(
                      "bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]"
                    )
                  }
                  className="w-24 h-40 opacity-80 hover:opacity-100 col-span-4 lg:col-span-2 cursor-pointer mt-3 mr-1 bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] rounded-md"
                ></div>
                <div
                  onClick={() =>
                    changeFrameColor("bg-[url('/images/frames/frame1.jpg')]")
                  }
                  className="w-24 h-40 opacity-80 hover:opacity-100 col-span-4 lg:col-span-2 cursor-pointer mt-3 mr-1 bg-[url('/images/frames/frame1.jpg')] rounded-md"
                ></div> */}
              </div>
            </div>
            {/* <div className="flex flex-col items-start p-4">
              <h3 className="font-semibold py-2 text-black">New Frames</h3>
              <div className="grid grid-cols-12 lg:grid-cols-8 w-full place-items-center">
                <div className="flex flex-col items-center justify-center col-span-4 lg:col-span-2">
                  <div
                    className={`w-24 h-40 mt-3 mr-1 opacity-60 hover:opacity-100 bg-gradient-to-r from-[#FF512F] to-[#DD2476] rounded-md`}
                  ></div>
                  <p className="cursor-pointer font-semibold text-sm p-2 mt-2 hover:bg-orange-600 rounded-full hover:text-white">
                    Unlock
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center col-span-4 lg:col-span-2">
                  <div
                    className={`w-24 h-40 mt-3 mr-1 opacity-60 hover:opacity-100 bg-gradient-to-r from-[#F09819] to-[#EDDE5D] rounded-md`}
                  ></div>
                  <p className="cursor-pointer font-semibold text-sm p-2 mt-2 hover:bg-orange-600 rounded-full hover:text-white">
                    Unlock
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center col-span-4 lg:col-span-2">
                  <div
                    className={`w-24 h-40 mt-3 mr-1 opacity-60 hover:opacity-100 bg-[url('/images/frames/frame3.jpg')] bg-cover object-contain rounded-md`}
                  ></div>
                  <p className="cursor-pointer font-semibold text-sm p-2 mt-2 hover:bg-orange-600 rounded-full hover:text-white">
                    Unlock
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center col-span-4 lg:col-span-2">
                  <div
                    className={`w-24 h-40 mt-3 mr-1 opacity-60 hover:opacity-100 bg-gradient-to-r from-[#3CA55C] to-[#B5AC49] rounded-md`}
                  ></div>
                  <p className="cursor-pointer font-semibold text-sm p-2 mt-2 hover:bg-orange-600 rounded-full hover:text-white">
                    Unlock
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-md bg-white/60 z-50 overflow-scroll scrollbar-hide ${
          fullScreenImage ? "" : "hidden"
        }`}
      >
        <div className="relative w-fit rounded-lg shadow-lg max-w-md h-auto m-6">
          <div className="flex items-center justify-center relative rounded-t-lg">
            <button
              type="button"
              onClick={() => setFullScreenImage(!fullScreenImage)}
              className="absolute top-1 right-1 text-gray-400 bg-transparent bg-white hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <Image
              src={
                !isEmpty(profilePicture)
                  ? `${config.url.PUBLIC_URL}/${profilePicture}`
                  : "/images/pfp/pfp1.jpg"
              }
              alt="pfp"
              className="rounded-lg max-w-full object-contain max-h-[600px] shadow-sm cursor-pointer"
              width={2000}
              height={2000}
              onClick={() => setFullScreenImage(!fullScreenImage)}
            />
            {/* <img
                src={`${config.url.PUBLIC_URL}/${post?.postImage?.name}`}
                alt="Post"
                className="rounded-lg max-w-full object-contain max-h-[600px] shadow-sm cursor-pointer"
                onClick={() => setFullScreenImage(!fullScreenImage)}
              /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoContainer;
