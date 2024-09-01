import React, { useState, useEffect, useRef } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const menuItems = [
  { id: 1, category: 'Pizzas' },
  { id: 2, category: 'Garlic Bread' },
  { id: 3, category: 'Burgers' },
  { id: 4, category: 'Wraps' },
  { id: 5, category: 'Pastas' },
  { id: 6, category: 'Chicken' },
  { id: 7, category: 'Seafood Dishes' },
  { id: 8, category: 'Extras' },
  { id: 9, category: 'Salads' },
  { id: 10, category: 'Desserts' },
  { id: 11, category: 'Drinks' },
  { id: 12, category: 'Meal Deals' }
];

const MenuItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const dropdownRef = useRef(null);

  const filteredMenuItems = menuItems.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = event => {
    setSearchTerm(event.target.value);
    setShowDropdown(true);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleItemClick = category => {
    setSelectedCategory(category);
    setSearchTerm(category);
    setShowDropdown(false);
  };

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="" style={{ position: 'relative' }} ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={() => setShowDropdown(true)}
        placeholder="Search categories..."
        style={{ padding: '10px 15px', borderRadius: '5px', width: '100%', zIndex: '1001px' }}
      />

      {showDropdown && (
        <div className="w-full mt-2 bg-white rounded-md shadow-lg z-index" style={{ position: 'absolute', zIndex: '2' }}>
          {filteredMenuItems.map(item => (
            <div
              key={item.id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleItemClick(item.category)}
            >
              {item.category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItems
