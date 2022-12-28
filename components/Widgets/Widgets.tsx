import React from 'react'
import {
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import TrendingChatrooms from './TrendingChatrooms'
import TrendingStreams from './TrendingStreams'

function Widgets() {
  return (
    <div className='h-full px-2 col-span-2 hidden md:inline md:p-4 max-h-screen scrollbar-hide overflow-scroll '>
      {/* Search */}
      <div className='flex items-center space-x-2 bg-gray-100 p-2 dark:bg-darkgray rounded-full dark:border-white dark:hover:border-blockd border group'>
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 dark:text-white dark:group-hover:text-blockd" />
        <input 
          type="text" 
          placeholder="Search Blockd" 
          className='flex-1 outline-none bg-transparent'/>
      </div>
      <TrendingChatrooms />
      <TrendingStreams />
    </div>
  )
}

export default Widgets