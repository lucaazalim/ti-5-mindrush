import * as motion from "motion/react-client";
import Image from "next/image";
import React from "react";
import apexLogo from "public/logo-apex.png";
import celestialLogo from "public/logo-celestial.png";
import pulseLogo from "public/logo-pulse.png";
import quantumLogo from "public/logo-quantum.png";

const Costumers = () => {
  return (
    <div className="mx-auto w-3/4 pt-24 text-center" id="costumers">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 0.8, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-[50px] font-semibold"
      >
        Quem usa a plataforma?
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 0.8, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="pb-5 text-[25px]"
      >
        Escolas de todo o Brasil já estão utilizando nossa plataforma!
      </motion.div>
      <motion.div
        initial={{ x: +100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="py-8 md:py-12"
      >
        <div className="container">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <motion.div
              animate={{ translateX: "-40%" }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              className="flex flex-none gap-14"
            >
              <Image src={apexLogo} alt="Apex logo" />
              <Image src={celestialLogo} alt="Celestial logo" />
              <Image src={quantumLogo} alt="Quantum logo" />
              <Image src={pulseLogo} alt="Pulse logo" />
              <Image src={apexLogo} alt="Apex logo" />
              <Image src={celestialLogo} alt="Celestial logo" />
              <Image src={quantumLogo} alt="Quantum logo" />
              <Image src={pulseLogo} alt="Pulse logo" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Costumers;
