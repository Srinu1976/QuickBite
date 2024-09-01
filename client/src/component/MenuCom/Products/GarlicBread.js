import React from 'react';
import PizzaImage from '../../../assets/pizza.jpg';
import { CiCirclePlus } from "react-icons/ci";

const GarlicBread = () => {
    const garlicbread = [
        {
            id: '1',
            img: PizzaImage,
            title: 'Margherita',
            desc: 'Mozzarella cheese and our pizza sauce',
            price: '£4.20'
        },
        {
            id: '2',
            img: PizzaImage,
            title: 'Pepperoni',
            desc: 'Pepperoni slices and mozzarella cheese',
            price: '£5.00'
        },
        {
            id: '3',
            img: PizzaImage,
            title: 'Vegetarian',
            desc: 'Assorted vegetables and mozzarella cheese',
            price: '£4.50'
        },
    ];

    return (
        <div className=''>
            <h3 className='text-2xl font-bold mb-4 text-[#c0022a]'>Garlic Bread</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {garlicbread.map(garlicbread => (
                    <div key={garlicbread.id} className='bg-white rounded-lg shadow-md py-4 px-3'>
                        <img src={garlicbread.img} alt={garlicbread.title} className='w-full rounded-md mb-4' />
                        <h4 className='text-lg font-semibold mb-2'>{garlicbread.title}</h4>
                        <p className='text-gray-600 mb-2'>{garlicbread.desc}</p>
                        <div className='flex justify-between items-center'>
                            <p className='text-gray-800 font-bold'>{garlicbread.price}</p>
                            <button className='bg-[#18a442] w-[28px] h-[28px] rounded-full'><CiCirclePlus className=' text-white flex justify-center items-center w-full h-full'/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GarlicBread;
