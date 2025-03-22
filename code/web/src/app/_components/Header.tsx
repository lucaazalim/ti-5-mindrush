import SignInButton from './SignInButton'
import * as motion from "motion/react-client"
import Link from 'next/link'

const Header = () => {

    return (
        <motion.div
            initial={{ y:-100, opacity: 0 }}
            animate={{ y:0,  opacity: 1 }}
            transition={{ duration: 1, delay:0.3}}
            className="fixed left-0 w-full py-4 backdrop-blur-md z-50">
            <div className="flex justify-between items-center w-3/4 mx-auto text-secondary" >
               <Link href="#home">
               <h1 className="font-semibold text-[25px]">Mind<span className="italic">Rush</span></h1>
               </Link>

                <div className="flex items-center gap-10">
                    <Link href="#benefits" className="relative text-lg w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Benefícios</Link>
                    <Link href="#testimonials" className="relative text-lg w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Depoimentos</Link>
                    <Link href="#price" className="relative text-lg w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Preço</Link>
                    <Link href="#costumers" className="relative text-lg w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Clientes</Link>
                </div>

                <SignInButton />

            </div>
        </motion.div>
    )
}

export default Header