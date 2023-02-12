import Head from 'next/head'
import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SearchPage from '../components/Search/SearchPage'
import Sidebar from '../components/Sidebar/Sidebar'
import Widgets from '../components/Widgets/Widgets'

function search() {
  return (
    <div className='bg-white dark:bg-darkgray flex flex-col items-center justify-center mx-auto h-screen overflow-hidden'>
      <Head>
        <title>Blockd</title>
      </Head>
      <Navbar />
      <div className='bg-white dark:bg-darkgray grid grid-cols-9 mx-auto lg:max-w-7xl overflow-hidden w-full'>
      <Sidebar />
      <SearchPage />
      <Widgets />
      </div>
    </div>
  )
}

export default search