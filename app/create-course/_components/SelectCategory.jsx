import CategoryList from '@/app/_shared/CategoryList'
import React, { useContext } from 'react'
import Image from 'next/image'
import { UserInputContext } from '../../_context/UserInputContext'

function SelectCategory() {
  const {userCourseInput,setUserCourseInput}=useContext(UserInputContext);
  const handleCategoryChange=(category)=>{
    setUserCourseInput(prev=>({...prev,category:category}))
  }
  return (
    <div className='mt-10'>
        <h2 className='my-5'>Select the course category</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-5'>
          {CategoryList.map((item,index)=>(
              <div key={item.id || index} className={`flex flex-col p-5 border items-center rounded-xl hover:border-primary hover:bg-blue-50 cursor-pointer ${userCourseInput?.category==item.name&&'border-primary bg-blue-300'}`}
              onClick={()=>handleCategoryChange(item.name)}
              >
                  <Image src={item.icon} width={50} height={50} alt={item.name} />
                  <h2>{item.name}</h2>
              </div>
          ))}
      </div>
    </div>
  )
}

export default SelectCategory