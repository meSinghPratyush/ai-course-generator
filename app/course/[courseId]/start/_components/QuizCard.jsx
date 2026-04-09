import React from 'react'
import { Button } from '@/components/ui/button'
import { db } from '@/configs/db'
import { UserQuizResult } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'

function QuizCard({quiz, chapterIndex, courseId, userEmail, onQuizPass, onClose, onNextChapter, hasNextChapter}) {

    const [selectedAnswers, setSelectedAnswers] = React.useState({});
    const [submitted, setSubmitted] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [showResult, setShowResult] = React.useState(false);

    const onSelectAnswer=(questionIndex, answer)=>{
        setSelectedAnswers(prev=>({...prev, [questionIndex]: answer}));
    }

const onSubmit = async () => {
  // Calculate score
  let correct = 0;
  quiz.forEach((question, index) => {
    if (selectedAnswers[index] === question.correctAnswer) {
      correct++;
    }
  });
  const finalScore = Math.round((correct / quiz.length) * 100);
  const passed = finalScore >= 80;

  // Wait for DB write to complete BEFORE doing anything else
  await db.insert(UserQuizResult).values({
    courseId: courseId,
    chapterIndex: chapterIndex,
    userEmail: userEmail,
    score: finalScore,
    passed: passed
  });

  setScore(finalScore);
  setSubmitted(true);
  setShowResult(true);

  // Call onQuizPass AFTER DB write so unlockedChapters updates correctly
  if (passed) {
    onQuizPass(chapterIndex);
  }

  
};

    // Show result card after submission (outside the quiz)
    if(showResult) {
        return (
            <div className={`border rounded-xl p-6 mt-5 text-center ${score>=80 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h2 className='text-4xl font-bold mb-2'>{score}%</h2>
                {score>=80 ?
                    <div>
                        <p className='text-green-600 font-semibold text-lg mt-2'>Congratulations! You passed!</p>
                        <p className='text-sm text-gray-500 mt-1'>Next chapter is now unlocked.</p>
                        {hasNextChapter &&
                            <Button className='mt-4 w-full' onClick={() => { onClose(); onNextChapter(); }}>
                                Go to Next Chapter →
                            </Button>
                        }
                    </div>
                :
                    <div>
                        <p className='text-red-600 font-semibold text-lg mt-2'>You need 80% to pass.</p>
                        <p className='text-sm text-gray-500 mt-1'>Review the chapter and try again.</p>
                        <Button onClick={() => { setSubmitted(false); setSelectedAnswers({}); setShowResult(false); onClose(); }} className='mt-4 w-full'>
                            Retry Quiz
                        </Button>
                    </div>
                }
            </div>
        )
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

            {!submitted &&
                <Button 
                    onClick={onSubmit} 
                    disabled={Object.keys(selectedAnswers).length !== quiz?.length}
                    className='w-full mt-4'>
                    Submit Quiz
                </Button>
            }
        </div>
    )
}

export default QuizCard