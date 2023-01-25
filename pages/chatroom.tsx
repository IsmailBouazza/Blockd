import Head from 'next/head'
import React from 'react'
import Chatbar from '../components/ChatRoom/Chatbar/Chatbar'
import Chatbox from '../components/ChatRoom/Chatbox/Chatbox'
import Sidebar from '../components/ChatRoom/Sidebar/Sidebar'
import Widget from '../components/ChatRoom/Widget/Widget'
import Navbar from '../components/Navbar/Navbar'


function chatroom() {
  

  return (
    <div className='bg-white dark:bg-darkgray flex flex-col items-center mx-auto h-screen'>
      <Head>
        <title>Blockd</title>
      </Head>
      <Navbar />
      <div className='bg-white dark:bg-darkgray grid lg:max-w-7xl grid-cols-12 mx-auto overflow-hidden w-full'>
        <Sidebar />
        <Chatbar />
        <Chatbox />
        <Widget />
      </div>
    </div>
  )
}

export default chatroom