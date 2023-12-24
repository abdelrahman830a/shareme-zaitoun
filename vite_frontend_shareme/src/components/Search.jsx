import React, {useState, useEffect} from 'react'
import MasonaryLayout from './MasonaryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'
import {useNavigate} from 'react-router-dom'

function Search({searchTerm}) {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  
  
  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  
  useEffect(() => {
    if(searchTerm){
      setLoading(true)

      const query = searchQuery(searchTerm.toLowerCase())
      
      client.fetch(query).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }else {
      client.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [searchTerm])
  
  // if (!user) {
  //   navigate("/login");
  // }
  return (
    <div>
      {loading && <Spinner message={`We are finding ${searchTerm} ideas to your feed!`} />}
      {pins?.length !== 0 && <MasonaryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>
          <h2>No pins found for {searchTerm} category</h2>
        </div>
      )}
      </div>
  )
}

export default Search