import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';

const AnimatedButton = ({ onClick, children }) => {
  return (
    <motion.button
      onClick={onClick}
      className="text-white bg-[#0F52BA] w-[100%] h-[32px] flex justify-center items-center absolute bottom-0 cursor-pointer text-[14px] rounded-b-xl"
      whileHover={{ backgroundColor: '#0056a1' }}
      whileTap={{ backgroundColor: '#003f7k' }}
      transition={{ duration: 0.5 }}
    >
      <FiShoppingBag className="mr-2" />
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
