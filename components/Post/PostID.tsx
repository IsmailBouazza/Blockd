import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import Picture from '../Feed/Picture'
import TimeAgo from 'react-timeago'
import {
    ArrowUpIcon,
    ArrowDownIcon,
    ChatBubbleBottomCenterTextIcon,
    ShareIcon,
    FaceSmileIcon,
    PhotoIcon,
    EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Picker from '@emoji-mart/react'

function PostID() {

    let [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const [input, setInput] = useState<string>('')
    const [image, setImage] = useState<string>('')
    const [showEmojis, setShowEmojis] = useState<boolean>(false)

    const dropdown = useRef<any>(null);

    useEffect(() => {
        // only add the event listener when the dropdown is opened
        if (!isDropdownVisible) return;
        function handleClick(event: any) {
            if (isDropdownVisible === true) {
                console.log('hello')
                if (dropdown.current && !dropdown.current.contains(event.target)) {
                    setIsDropdownVisible(false);
                }
            }
        }
        window.addEventListener("click", handleClick);
        // clean up
        return () => window.removeEventListener("click", handleClick);
    }, [isDropdownVisible]);

    const emoji = useRef<any>(null);

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

    const imageInputRef = useRef<HTMLInputElement>(null)

    const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

    }

    const addImageToPost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!imageInputRef.current?.value) return;

        setImage(imageInputRef.current.value)
        imageInputRef.current.value = ''
        setImageUrlBoxIsOpen(false);
    }

    const addEmoji = (e: any) => {
        const sym = e.unified.split("-")
        const codesArray: any[] = []
        sym.forEach((el: any) => codesArray.push("0x" + el))
        const emoji = String.fromCodePoint(...codesArray)
        setInput(input + emoji)
    }

    return (
        <div className='flex flex-col space-x-3 p-4 -z-20 border-y'>
            <div className='w-full'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-start space-x-2'>
                        <div className='flex'>
                            <Link href="/dashboard/profile" className='relative flex flex-col w-fit h-fit group'>
                                <div className='relative flex flex-col p-1 animate-colorChange rounded-lg'>
                                    <Image
                                        src="/images/pfp/pfp2.jpg"
                                        alt='pfp'
                                        className='min-w-16 min-h-16 rounded-md shadow-sm'
                                        width={60}
                                        height={60} />
                                    <div className='absolute -bottom-3 -left-2 flex p-1 w-7 h-7 animate-colorChange rounded-lg'>
                                        <div className='flex items-center justify-center text-black font-semibold rounded-md w-full h-full text-xs bg-white '>
                                            15
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='flex flex-col items-start justify-center space-y-1'>
                            <div className='flex items-center space-x-1'>
                                <p className='mr-1 font-semibold text-l'>@Egoist</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500'>14K followers</p>
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>
                                    <TimeAgo
                                        date='Aug 29, 2022'
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div ref={dropdown} className='flex items-center justify-center'>
                        <EllipsisHorizontalIcon onClick={() => setIsDropdownVisible(b => !b)} className='w-7 h-7 cursor-pointer' />
                        <div className='relative z-0 flex ite'>
                            <ul className={`absolute top-4 right-0 w-32 cursor-pointer bg-white dark:bg-lightgray rounded-lg shadow-xl ${isDropdownVisible ? '' : 'hidden'}`}>
                                <div className="flex items-center justify-start  p-3 hover:bg-gray-200 hover:font-semibold hover:rounded-t-md dark:hover:bg-darkgray/50">Hide Post</div>
                                <div className="flex items-center justify-start  p-3 hover:bg-gray-200 hover:font-semibold dark:hover:bg-darkgray/50">Report Post</div>
                                <div className="flex items-center justify-start  p-3 hover:bg-gray-200 hover:font-semibold hover:rounded-b-md dark:hover:bg-darkgray/50">Follow Post</div>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <Image
                        src="/images/post1.jpg"
                        alt='Post'
                        className='m-5 ml-0 mb-1 rounded-lg w-full max-h-80 shadow-sm'
                        width={2000}
                        height={2000} />
                    <p className='pt-4 ml-3 font-semibold'>This is a Demo Post</p>
                </div>
            </div>
            <div className='flex justify-between mt-5'>
                <div className='flex'>
                    <div className='flex cursor-pointer items-center space-x-1 text-gray-400 hover:text-green-600 group'>
                        <p className='text-xs group-hover:text-green-600'>150K</p>
                        <ArrowUpIcon className='h-5 w-5 cursor-pointer transition-transform ease-out duration-150 hover:scale-150' />
                    </div>
                    <div className='flex cursor-pointer items-center space-x-1 text-gray-400 hover:text-red-600 group'>
                        <ArrowDownIcon className='h-5 w-5 cursor-pointer transition-transform ease-out duration-150 hover:scale-150' />
                        <p className='text-xs group-hover:text-red-600'>10K</p>
                    </div>
                    <div className='flex cursor-pointer items-center space-x-1 ml-3 text-gray-400 hover:text-black'>
                        <ChatBubbleBottomCenterTextIcon className='h-5 w-5  cursor-pointer transition-transform ease-out duration-150 hover:scale-150' />
                        <p className='text-xs'>168</p>
                    </div>
                    <div className='flex cursor-pointer items-center space-x-1 ml-3 text-gray-400 hover:text-black'>
                        <ShareIcon className='h-5 w-5  cursor-pointer transition-transform ease-out duration-150 hover:scale-150' />
                        <p className='text-xs'>10</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='mt-3 flex space-x-3'>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className='flex-1 rounded-lg bg-gray-100 dark:bg-lightgray p-2 outline-none'
                    type="text"
                    placeholder='Write a comment...'
                />
                <button
                    disabled={!input}
                    type="submit"
                    className='text-blockd disabled:text-gray-200'>Post
                </button>
            </form>

            <div className='flex items-center justify-end'>
                <div className='flex items-center justify-end relative space-x-2 pr-10 text-[#181c44] dark:text-white flex-1 mt-2'>
                    <PhotoIcon
                        onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                        className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150'
                    />
                    <FaceSmileIcon
                        ref={emoji}
                        onClick={() => setShowEmojis(!showEmojis)}
                        className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150' />
                    {showEmojis && (
                        <div className='absolute righy-0 top-7 z-40'>
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
            </div>

            {imageUrlBoxIsOpen && (
                <form className='rounded-lg mt-3 flex bg-blockd/80 py-2 px-4'>
                    <input
                        ref={imageInputRef}
                        className='flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white'
                        type="text"
                        placeholder='Enter Image URL...'
                    />
                    <button
                        type='submit'
                        onClick={addImageToPost}
                        className='font-bold text-white'
                    >
                        Add Image
                    </button>
                </form>
            )}
            {image && (
                <img className='mt-10 h-40 w-full rounded-xl object-contain shadow-lg' src={image} alt='' />
            )}
        </div>
    )
}

export default PostID