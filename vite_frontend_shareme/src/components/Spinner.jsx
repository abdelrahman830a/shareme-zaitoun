import React from 'react'
import { FidgetSpinner } from 'react-loader-spinner'

function Spinner({ message }) {
    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <FidgetSpinner
                height="80"
                width="200"
                ballColors={['#00BFFF', '#00BFFF', '#00BFFF']}
                backgroundColor="#F4442E"
                className='m-5'
            />
            <p className='text-lg text-gray-600 text-center px-2'>{message}</p>
        </div>
    )
}

export default Spinner