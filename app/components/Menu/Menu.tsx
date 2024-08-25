// components/Menu.tsx
import { IoCart } from "react-icons/io5";
import { motion } from "framer-motion";

interface MenuProps {
  calcularTotalItensCarrinho: () => number;
  MenuA: () => void;
}

const Menu = ({ calcularTotalItensCarrinho, MenuA }: MenuProps) => {
  return (
    <main className="w-[100%] h-[101px] bg-[#0F52BA] flex justify-between items-center relative">
      <div className="ml-[5%]">
        <div className="text-4xl text-white font-bold cursor-pointer">E-commerce</div>
      </div>

      <div className="mr-[5%]">
        <motion.button
          type="button"
          onClick={MenuA}
          className="bg-white p-2 rounded-lg cursor-pointer hover:bg-slate-500 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoCart size={40} className="mr-2" />
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 32 }}>
            {calcularTotalItensCarrinho()}
          </p>
        </motion.button>
      </div>
    </main>
  );
};

export default Menu;
