import React, { HtmlHTMLAttributes, useEffect, useRef, useState, useLayoutEffect } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import TweetBox from './TweetBox'
import toast from 'react-hot-toast'
import PostTest from './Post'
import { fetchTrendingPosts, fetchFilteredPosts } from '../../stores/post/PostActions'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { isEmpty } from 'lodash'
import { fetchAuthUser } from '../../stores/authUser/AuthUserActions'
import { useRouter } from 'next/router'

interface Post {
  id: number;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  hasImg: boolean;
  userId: number;
  gif: string;
}

interface Filtered {
  posts: Post[];
}

function Feed() {

  const dispatch = useAppDispatch();
  const router = useRouter()
  const { isRegistered } = router.query;

  const { isFetchingFilteredPosts, filteredPosts } = useAppSelector((state) => state.postReducer);
  const [showModal1, setShowModal1] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [endCount, setEndCount] = useState<number>(4);
  const [endTotal, setEndTotal] = useState<number>(4);
  const [filtered, setFiltered] = useState<Filtered | any>([]);

  let [atTop, setAtTop] = useState<boolean>(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef?.current?.scrollTop !== 0) {
        atTop = true
        setAtTop(atTop);
      } else {
        atTop = false
        setAtTop(atTop);
      }

    };
    elementRef?.current?.addEventListener("scroll", handleScroll);
    return () => {
      elementRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchAuthUser());
    setFiltered(undefined);
    fetchFiltered();
  }, []);

  const fetchFiltered = async () => {
    await dispatch(fetchFilteredPosts({
      start: 0,
      end: 4
    })).then((result: any) => {
      setEndTotal(4);
      setEndCount(4);
      setFiltered(result?.posts);
    });
  };

  const updateFiltered = async (start: number, end: number) => {
    await dispatch(fetchFilteredPosts({
      start: start,
      end: end
    })).then((result: any) => {
      const newPosts = filtered?.concat(result?.posts);
      setEndTotal(result?.total)
      setFiltered(newPosts);
    });
  };

  const goToTopOfPage = () => {
    const element = document.getElementById('top-page');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing...');
    await fetchFiltered();
    await new Promise(f => setTimeout(f, 1000));
    toast.success('Feed Updated!', {
      id: refreshToast,
    })
  };
  
  const handleScroll = async () => {
    
    if (elementRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = elementRef.current;
      if (scrollTop + clientHeight === scrollHeight || scrollTop + clientHeight === scrollHeight-0.5) {
        
        if(!isFetchingFilteredPosts){
        if(endTotal < 4) {
         
          return;

        }else {
        updateFiltered(endCount + 1, endCount + 5);
        setEndCount(endCount + 5);
        }
      }
      }
    }
  }

  return (
    <div
      onScrollCapture={() =>
        handleScroll()
      }
      ref={elementRef}
      className='relative max-h-screen scrollbar-hide overflow-scroll col-span-8 md:col-span-5 pb-14'
    >
      <div id="top-page"></div>
      <div className={`flex items-center z-[2] ${atTop === false ? 'justify-end' : 'justify-between'} sticky top-0 p-4 backdrop-blur-md bg-white/30 dark:bg-darkgray/30`}>
        {atTop &&
          <ChevronDoubleUpIcon onClick={() => goToTopOfPage()} className='w-6 h-6 cursor-pointer' />
        }
        <ArrowPathIcon
          onClick={handleRefresh}
          className='flex items-center justify-end h-6 w-6 cursor-pointer text-black dark:text-white transition-all duration-500 ease-out hover:rotate-180 active-scale'
        />
      </div>

      <div>
        <TweetBox refetchFiltered={fetchFiltered} />
        <div className='p-4'>
          {

            filtered &&
            filtered?.map((post: Post, index: number) => (
              // @ts-ignore
              <PostTest
                key={`${index}-post`}
                // @ts-ignore
                post={post}
                refetch={handleRefresh}
              />

            ))
          }
          {
            isFetchingFilteredPosts &&
            <p className="flex items-center justify-center space-x-3 p-4">Loading ...</p>
          }
        </div>
      </div>
      {
        isRegistered != undefined &&
        <div className={`fixed top-0 left-0 flex p-4 items-center justify-center min-h-screen w-full h-full backdrop-blur-md bg-white/60 z-50 ${showModal1 ? '' : 'hidden'}`}>
          <div className="relative w-full rounded-lg shadow-lg max-w-md h-fit bg-gray-50 scrollbar-hide overflow-scroll">
            <div className="sticky top-0 rounded-t-lg backdrop-blur-md bg-white/30">
              <div className="p-4">
                <h3 className="text-xl font-medium text-gray-900">Welcome to Blockd</h3>
              </div>
            </div>
            <div className='flex items-center justify-start p-4 border-y text-black text-justify'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec varius nibh. Quisque vel justo et
              lacus imperdiet finibus. Ut pharetra justo orci. Sed consectetur interdum purus. Cras accumsan
              hendrerit lectus at aliquet. Donec posuere non tortor eget rutrum. Vivamus a volutpat nibh.
              Nullam quis laoreet enim, venenatis faucibus lacus. Suspendisse a vulputate nisl, vestibulum porttitor
              lacus. Aliquam pretium pharetra ultricies. Proin id magna iaculis, vestibulum ipsum sit amet, rutrum mi.
              Fusce pretium eros tortor, quis auctor sem condimentum et. Aliquam sapien lectus, molestie eu lectus sed,
              scelerisque ultrices sem. Nullam in velit vitae metus venenatis laoreet eu vel velit. Morbi rutrum erat
              tempus ante luctus sagittis.
            </div>
            <div className='flex items-center justify-end space-x-3 p-4'>
              <p onClick={() => { setShowModal1(false); setShowModal2(true); }} className='p-2 px-5 cursor-pointer rounded-md bg-gray-400 hover:bg-gray-500 text-white'>Next</p>
            </div>
          </div>
        </div>
      }
      <div className={`fixed top-0 left-0 p-4 flex items-center justify-center min-h-screen w-full h-full backdrop-blur-md bg-white/60 z-50 overflow-scroll scrollbar-hide ${showModal2 ? '' : 'hidden'}`}>
        <div className="relative w-full rounded-lg shadow-lg max-w-md h-fit bg-gray-50 overflow-scroll scrollbar-hide">
          <div className="sticky top-0 rounded-t-lg backdrop-blur-md bg-white/30">
            <div className="p-4">
              <h3 className="text-xl font-medium text-gray-900">Welcome to Blockd</h3>
            </div>
          </div>
          <div className='flex items-center justify-start p-4 border-y text-black text-justify'>
            Ut malesuada risus in vestibulum sollicitudin. Sed lacinia nulla et interdum pharetra.
            Duis ut metus augue. Proin ac lacus nisl. Nunc eget nisi efficitur eros porttitor gravida.
            Ut eu urna lectus. Nullam et placerat velit. Nullam faucibus erat ac neque placerat, in scelerisque
            lectus eleifend. Nunc nibh tellus, molestie sit amet ornare sit amet, congue eu ipsum.
            Vivamus non magna eu orci tincidunt tristique. Phasellus nulla est, placerat nec enim at,
            commodo lacinia purus. Quisque suscipit metus nibh, at faucibus erat tempor non. Ut eget libero
            ultrices, facilisis urna ullamcorper, accumsan quam. Donec risus elit, sagittis at nisl ut,
            luctus consectetur mi.
          </div>
          <div className='flex items-center justify-end space-x-3 p-4'>
            <p onClick={() => { setShowModal1(true); setShowModal2(false); }} className='p-2 px-5 cursor-pointer rounded-md bg-gray-400 hover:bg-gray-500 text-white'>Back</p>
            <p onClick={() => { setShowModal1(false); setShowModal2(false); }} className='p-2 px-5 cursor-pointer rounded-md bg-gray-400 hover:bg-gray-500 text-white'>Start</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed
