import Image from 'next/image'
import React, { useState, useEffect, useRef, FC } from 'react'
import {
  GifIcon,
  FaceSmileIcon,
  MapPinIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch } from '../../stores/hooks'
import { createPost } from '../../stores/post/PostActions'
import Picker from '@emoji-mart/react'
import Link from 'next/link'
import ReactGiphySearchbox from 'react-giphy-searchbox'
import toast from 'react-hot-toast'
import { isEmpty } from 'lodash'

interface Props {
  refetchFiltered: () => void;
}

function TweetBox({ refetchFiltered }: Props) {

  const [input, setInput] = useState<string>('')
  let [image, setImage] = useState<string>('')
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [uploadedVideo, setUploadedVideo] = useState<string>('')
  const dispatch = useAppDispatch()

  //************************** EMOJI Handeling **************************//
  //************************** EMOJI Handeling **************************//
  //************************** EMOJI Handeling **************************//

  const [showEmojis, setShowEmojis] = useState<boolean>(false)

  const emoji = useRef<any>(null);

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
    const sym = e.unified.split("-")
    const codesArray: any[] = []
    sym.forEach((el: any) => codesArray.push("0x" + el))
    const emoji = String.fromCodePoint(...codesArray)
    setInput(input + emoji)
  }

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
    image = ''
    setImage(image)
    setUploadedImage('')
    setUploadedVideo('')
  }

  //************************** GIF Handeling **************************//
  //************************** GIF Handeling **************************//
  //************************** GIF Handeling **************************//

  const [showGifs, setShowGifs] = useState<boolean>(false)

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

  const [gifBoxIsOpen, setGifBoxIsOpen] = useState<boolean>(false)
  //Set a color for the frame   

  let [gifUrl, setGifUrl] = useState<string>('')
  const addGif = (gify: any) => {
    if (gifBoxIsOpen === false) {
      setGifBoxIsOpen(!gifBoxIsOpen)
    }
    console.log(gify);
    let gifUrl = gify.images.downsized.url
    setGifUrl(gifUrl)
    setUploadedVideo(gify.images.downsized);
  }

  const closeGif = () => {
    gifUrl = ''
    setGifUrl(gifUrl)
    setGifBoxIsOpen(!gifBoxIsOpen)
  }

  const handleSubmitPost = async (e: any) => {
    e.preventDefault();
    if (image.length > 0) {
      await dispatch(createPost({
        content: input,
        public: 1,
        image: uploadedImage,
      })).then(() => {
        refetchFiltered();
        closePicture();
        setInput('');
      });
    }
    else if (gifUrl.length > 0) {
      await dispatch(createPost({
        content: input,
        public: 1,
        gif: gifUrl,
      })).then(() => {
        refetchFiltered();
        setInput('');
        closeGif();
      });
    }
    else {
      await dispatch(createPost({
        content: input,
        public: 1,
      })).then(() => {
        refetchFiltered();
        setInput('');
      });
    }
    const refreshToast = toast.loading('Posting...');
    await new Promise(f => setTimeout(f, 500));
    toast.success('Posted!', {
      id: refreshToast,
    })
  }

  return (
    <div className='flex space-x-2 p-4 border-y dark:bg-lightgray'>
      <Link href="/dashboard/profile" className='relative flex flex-col h-fit group'>
        <div className='relative flex flex-col p-1 animate-colorChange rounded-lg'>
          <Image
            src="/images/pfp/pfp1.jpg"
            alt='pfp'
            className='w-16 h-16 rounded-md shadow-sm'
            width={2000}
            height={2000} />
          <div className='absolute -bottom-3 -left-2 flex p-1 w-7 h-7 animate-colorChange rounded-lg'>
            <div className='flex items-center justify-center text-black font-semibold rounded-md w-full h-full text-xs bg-white '>
              0
            </div>
          </div>
        </div>
      </Link>
      <div className='flex flex-1 items-center pl-2'>
        <form className='flex flex-col flex-1'>
          <textarea
            id="message"
            maxLength={1000}
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            data-rows="4"
            className="pt-6 h-24 w-full text-black dark:text-white outline-none text-l bg-transparent"
            placeholder="What's the word on the block?"
          ></textarea>
          <hr className='mb-4'></hr>
          {gifBoxIsOpen && (
            <div className='relative w-full'>
              <img src={gifUrl} className="rounded-lg max-w-full h-auto" width="200px" height="200px" />
              <div onClick={() => closeGif()} className='flex items-center justify-center absolute top-2 left-2 w-7 h-7 rounded-full p-1 cursor-pointer bg-white dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray'>
                <XMarkIcon className='w-5 h-5' />
              </div>
              <hr className='mt-4 mb-4'></hr>
            </div>
          )}
          {image && (
            <div className='relative w-full'>
              <img className='max-w-full max-h-[300px] h-auto object-contain rounded-md' src={image} alt='' />
              <div onClick={() => closePicture()} className='flex items-center justify-center absolute top-2 left-2 w-7 h-7 rounded-full p-1 cursor-pointer bg-white dark:bg-lightgray hover:bg-gray-200 dark:hover:bg-darkgray'>
                <XMarkIcon className='w-5 h-5' />
              </div>
              <hr className='mt-4 mb-4'></hr>
            </div>
          )}

          <div className='flex items-center'>
            <div className='flex relative space-x-2 text-[#181c44] dark:text-white flex-1'>
              {!gifUrl &&
                <PhotoIcon
                  onClick={() => onUploadPictureClick()}
                  className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150'
                />
              }
              <FaceSmileIcon
                ref={emoji}
                onClick={() => setShowEmojis(b => !b)}
                className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150' />
              {showEmojis && (
                <div className='absolute left-5 top-7 z-[1]'>
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
                {!image &&
                  <GifIcon
                    onClick={() => setShowGifs(b => !b)}
                    className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150' />
                }
                {showGifs && (
                  <div className='absolute left-0 top-7 z-[1] p-2 bg-white dark:bg-darkgray border border-gray-200 dark:border-lightgray rounded-lg'>
	
                    <ReactGiphySearchbox
                      apiKey="MfOuTXFXq8lOxXbxjHqJwGP1eimMQgUS" // Required: get your on https://developers.giphy.com
                      onSelect={(item: any) => addGif(item)}
                      mansonryConfig={[
                        { columns: 2, imageWidth: 140, gutter: 10 },
                        { mq: '700px', columns: 3, imageWidth: 200, gutter: 10 },
                        { mq: '1000px', columns: 4, imageWidth: 220, gutter: 10 },
                      ]}
                      wrapperClassName="p-4"
                    />

                  </div>
                )}
              </div>
            </div>
            <button
              disabled={!input && !image && !gifUrl}
              className='bg-blockd px-5 py-2 font-bold text-white rounded-full disabled:opacity-40 disabled:z-[0]'
              onClick={(e) => handleSubmitPost(e)}
            >
              Post
            </button>
          </div>
          <input
            type='file'
            id='file'
            ref={inputPicture}
            className="hidden"
            accept='image/*'
            onChange={handleUploadPicture}
          />
        </form>
      </div>
    </div>
  )
}

export default TweetBox
