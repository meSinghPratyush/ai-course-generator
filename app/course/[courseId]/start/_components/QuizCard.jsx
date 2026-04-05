import React from 'react'
import { Button } from '@/components/ui/button'
import { db } from '@/configs/db'
import { UserQuizResult } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'

function QuizCard({quiz, chapterIndex, courseId, userEmail, onQuizPass, onClose}) {

    const [selectedAnswers, setSelectedAnswers] = React.useState({});
    const [submitted, setSubmitted] = React.useState(false);
    const [score, setScore] = React.useState(0);

    const onSelectAnswer=(questionIndex, answer)=>{
        setSelectedAnswers(prev=>({...prev, [questionIndex]: answer}));
    }

    const onSubmit=async()=>{
        // calculate score
        let correct = 0;
        quiz.forEach((question, index)=>{
            if(selectedAnswers[index] === question.correctAnswer){
                correct++;
            }
        });
        const finalScore = Math.round((correct/quiz.length)*100);
        setScore(finalScore);
        setSubmitted(true);

        const passed = finalScore >= 80;

        // save to DB
        await db.insert(UserQuizResult).values({
            courseId: courseId,
            chapterIndex: chapterIndex,
            userEmail: userEmail,
            score: finalScore,
            passed: passed
        });

        if(passed){
            onQuizPass(chapterIndex);
        }
    }

    return (
        <div className='border rounded-xl p-6 mt-5'>
            <h2 className='font-bold text-xl mb-6'>Chapter Quiz</h2>

            {quiz?.map((question, index)=>(
                <div key={index} className='mb-6'>
                    <h3 className='font-medium text-lg mb-3'>{index+1}. {question.question}</h3>
                    <div className='grid grid-cols-1 gap-2'>
                        {question.options.map((option, optIndex)=>(
                            <div key={optIndex}
                                onClick={()=>!submitted && onSelectAnswer(index, option)}
                                className={`p-3 border rounded-lg cursor-pointer transition-all
                                ${selectedAnswers[index]===option && !submitted && 'bg-purple-100 border-primary'}
                                ${submitted && option===question.correctAnswer && 'bg-green-100 border-green-500'}
                                ${submitted && selectedAnswers[index]===option && option!==question.correctAnswer && 'bg-red-100 border-red-500'}
                                `}>
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {!submitted ?
                <Button 
                    onClick={onSubmit} 
                    disabled={Object.keys(selectedAnswers).length !== quiz?.length}
                    className='w-full mt-4'>
                    Submit Quiz
                </Button>
            :
                <div className={`text-center p-5 rounded-xl mt-4 ${score>=80 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h2 className='text-2xl font-bold'>{score}%</h2>
                    {score>=80 ?
                        <div>
                            <p className='text-green-600 font-medium mt-2'>🎉 Congratulations! You passed!</p>
                            <p className='text-sm text-gray-500 mt-1'>Next chapter is now unlocked.</p>
                        </div>
                    :
                        <div>
                            <p className='text-red-600 font-medium mt-2'>❌ You need 80% to pass.</p>
                            <Button onClick={()=>{setSubmitted(false); setSelectedAnswers({})}} className='mt-3'>
                                Retry Quiz
                            </Button>
                        </div>
                    }
                    <Button variant='outline' onClick={onClose} className='mt-3 w-full'>
                        Close Quiz
                    </Button>
                </div>
            }
        </div>
    )
}

export default QuizCard