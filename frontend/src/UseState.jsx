import React from 'react'
import { useState } from 'react'


const initialcount=()=>{
    
    console.log("function is running")
    return 0
   }

const UseState = () => {
    const [count, setcount] = useState(initialcount())
   const[activebtn,setactivebtn]=useState("")

    const increase = () => {
        setcount(count + 1)
        setactivebtn("increase")
    }
    const reset = () => {
        setcount(0)
        setactivebtn("reset")
    }
    const decrease = () => {
        // if(count>0){
        //     setcount(count-1)
        // }
        setcount(prevCount => {if(prevCount>0){
            return prevCount-1
        }
        return prevCount
    
    })
        setactivebtn("decrease")
        // setcount(prevCount=>prevCount-1)
    }
    return (
        <div className='flex gap-10 justify-center items-center align-center mt-10'>
            <button className={`bg-gray-200 shadow-md px-3 font-bold text-[40px] py-1 cursor-pointer ${activebtn==="decrease"?"bg-red-300":"bg-gray-200"}`} onClick={decrease}>
                -
            </button>
            <span className='text-xl'>{count}</span>
            <button onClick={increase} className={`bg-gray-200 shadow-md px-3 font-bold text-[40px] py-1 cursor-pointer ${activebtn==="increase"?"bg-orange-300":"bg-gray-300"}`}>
                +
            </button>
            <button className={`bg-gray-200 shadow-md px-3 font-bold text-[40px] py-1 ${activebtn==="reset"?"bg-green-300":"bg-gray-200"}`} onClick={reset}>Reset</button>
        </div>
    )
}

export default UseState