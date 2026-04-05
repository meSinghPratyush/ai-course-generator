import React from 'react'
import YouTube from 'react-youtube'
import ReactMarkdown from 'react-markdown'

 const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 0,
      },
    };

function ChapterContent({chapter,content}) {

    
  return (
    <div className='p-10 overflow-hidden'>
        <h2 className='font-medium text-2xl'>
            {chapter?.chapter_name}
        </h2>
        <p className='text-gray-500'>{chapter?.about}</p>
        {/** Video.... */}
        <div className='flex justify-center my-6'>
            <YouTube
                videoId={content?.videoId}
                opts={opts}
            />
        </div>
        {/** Content.... */}

        <div>
            <h2 className='text-xl font-medium mt-5'>{content?.content?.title}</h2>
            <div className='prose max-w-none mt-3'>
                <ReactMarkdown>{content?.content?.description}</ReactMarkdown>
            </div>
            {content?.content?.codeExample && 
                <div className='bg-gray-900 text-white p-5 rounded-lg mt-5 overflow-x-auto'>
                    <h2 className='text-lg font-medium mb-3'>Code Examples and Syntax for Refrence</h2>
                    <div className='whitespace-pre-wrap break-words' dangerouslySetInnerHTML={{__html: content?.content?.codeExample}} />
                </div>
            }
        </div>
    </div>
  )
}

export default ChapterContent