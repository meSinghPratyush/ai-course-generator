import React from 'react'
import Image from 'next/image'
import { HiOutlineHome,HiCubeTransparent,HiCloudArrowUp,HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
function SideBar() {
  const Menu=[
    {
      id:1,
      name:'Explore',
      icon:<HiCubeTransparent />,
      path:'/dashboard'
    },
    {
      id:2,
      name:'Upgrade',
      icon:<HiCloudArrowUp />,
      path:'/dashboard'
    },
    {
      id:3,
      name:'Logout',
      icon:<HiMiniArrowLeftEndOnRectangle />,
      path:'/dashboard'
    }
  ]
  return (
    <div className='fixed h-full md:w-64 p-5 shadow-md'>
        <Image src={'/logo.svg'} alt='Logo' width={160} height={100} />
        <hr className='my-5'/>

        <ul>
          {Menu.map((item,index)=>(
            <div key={item.id}>
              <div>{item.icon}</div>
            </div>
          ))}
        </ul>
    </div>
  )
}

export default SideBar