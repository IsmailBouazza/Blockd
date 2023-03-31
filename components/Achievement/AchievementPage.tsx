import React, { useState, useEffect } from "react";
import Image from "next/image";
import Levels from "./Levels";
import Achievements from "./Achievements";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchUserRewards } from "../../stores/user/UserActions";
import { isEmpty } from "lodash";
import { config } from "../../constants";

function AchievementPage() {
  let [showAchievements, setShowAchievements] = useState<boolean>(false);
  let [showLevels, setShowLevels] = useState<boolean>(true);
  const { rewards } = useAppSelector((state) => state.userReducer);
  const { authUser } = useAppSelector((state) => state.authUserReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    await dispatch(fetchUserRewards());
  };

  const handleToggle1 = () => {
    if (showAchievements == false) {
      setShowAchievements(!showAchievements);
      showLevels = false;
      setShowLevels(showLevels);
    }
  };

  const handleToggle2 = () => {
    if (showLevels == false) {
      setShowLevels(!showLevels);
      showAchievements = false;
      setShowAchievements(showAchievements);
    }
  };

  return (
    <div className="relative min-h-screen scrollbar-hide overflow-scroll col-span-9 md:col-span-5">
      <div className="flex flex-col items-center justify-start p-4 dark:border-lightgray min-h-screen pb-16">
        <div className="flex items-center justify-center w-full space-x-6 mb-10 bg-transparent">
          <div className={`relative rounded-md`}>
            <Image
              src="/images/frames/frame5.svg"
              alt="pfp"
              className="relative w-24 h-24 border-white"
              width={2000}
              height={2000}
            />
            <Image
              src={
                !isEmpty(authUser?.profilePic)
                  ? `${config.url.PUBLIC_URL}/${authUser?.profilePic?.name}`
                  : "/images/pfp/pfp1.jpg"
              }
              alt="pfp"
              className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto w-[80px] h-[80px] z-0 shadow-sm"
              width={2000}
              height={2000}
            />
            <div className={`absolute -bottom-3 -left-3 flex rounded-lg`}>
              <div className="relative">
                <Image
                  src="/images/frames/frame5.svg"
                  alt="pfp"
                  className="relative w-10 h-10 z-[1] stroke-{100px}"
                  width={2000}
                  height={2000}
                />
                <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto flex items-center justify-center text-black font-semibold text-sm bg-white">
                {authUser?.level}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center">
            <p className="text-sm font-semibold mb-2">Total</p>
            <p className="text-2xl font-semibold text-gray-500 dark:text-gray-300">
              {authUser?.score}
            </p>
            <p className="text-l font-semibold text-gray-500 dark:text-gray-300">
              Experience
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-20 mb-5 w-fit border-b dark:border-lightgray h-10">
          <button
            onClick={() => handleToggle2()}
            className={`text-base focus:outline-none ${
              showLevels === true
                ? "border-b-2 border-blockd text-blockd :"
                : ""
            }`}
          >
            Levels
          </button>
          {/* <button
            onClick={() => handleToggle1()}
            className={`text-base focus:outline-none ${showAchievements === true
              ? "border-b-2 border-blockd text-blockd :"
              : ""
              }`}
          >
            Achievements
          </button> */}
        </div>
        {showLevels && <Levels rewards={rewards} />}
        {showAchievements && <Achievements />}
      </div>
    </div>
  );
}

export default AchievementPage;
