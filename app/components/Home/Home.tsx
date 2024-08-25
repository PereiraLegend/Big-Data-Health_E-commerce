import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Products from "../../services/apiProducts";
import { IoCart } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import AnimatedButton from '../AnimatedButtom/animatedbuttom';
import Menu from '../Menu/Menu';
import { Product } from "../../services/apiProducts";

export default function Home() {
    const [Abrir, setAbrir] = useState(false);
    const [carrinho, setCarrinho] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [Resolucao, setResolucao] = useState(false);
    const [Pesquisaprod, setPesquisaprod] = useState("");
    const [filtroPreco, setFiltroPreco] = useState<"menor" | "maior" | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

    const MenuA = () => {
        setAbrir(!Abrir);
    };

    const MenuF = () => {
        setAbrir(false);
    };

    const { isLoading, isError, data } = Products();

    const adicionarAoCarrinho = (item: Product) => {
        const existente = carrinho.find((produto) => produto.id === item.id);
        if (existente) {
            const novoCarrinho = carrinho.map((produto) =>
                produto.id === item.id ? { ...produto, quantidade: (produto.quantidade || 0) + 1 } : produto
            );
            setCarrinho(novoCarrinho);
            localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
        } else {
            const novoCarrinho = [...carrinho, { ...item, quantidade: 1 }];
            setCarrinho(novoCarrinho);
            localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
        }
    };

    const aumentarQuantidade = (index: number) => {
        const novoCarrinho = [...carrinho];
        novoCarrinho[index].quantidade = (novoCarrinho[index].quantidade || 0) + 1;
        setCarrinho(novoCarrinho);
        localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    };

    const diminuirQuantidade = (index: number) => {
        const novoCarrinho = [...carrinho];
        const item = novoCarrinho[index];
        if (item && typeof item.quantidade === 'number' && item.quantidade > 1) {
            item.quantidade--;
            setCarrinho(novoCarrinho);
            localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
        }
    };

    const formatarTitulo = (text: string, max: number): string => {
        if (text.length > max) {
            return text.substring(0, max) + '...';
        } else {
            return text;
        }
    };

    const removerCardCarrinho = (index: number) => {
        const novoCarrinho = [...carrinho];
        novoCarrinho.splice(index, 1);
        setCarrinho(novoCarrinho);
        localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    };

    const calcularTotalItem = (item: Product) => {
        return (item.price || 0) * (item.quantidade || 0);
    };

    const calcularTotal = () => {
        const TotalCalculado =  carrinho.reduce((total, item) => total + calcularTotalItem(item), 0);
        return TotalCalculado.toFixed(2)
    };

    const calcularTotalItensCarrinho = () => {
        return carrinho.reduce((total, item) => total + (item.quantidade || 0), 0);
    };

    const finalizarCompra = () => {
        alert("Compra finalizada");
        window.location.reload();
    };

    const filtroProdutos = data ? data.filter((item: Product) => {
        return (
            item.title.toLowerCase().includes(Pesquisaprod.toLowerCase()) &&
            (!categoriaSelecionada || item.category === categoriaSelecionada)
        );
    }) : [];

    const produtosOrdenados = filtroPreco
        ? [...filtroProdutos].sort((a, b) =>
            filtroPreco === "menor" ? a.price - b.price : b.price - a.price
        )
        : filtroProdutos;

    const limparFiltros = () => {
        setFiltroPreco(null);
        setCategoriaSelecionada(null);
        setPesquisaprod("");
    };

    useEffect(() => {
        const carrinhoLocalStorage = localStorage.getItem('carrinho');
        if (carrinhoLocalStorage) {
            setCarrinho(JSON.parse(carrinhoLocalStorage));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        localStorage.setItem('total', JSON.stringify(calcularTotal()));
    }, [carrinho, calcularTotal]);

    useEffect(() => {
        const carrinhoLocalStorage = localStorage.getItem('carrinho');
        const totalLocalStorage = localStorage.getItem('total');
        if (carrinhoLocalStorage) {
            setCarrinho(JSON.parse(carrinhoLocalStorage));
        }
        if (totalLocalStorage) {
            setTotal(JSON.parse(totalLocalStorage));
        }
    }, []);

    useEffect(() => {
        const funcaoResolucao = () => {
            setResolucao(window.innerWidth > 1366);
        };

        funcaoResolucao();
        window.addEventListener("resize", funcaoResolucao);

        return () => {
            window.removeEventListener("resize", funcaoResolucao);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400, lineHeight: '19px' }}>
             <Menu calcularTotalItensCarrinho={calcularTotalItensCarrinho} MenuA={MenuA} />

            <div className="flex justify-center mt-12 mb-[-12]">
                <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
                    value={Pesquisaprod}
                    onChange={(e) => setPesquisaprod(e.target.value)}
                />
            </div>

            <div className="flex justify-center mt-4 mb-6 space-x-4">
                <button
                    className={`p-2 rounded-lg ${!filtroPreco ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    onClick={() => limparFiltros()}
                >
                    Limpar Filtros
                </button>
                <button
                    className={`p-2 rounded-lg ${filtroPreco === "menor" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    onClick={() => setFiltroPreco("menor")}
                >
                    Menor Preço
                </button>
                <button
                    className={`p-2 rounded-lg ${filtroPreco === "maior" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    onClick={() => setFiltroPreco("maior")}
                >
                    Maior Preço
                </button>
                <select
                    className="p-2 rounded-lg bg-gray-300"
                    value={categoriaSelecionada || ""}
                    onChange={(e) => setCategoriaSelecionada(e.target.value || null)}
                >
                    <option value="">Categorias</option>
                    <option value="men's clothing">Roupas Masculinas</option>
                    <option value="women's clothing">Roupas Femininas</option>
                    <option value="jewelery">Joias</option>
                    <option value="electronics">Electronicos</option>
                </select>
            </div>

            <div className="flex justify-center items-center mt-[3%] mb-[5%] relative">
                {isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 justify-center items-center px-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-white border rounded-xl shadow-md w-[218px] h-[285px] relative overflow-hidden">
                            <div className="animate-pulse">
                                <div className="bg-gray-200 h-[150px] w-[218px] rounded-t-xl"></div>
                                <div className="p-2">
                                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                                    <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
                                        <div className="bg-gray-200 h-6 w-1/4 rounded"></div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-2">
                                    <div className="bg-gray-200 h-8 w-full rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                ) : isError ? (
                    <p className="font-bold text-red-500 flex items-center justify-center">Ocorreu um erro ao carregar os produtos.</p>
                ) : filtroProdutos.length > 0 ?  (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 justify-center items-center">
                        {produtosOrdenados.map((item: Product, index: number) => (
                        <motion.div key={index} className="bg-white border rounded-xl shadow-md w-[218px] h-[285px] relative" whileHover={{ scale: 1.05, opacity: 1 }} style={{
                            transition: 'box-shadow 0.3s ease-in-out, height 0.3s ease-in-out',
                        }}>
                            <div>
                                <div className="flex justify-center items-center">
                                <img src={item.image} alt={item.title} className="w-[150px] h-[150px]" />
                                </div>
                                <div className="flex justify-between p-2">
                                <h3 className="text-[16px] font-semibold text-[#2C2C2C]">{formatarTitulo(item.title, 60)}</h3>
                                <div>
                                    <div className="flex-col">
                                        <p className="text-white bg-[#373737] p-1 rounded-lg text-[15px] font-bold">R${Math.trunc(item.price)}</p>
                                        <p className="text-yellow-500 p-1 rounded-lg text-[15px] font-bold flex">{item.rating.rate}<FaStar /></p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            {/* <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, lineHeight: '12px' }} className="text-[#2C2C2C] text-[10px] leading-3 ml-3 mr-3">{item.description}</p> */}
                            <AnimatedButton onClick={() => adicionarAoCarrinho(item)}>COMPRAR</AnimatedButton>
                        </motion.div>
                        ))}

                    </div>
                ) : (
                    <p>Nenhum produto encontrado</p>
                )}
            </div>

            {/** Barra lateral */}
            <div className={`fixed top-0 right-0 h-full bg-[#0F52BA] shadow-lg transition-transform duration-300 ease-in-out transform ${Abrir ? 'translate-x-0' : 'translate-x-full'} w-96`}>
                <div className="">
                    <div className="flex justify-between p-4">
                        <div>
                            <p className="text-white font-bold text-[27px] pb-3 mt-7" style={{ lineHeight: '19px' }}>Carrinho </p>
                            <p className="text-white font-bold text-[27px]" style={{ lineHeight: '19px' }}>de compras</p>
                        </div>
                        <div>
                            <motion.button onClick={MenuF} className="text-white hover:text-gray-800 hover:bg-white focus:outline-none font-bold bg-black p-1 rounded-[100%]" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><IoClose className="text-2xl" /></motion.button>
                        </div>
                    </div>

                    <div className="p-4" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                        {/**Card compra */}
                        {carrinho.map((item, index) => (
                            <div key={index} className="bg-white h-[95px] flex felx-row justify-between items-center rounded-lg mb-[10px] mr-2 ml-2 pr-2 pl-2 relative">
                                <button onClick={() => removerCardCarrinho(index)} className="absolute top-[-5px] right-[-5px]  bg-black text-white p-1 rounded-full"><IoClose className="text-sm" /></button>
                                <div><img src={item.image} alt="" className="w-[50px] h-[50px] " /></div>
                                <div className="w-[113px]">{formatarTitulo(item.title, 20)}</div>
                                <div>
                                    <p className="text-[5px] mb-[-1px]">Qtd:</p>
                                    <div className="flex items-center border p-1 rounded-lg">
                                        <button onClick={() => diminuirQuantidade(index)} className="pl-1 pr-1 border-r">-</button>
                                        <span className="pl-1 pr-1">{item.quantidade}</span>
                                        <button onClick={() => aumentarQuantidade(index)} className="pl-1 pr-1 border-l">+</button>
                                    </div>
                                </div>
                                <div>R$ {calcularTotalItem(item).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    {/**Valor final */}
                    <div className="absolute bottom-0 z-20 w-[100%]">
                        <div className="flex items-center justify-between p-4  ">
                            <div className="text-white font-bold text-[27px]">Total</div>
                            <div className="text-white font-bold font text-[27px]">R$ {calcularTotal()}</div>
                        </div>
                        <motion.input type="button" value="Finalizar Compra" className="w-[100%] h-[97px] bg-[#000000] text-white text-[28px] cursor-pointer " onClick={finalizarCompra} />
                    </div>
                </div>
            </div>

            <footer className={`w-[100%] h-[34px] bg-[#EEEEEE] flex justify-center items-center ${Resolucao ? "" : ""}`}>
                <div>E-commerce © Todos os direitos reservados</div>
            </footer>
        </div>
    );
}
