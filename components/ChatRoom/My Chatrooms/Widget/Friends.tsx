import React from 'react'

import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

function Friends() {
    return (
        <div className='max-h-screen scrollbar-hide overflow-scroll dark:bg-darkgray'>
            <div className='flex items-center justify-between p-2 w-full space-x-4 hover:bg-gray-100 dark:hover:bg-lightgray cursor-pointer group'>
                <div className='flex items-center justify-start p-2'>
                    <div className='flex items-center justify-center'>
                        <img src="/images/pfp/pfp1.jpg" className='w-10 h-10 rounded-full' />
                    </div>
                    <div className='flex flex-col items-start justify-start ml-4'>
                        <div className='flex items-center justify-center space-x-2'>
                            <span className='text-base font-semibold'>@Crypto_Crazy</span>
                            <span className='w-3 h-3 bg-green-500 rounded-full'></span>
                        </div>
                        <span className='text-xs'>Last seen Recently</span>
                    </div>
                </div>
                <div className='flex items-center justify-center space-x-1'>
                    <PersonAddAlt1RoundedIcon className='w-6 h-6 hidden group-hover:inline hover:text-gray-600 dark:hover:text-gray-200'/>
                    <ClearRoundedIcon className='w-6 h-6 hidden group-hover:inline hover:text-gray-600 dark:hover:text-gray-200'/>
                </div>
            </div>
            <div className='flex items-center justify-between p-2 w-full space-x-4 hover:bg-gray-100 dark:hover:bg-lightgray cursor-pointer group'>
                <div className='flex items-center justify-start p-2'>
                    <div className='flex items-center justify-center'>
                        <img src="/images/pfp/pfp2.jpg" className='w-10 h-10 rounded-full' />
                    </div>
                    <div className='flex flex-col items-start justify-start ml-4'>
                        <span className='text-base font-semibold'>@Egoist</span>
                        <span className='text-xs'>Last seen Recently</span>
                    </div>
                </div>
                <div className='flex items-center justify-center space-x-1'>
                    <ClearRoundedIcon className='w-6 h-6 hidden group-hover:inline hover:text-gray-600 dark:hover:text-gray-200'/>
                </div>
            </div>
            <div className='flex items-center justify-between p-2 w-full space-x-4 hover:bg-gray-100 dark:hover:bg-lightgray cursor-pointer group'>
                <div className='flex items-center justify-start p-2'>
                    <div className='flex items-center justify-center'>
                        <img src="/images/pfp/pfp3.jpg" className='w-10 h-10 rounded-full' />
                    </div>
                    <div className='flex flex-col items-start justify-start ml-4'>
                        <div className='flex items-center justify-center space-x-2'>
                            <span className='text-base font-semibold'>@Monkey_Crypto</span>
                            <span className='w-3 h-3 bg-green-500 rounded-full'></span>
                        </div>
                        <span className='text-xs'>Last seen Recently</span>
                    </div>
                </div>
                <div className='flex items-center justify-center space-x-1'>
                    <ClearRoundedIcon className='w-6 h-6 hidden group-hover:inline hover:text-gray-600 dark:hover:text-gray-200'/>
                </div>
            </div>
        </div>
    )
}

export default Friends