import Image from "next/image";
import React, { useState, useEffect, useRef, FC } from "react";
import {
  GifIcon,
  FaceSmileIcon,
  MapPinIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { createPost, createSuggestion } from "../../stores/post/PostActions";
import Picker from "@emoji-mart/react";
import Link from "next/link";
import ReactGiphySearchbox from "react-giphy-searchbox";
import toast from "react-hot-toast";
import { isEmpty } from "lodash";
import { config } from "../../constants";
import { fetchAuthUser } from "../../stores/authUser/AuthUserActions";

interface Props {
  refetchFiltered: () => void;
}

function SuggestionBox({ refetchFiltered }: Props) {
  const { authUser } = useAppSelector((state) => state.authUserReducer);
  const { isCreatingPost, error } = useAppSelector((state) => state.postReducer);
  const [input, setInput] = useState<string>("");
  let [image, setImage] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<string>("");
  const dispatch = useAppDispatch();

  //************************** EMOJI Handeling **************************//
  //************************** EMOJI Handeling **************************//
  //************************** EMOJI Handeling **************************//

  const [showEmojis, setShowEmojis] = useState<boolean>(false);

  const emoji = useRef<any>(null);

  // useEffect(() => {
  //   if (!isEmpty(error)) {
  //     toast.error(error);
  //   }
  // }, [error]);

  useEffect(() => {
    dispatch(fetchAuthUser());
  }, []);

  useEffect(() => {
    // only add the event listener when the emoji is opened
    if (!showEmojis) return;
    function handleClick(event: any) {
      if (showEmojis === true) {
        if (emoji.current && !emoji.current.contains(event.target)) {
          setShowEmojis(false);
        }
      }
    }
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
  }, [showEmojis]);

  const addEmoji = (e: any) => {
    const sym = e.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  //************************** Image Handeling **************************//
  //************************** Image Handeling **************************//
  //************************** Image Handeling **************************//

  const inputPicture = useRef<HTMLInputElement | null>(null);

  const onUploadPictureClick = () => {
    // `current` points to the mounted file input element
    if (inputPicture.current) {
      inputPicture.current.click();
    }
  };

  const handleUploadPicture = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setUploadedImage(e.target.files[0]);
  };

  const closePicture = () => {
    image = "";
    setImage(image);
    setUploadedImage("");
    setUploadedVideo("");
  };

  //************************** GIF Handeling **************************//
  //************************** GIF Handeling **************************//
  //************************** GIF Handeling **************************//

  const [showGifs, setShowGifs] = useState<boolean>(false);

  const gif = useRef<any>(null);

  useEffect(() => {
    // only add the event listener when the gif is opened
    if (!showGifs) return;
    function handleClick(event: any) {
      if (showGifs === true) {
        if (gif.current && !gif.current.contains(event.target)) {
          setShowGifs(false);
        }
      }
    }
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
  }, [showGifs]);

  useEffect(() => {
    showPostToast();
  }, [isCreatingPost]);

  const showPostToast = async () => {
    if (isCreatingPost) {
      const refreshToast = toast.loading("Posting...");
      await new Promise((f) => setTimeout(f, 500));
      toast.success("Posted!", {
        id: refreshToast,
      });
    }
  }

  const handleSubmitPost = async (e: any) => {
    e.preventDefault();
    if (image.length > 0) {
      await dispatch(
        createSuggestion({
          content: input,
          public: 1,
          image: uploadedImage,
        })
      ).then(() => {
        refetchFiltered();
        closePicture();
        setInput("");
      });
    } else {
      await dispatch(
        createSuggestion({
          content: input,
          public: 1,
        })
      ).then(() => {
        refetchFiltered();
        setInput("");
      });
    }
  };

  return (
    <div className="flex space-x-2 p-4 dark:bg-lightgray border-y dark:border-lightgray">
      <Link
        href="/dashboard/profile"
        className="relative flex flex-col h-fit group"
      >
        <div className={`relative flex flex-col p-1 rounded-lg`}>
          <div className={`relative rounded-md`}>
            <Image
              src={
                !isEmpty(authUser?.frameName)
                  ? `/${authUser?.frameName}`
                  : "/images/frames/frame4.jpg"
              }
              alt="pfp"
              className="relative w-20 h-20 border-white"
              width={2000}
              height={2000}
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto w-[70px] h-[70px] bg-white dark:bg-lightgray z-0 shadow-sm">
              <Image
                src={
                  !isEmpty(authUser?.profilePic)
                    ? `${config.url.PUBLIC_URL}/${authUser?.profilePic?.name}`
                    : "/images/pfp/pfp1.jpg"
                }
                alt="pfp"
                className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto w-[65px] h-[65px] object-cover z-0 rounded-sm"
                width={2000}
                height={2000}
              />
            </div>
            <div className={`absolute -bottom-3 -left-3 flex rounded-lg`}>
              <div className="relative">
                <Image
                  src={
                    !isEmpty(authUser?.frameName)
                      ? `/${authUser?.frameName}`
                      : "/images/frames/frame4.jpg"
                  }
                  alt="pfp"
                  className="relative w-8 h-8 z-[1]"
                  width={2000}
                  height={2000}
                />
                <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto z-[1] w-[28px] h-[28px] flex items-center justify-center text-black dark:text-white font-semibold text-sm bg-white dark:bg-lightgray">
                  {authUser?.level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-col flex-1">
          <textarea
            id="message"
            maxLength={1000}
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            data-rows="4"
            className="pt-6 h-24 w-full text-black dark:text-white outline-none text-l bg-transparent"
            placeholder="Enter your suggestion!"
          ></textarea>
          <hr className="mb-4 dark:border-darkgray dark:border-2"></hr>
          {image && (
            <div className="relative w-full">
              <img
                className="max-w-full max-h-[300px] h-auto object-contain rounded-md"
                src={image}
                alt=""
              />
              <div
                onClick={() => closePicture()}
                className="flex items-center justify-center absolute top-2 left-2 w-7 h-7 rounded-full p-1 cursor-pointer bg-white dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray"
              >
                <XMarkIcon className="w-5 h-5" />
              </div>
              <hr className="mt-4 mb-4 dark:border-darkgray dark:border-2"></hr>
            </div>
          )}

          <div className="flex items-center">
            <div className="flex relative space-x-2 text-[#181c44] dark:text-white flex-1">
              { (
                <PhotoIcon
                  data-te-toggle="tooltip"
                  data-te-placement="top"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  title="Attach a picture"
                  onClick={() => onUploadPictureClick()}
                  className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
                />
              )}
              <FaceSmileIcon
                data-te-toggle="tooltip"
                data-te-placement="top"
                data-te-ripple-init
                data-te-ripple-color="light"
                title="Attach an Emojie"
                ref={emoji}
                onClick={() => setShowEmojis((b) => !b)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              {showEmojis && (
                <div className="absolute left-5 top-7 z-[1]">
                  <Picker
                    onEmojiSelect={addEmoji}
                    theme="dark"
                    set="apple"
                    icons="outline"
                    previewPosition="none"
                    size="1em"
                    perLine="6"
                    maxFrequentRows="2"
                    searchPosition="none"
                  />
                </div>
              )}
            </div>
            <button
              disabled={!input}
              className="bg-blockd px-5 py-2 font-bold text-white rounded-full disabled:opacity-40 disabled:z-[0]"
              onClick={(e) => handleSubmitPost(e)}
            >
              Post
            </button>
          </div>
          <input
            type="file"
            id="file"
            ref={inputPicture}
            className="hidden"
            accept="image/*"
            onChange={handleUploadPicture}
          />
        </form>
      </div>
    </div>
  );
}

export default SuggestionBox;
