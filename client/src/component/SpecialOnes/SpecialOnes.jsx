import React from 'react'
import { FoodCard } from '../../shared/FoodCard'
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import Spinner from '../Spinner';

const SpecialOnes = () => {
  const {data: specialOnes, loading, error} = useFetch(`${BASE_URL}/menus/search/getSpecialOnes`);
  
  return (<>
    {loading && <Spinner/>}
    {error && <span>{error}</span>}
    {!loading && !error &&
    specialOnes?.map(item=>(
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={item._id}>
            <FoodCard item={item}/>
        </div>
    ))
    }
    </>
  )
}

export default SpecialOnes