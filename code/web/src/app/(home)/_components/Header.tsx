import * as motion from "motion/react-client";
import Link from "next/link";
import SignInButton from "./SignInButton";

const Header = () => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="fixed left-0 z-50 w-full py-4 backdrop-blur-md"
    >
      <div className="mx-auto flex w-3/4 items-center justify-between text-secondary">
        <Link href="#home">
          <h1 className="select-none text-[25px] font-semibold">
            Mind<span className="italic">Rush</span>
          </h1>
        </Link>

        <div className="flex items-center gap-10">
          <Link
            href="#benefits"
            className="relative block w-fit text-lg after:absolute after:block after:h-[4px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition after:duration-300 after:content-[''] after:hover:scale-x-100"
          >
            Benefits
          </Link>
          <Link
            href="#testimonials"
            className="relative block w-fit text-lg after:absolute after:block after:h-[4px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition after:duration-300 after:content-[''] after:hover:scale-x-100"
          >
            Testimonials
          </Link>
          <Link
            href="#price"
            className="relative block w-fit text-lg after:absolute after:block after:h-[4px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition after:duration-300 after:content-[''] after:hover:scale-x-100"
          >
            Pricing
          </Link>
          <Link
            href="#customers"
            className="relative block w-fit text-lg after:absolute after:block after:h-[4px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition after:duration-300 after:content-[''] after:hover:scale-x-100"
          >
            Customers
          </Link>
        </div>

        <SignInButton />
      </div>
    </motion.div>
  );
};

export default Header;
