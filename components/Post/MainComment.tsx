import React, { useRef, useState, useEffect } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
  PhotoIcon,
  FaceSmileIcon,
  XMarkIcon,
  GifIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import Picker from "@emoji-mart/react";
import TimeAgo from "react-timeago";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import ReactGiphySearchbox from "react-giphy-searchbox";
import { config } from "../../constants";
import { isEmpty } from "lodash";
import {
  dislikeComment,
  fetchCommentInfo,
  fetchIsDislikedComment,
  fetchIsLikedComment,
  likeComment,
  replyComment,
} from "../../stores/comment/CommentActions";
import { toast } from "react-hot-toast";
import { encodeQuery, renderComment } from "../../utils";
import Linkify from "react-linkify";
// @ts-ignore
import renderHTML from "react-render-html";
import { MentionsInput, Mention } from "react-mentions";
import darkMode from "../../styles/darkMode.module.scss";
import lightMode from "../../styles/lightMode.module.scss";
import { searchTagUsers } from "../../stores/user/UserActions";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Pic {
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePicId: number;
  bannerPicId: number;
  profilePic: Pic;
  level: number;
  frameName: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: number;
  otherUser: User;
  gif: string;
  imgName: string;
}

interface Post {
  id: number;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  hasImg: boolean;
  userId: number;
  gif: string;
  user: User;
}

interface Info {
  likes: number;
  dislikes: number;
  replies: number;
}

interface Props {
  comment: Comment;
  post: Post;
  refetchReplies: () => void;
}

function MainComment({ comment, post, refetchReplies }: Props) {
  const dispatch = useAppDispatch();
  const { authUser } = useAppSelector((state) => state.authUserReducer);
  const { error } = useAppSelector((state) => state.commentReducer);
  const [input, setInput] = useState<string>("");

  //************************** Image Handeling **************************//
  //************************** Image Handeling **************************//
  //************************** Image Handeling **************************//

  const inputPicture = useRef<HTMLInputElement | null>(null);
  let [image, setImage] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isDisliked, setIsDisliked] = useState<boolean>();
  const [info, setInfo] = useState<Info>();

  const onUploadPictureClick = () => {
    // `current` points to the mounted file input element
    if (inputPicture.current) {
      inputPicture.current.click();
    }
  };

  // useEffect(() => {
  //   if (!isEmpty(error)) {
  //     toast.error(error);
  //   }
  // }, [error]);

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

  const [gifBoxIsOpen, setGifBoxIsOpen] = useState<boolean>(false);
  //Set a color for the frame

  let [gifUrl, setGifUrl] = useState<string>("");
  const addGif = (gify: any) => {
    if (gifBoxIsOpen === false) {
      setGifBoxIsOpen(!gifBoxIsOpen);
    }
    let gifUrl = gify.images.downsized.url;
    setGifUrl(gifUrl);
    setUploadedVideo(gify.images.downsized);
  };

  const closeGif = () => {
    gifUrl = "";
    setGifUrl(gifUrl);
    setGifBoxIsOpen(!gifBoxIsOpen);
  };

  //************************** Emojie Handeling **************************//
  //************************** Emojie Handeling **************************//
  //************************** Emojie Handeling **************************//

  const emoji = useRef<any>(null);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);

  useEffect(() => {
    // only add the event listener when the emoji is opened
    if (!showEmojis) return;
    function handleClick(event: any) {
      if (emoji.current && !emoji.current.contains(event.target)) {
        setShowEmojis(false);
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

  useEffect(() => {
    if (!isEmpty(comment)) {
      fetchInfo();
      fetchLiked();
      fetchDisliked();
    }
  }, [comment]);

  const handleAddReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (image.length > 0) {
      await dispatch(
        replyComment({
          user_id: authUser?.id,
          content: input,
          comment_id: comment?.id,
          post_id: post?.id,
          image: uploadedImage,
        })
      ).then(() => {
        setInput("");
        closePicture();
        fetchInfo();
      });
    } else if (gifUrl.length > 0) {
      await dispatch(
        replyComment({
          user_id: authUser?.id,
          content: input,
          comment_id: comment?.id,
          post_id: post?.id,
          gif: gifUrl,
        })
      ).then(() => {
        setInput("");
        closeGif();
        fetchInfo();
      });
    } else {
      await dispatch(
        replyComment({
          user_id: authUser?.id,
          content: input,
          comment_id: comment?.id,
          post_id: post?.id,
        })
      ).then(() => {
        setInput("");
        fetchInfo();
      });
    }
    refetchReplies();
  };

  const handleLikeComment = async () => {
    dispatch(
      likeComment({
        comment_id: comment?.id,
        user_id: authUser?.id,
      })
    ).then(() => {
      fetchLiked();
      fetchDisliked();
      fetchInfo();
    });
  };

  const handleDislikeComment = async () => {
    dispatch(
      dislikeComment({
        comment_id: comment?.id,
        user_id: authUser?.id,
      })
    ).then(() => {
      fetchLiked();
      fetchDisliked();
      fetchInfo();
    });
  };

  const fetchLiked = async () => {
    await dispatch(fetchIsLikedComment(comment?.id)).then((result: any) => {
      setIsLiked(result);
    });
  };

  const fetchDisliked = async () => {
    await dispatch(fetchIsDislikedComment(comment?.id)).then((result: any) => {
      setIsDisliked(result);
    });
  };

  const fetchInfo = async () => {
    await dispatch(fetchCommentInfo(comment?.id)).then((result: any) => {
      setInfo(result);
    });
  };

  const componentDecorator = (href: string, text: string, key: number) => {
    return (
      <a
        onClick={async (e) => {
          e.stopPropagation();
        }}
        href={href}
        key={key}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-400"
      >
        {text}
      </a>
    );
  };

  const [data, setData] = useState<any>([]);

  const handleSearch = async (e: any) => {
    dispatch(
      searchTagUsers({
        search: e,
      })
    ).then((res: any) => setData(res));
  };

  return (
    <div className="relative border-b dark:border-lightgray flex flex-col p-4">
      <div className="flex space-x-2">
        <Link
          href={{
            pathname: "/dashboard/profile",
            query: { user_id: comment?.otherUser?.id },
          }}
          as={`/dashboard/profile?${encodeQuery(
            comment?.otherUser?.id,
            "profile"
          )}`}
          className="relative flex flex-col w-fit h-fit group"
        >
          <div className={`relative rounded-md`}>
            <Image
              src={
                !isEmpty(comment?.otherUser?.frameName)
                  ? `/${comment?.otherUser?.frameName}`
                  : "/images/frames/frame4.jpg"
              }
              alt="pfp"
              className="relative w-16 h-16 border-white"
              width={2000}
              height={2000}
            />
            <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto w-[55px] h-[55px] bg-white dark:bg-darkgray">
              <Image
                src={
                  !isEmpty(comment?.otherUser?.profilePic)
                    ? `${config.url.PUBLIC_URL}/${comment?.otherUser?.profilePic?.name}`
                    : "/images/pfp/pfp1.jpg"
                }
                alt="pfp"
                className="absolute top-0 bottom-0 left-0 right-0 mx-auto object-cover my-auto w-[50px] h-[50px] z-0 rounded-sm"
                width={2000}
                height={2000}
              />
            </div>
            <div className={`absolute -bottom-2 -left-3 flex rounded-lg`}>
              <div className="relative">
                <Image
                  src={
                    !isEmpty(comment?.otherUser?.frameName)
                      ? `/${comment?.otherUser?.frameName}`
                      : "/images/frames/frame4.jpg"
                  }
                  alt="pfp"
                  className="relative w-7 h-7"
                  width={2000}
                  height={2000}
                />
                <div className="absolute top-0 bottom-0 left-0 right-0 mx-auto my-auto w-[24px] h-[24px] z-[1] flex items-center justify-center text-black dark:text-white font-semibold text-sm bg-white dark:bg-darkgray">
                  {comment?.otherUser?.level}
                </div>
              </div>
            </div>
          </div>
        </Link>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <Link
              href={{
                pathname: "/dashboard/profile",
                query: { user_id: comment?.otherUser?.id },
              }}
              as={`/dashboard/profile?${encodeQuery(
                comment?.otherUser?.id,
                "profile"
              )}`}
              className="flex items-center"
            >
              <p className="mr-1 text-xs md:text-sm font-semibold">
                @{comment?.otherUser?.name}
              </p>
              {comment?.otherUser?.level == 20 && (
                <img src="/images/badges/verified.png" className="w-3 h-3 md:w-4 md:h-4" />
              )}
            </Link>
          </div>
          <div className="flex flex-col items-start justify-start">
            <TimeAgo
              date={comment?.createdAt}
              className="text-xs text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center space-y-2 w-full mt-4">
        {!isEmpty(comment?.content) && (
          <p className="text-sm md:text-md break-words whitespace-pre-line w-fit max-w-full">
            <Linkify componentDecorator={componentDecorator}>
              {renderHTML(renderComment(comment?.content))}
            </Linkify>
          </p>
        )}
        {comment?.imgName != null ? (
          <img
            src={`${config.url.PUBLIC_URL}/${comment?.imgName}`}
            alt="Post"
            className="rounded-lg max-w-full object-contain max-h-[400px]"
          />
        ) : null}
        {comment?.gif != null ? (
          <img
            src={comment?.gif}
            alt="gif"
            className="rounded-lg max-w-full object-contain max-h-[400px]"
          />
        ) : null}
      </div>
      <div className="flex items-center justify-start w-full mt-4 mb-2 p-3 border border-gray-50 bg-gray-50 dark:bg-lightgray dark:border-lightgray rounded-md">
        <div className="flex items-center justify-between w-full space-x-4">
          <div
            className="flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-green-600 group"
            onClick={() => handleLikeComment()}
          >
            <div
              className={`flex items-center justify-center p-1 border rounded-md ${
                isLiked
                  ? "border-green-600 bg-green-600"
                  : "dark:border-gray-400 group-hover:border-green-600"
              }`}
            >
              <FavoriteIcon
                className={`h-4 w-4 cursor-pointer ${
                  isLiked ? "text-white" : "group-hover:text-green-600"
                } `}
                sx={{ fontSize: 20 }}
              />
            </div>
            <p
              className={`text-xs ${
                isLiked ? "text-green-600" : "group-hover:text-green-600"
              }`}
            >
              {info?.likes != null || undefined ? info?.likes : 0}
            </p>
          </div>
          <div
            className="flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-red-600 group"
            onClick={() => handleDislikeComment()}
          >
            <div
              className={`flex items-center justify-center p-1 border rounded-md ${
                isDisliked
                  ? "border-red-600 bg-red-600"
                  : "dark:border-gray-400 group-hover:border-red-600"
              }`}
            >
              <HeartBrokenIcon
                className={`h-4 w-4 cursor-pointer ${
                  isDisliked ? "text-white" : "group-hover:text-red-600"
                } `}
                sx={{ fontSize: 20 }}
              />
            </div>
            <p
              className={`text-xs ${
                isDisliked ? "text-red-600" : "group-hover:text-red-600"
              }`}
            >
              {info?.dislikes != null || undefined ? info?.dislikes : 0}
            </p>
          </div>
          <div className="flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-black dark:hover:text-white group">
            <div className="flex items-center justify-center p-1 border rounded-md group-hover:border-black dark:border-gray-400 dark:group-hover:border-white">
              <CommentOutlinedIcon
                className="h-4 w-4 cursor-pointer"
                sx={{ fontSize: 20 }}
              />
            </div>
            <p className="text-xs">
              {info?.replies != null || undefined ? info?.replies : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p>
          Comments :{" "}
          <span className="font-bold">
            {info?.replies != null || undefined ? info?.replies : 0}
          </span>
        </p>
      </div>
      <form
        onSubmit={handleAddReply}
        className="mt-3 flex items-start justify-end space-x-3"
      >
        <div className="flex flex-col items-end justify-center w-full">
          {/* <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-lg bg-gray-200 dark:bg-lightgray dark:group-hover:bg-darkgray p-2 outline-none w-full"
            type="text"
            placeholder="Write a comment..."
          /> */}
          <div className="hidden dark:inline dark:w-full">
            <MentionsInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              classNames={darkMode}
              placeholder="Write a comment..."
            >
              <Mention
                className={`${darkMode.mentions__mention}`}
                trigger="@"
                data={data}
                markup="@@@______id____^^______display____@@@^^^"
              />
              <Mention
                trigger="@"
                data={(e) => {
                  handleSearch(e);
                }}
                markup="@@@______id____^^______display____@@@^^^"
              />
            </MentionsInput>
          </div>
          <div className="dark:hidden w-full">
            <MentionsInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              classNames={lightMode}
              placeholder="Write a comment..."
            >
              <Mention
                className={`${lightMode.mentions__mention}`}
                trigger="@"
                data={data}
                markup="@@@______id____^^______display____@@@^^^"
              />
              <Mention
                trigger="@"
                data={(e) => {
                  handleSearch(e);
                }}
                markup="@@@______id____^^______display____@@@^^^"
              />
            </MentionsInput>
          </div>
          <div className="flex items-center justify-end w-full py-3">
            <div className="flex items-end justify-end relative space-x-2 text-[#181c44] dark:text-white">
              {!gifUrl && (
                <PhotoIcon
                  onClick={() => onUploadPictureClick()}
                  className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
                />
              )}
              <input
                type="file"
                id="file"
                ref={inputPicture}
                className="hidden"
                accept="image/*"
                onChange={handleUploadPicture}
              />
              <FaceSmileIcon
                ref={emoji}
                onClick={() => setShowEmojis(!showEmojis)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              {showEmojis && (
                <div className="absolute -right-20 top-6 z-40">
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
              <div ref={gif}>
                {!image && (
                  <GifIcon
                    onClick={() => setShowGifs((b) => !b)}
                    className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
                  />
                )}
                {showGifs && (
                  <div className="absolute -right-20 top-6 z-[1] p-2 bg-white dark:bg-darkgray border border-gray-200 dark:border-lightgray rounded-lg">
                    <ReactGiphySearchbox
                      apiKey="MfOuTXFXq8lOxXbxjHqJwGP1eimMQgUS" // Required: get your on https://developers.giphy.com
                      onSelect={(item: any) => addGif(item)}
                      mansonryConfig={[
                        { columns: 2, imageWidth: 140, gutter: 10 },
                        {
                          mq: "700px",
                          columns: 3,
                          imageWidth: 200,
                          gutter: 10,
                        },
                        {
                          mq: "1000px",
                          columns: 4,
                          imageWidth: 220,
                          gutter: 10,
                        },
                      ]}
                      wrapperClassName="p-4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {image && (
            <div className="relative w-full mt-2">
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
              <hr className="mt-4 mb-4"></hr>
            </div>
          )}
          {gifBoxIsOpen && (
            <div className="relative w-full">
              <img
                src={gifUrl}
                className="rounded-lg max-w-full h-auto"
                width="200px"
                height="200px"
              />
              <div
                onClick={() => closeGif()}
                className="flex items-center justify-center absolute top-2 left-2 w-7 h-7 rounded-full p-1 cursor-pointer bg-white dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray"
              >
                <XMarkIcon className="w-5 h-5" />
              </div>
              <hr className="mt-4 mb-4"></hr>
            </div>
          )}
        </div>
        <div className="flex items-end h-full">
          <button
            disabled={!input && !image && !gifUrl}
            type="submit"
            className="text-blockd font-semibold disabled:text-gray-200 dark:disabled:text-gray-700 p-2 rounded-full disabled:hover:bg-transparent hover:bg-orange-500 hover:text-white"
          >
            <span className="hidden md:inline">Comment</span>
            <span className="flex md:hidden">
              <PaperAirplaneIcon className="w-5 h-5" />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default MainComment;
