import React from 'react'
import YouTube from 'react-youtube'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import QuizCard from './QuizCard'
import { db } from '@/configs/db'
import { UserQuizResult } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'

function ChapterContent({chapter, content, onQuizPass, userEmail, courseId}) {

    const [showQuiz, setShowQuiz] = React.useState(false);
    const [lastResult, setLastResult] = React.useState(null);

    React.useEffect(()=>{
        if(content?.chapterIndex !== undefined && userEmail && courseId){
            GetLastResult();
        }
    },[content?.chapterIndex, userEmail, courseId])

    const GetLastResult=async()=>{
        const result=await db.select().from(UserQuizResult)
            .where(and(
                eq(UserQuizResult.courseId, courseId),
                eq(UserQuizResult.chapterIndex, content?.chapterIndex),
                eq(UserQuizResult.userEmail, userEmail)
            ));
        if(result?.length > 0){
            setLastResult(result[0]);
        } else {
            setLastResult(null);
        }
    }

  return (
    <div className='p-5 md:p-10 overflow-hidden'>
        <h2 className='font-medium text-xl md:text-2xl'>
            {chapter?.chapter_name}
        </h2>
        <p className='text-gray-500'>{chapter?.about}</p>

        {/** Video.... */}
        <div className='my-6 rounded-xl overflow-hidden w-full max-w-2xl mx-auto aspect-video'>
            <YouTube
                videoId={content?.videoId}
                opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: { autoplay: 0 },
                }}
                className='w-full h-full rounded-xl'
                iframeClassName='w-full h-full rounded-xl'
            />
        </div>

        {/** Content.... */}
        <div>
            <h2 className='text-xl font-medium mt-5'>{content?.content?.title}</h2>

            {/* Sections — concept + explanation + code per section */}
            {content?.content?.sections?.map((section, index) => (
                <div key={index} className='mt-8'>
                    <h3 className='text-lg font-semibold text-primary'>{section?.concept}</h3>
                    <div className='prose max-w-none mt-2'>
                        <ReactMarkdown>{section?.explanation}</ReactMarkdown>
                    </div>
                    {section?.code &&
                        <div className='bg-gray-900 text-white p-5 rounded-lg mt-3 overflow-x-auto'>
                            <h2 className='text-lg font-medium mb-3'>Code Example</h2>
                            <div className='whitespace-pre-wrap break-words'
                                dangerouslySetInnerHTML={{__html: section?.code}} />
                        </div>
                    }
                </div>
            ))}
        </div>

        {/** Quiz Button */}
        {content?.content?.quiz &&
            <div className='mt-10'>
                {/* Show last result if exists */}
                {lastResult && !showQuiz &&
                    <div className={`p-4 rounded-xl mb-4 text-center ${lastResult?.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                        <h2 className='font-medium'>Last Quiz Result: <span className='font-bold'>{lastResult?.score}%</span></h2>
                        <p className={`text-sm mt-1 ${lastResult?.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {lastResult?.passed ? '✅ Passed' : '❌ Not Passed'}
                        </p>
                    </div>
                }
                {!showQuiz ?
                    <Button onClick={()=>setShowQuiz(true)} className='w-full'>
                        {lastResult ? 'Retake Quiz' : 'Take Chapter Quiz'}
                    </Button>
                :
                    <QuizCard
                        quiz={content?.content?.quiz}
                        chapterIndex={content?.chapterIndex}
                        courseId={courseId}
                        userEmail={userEmail}
                        onQuizPass={onQuizPass}
                        onClose={()=>{setShowQuiz(false); GetLastResult();}}
                    />
                }
            </div>
        }
    </div>
  )
}

export default ChapterContent