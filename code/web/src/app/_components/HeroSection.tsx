"use client";
import { Button } from "~/components/ui/button";
import { ReactTyped } from "react-typed";
import Image from "next/image";
import mobile from "public/mobile.png";
import * as motion from "motion/react-client";
export const HeroSection = () => {
  return (
    <div className="m-auto py-40 text-center text-secondary" id="home">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="text-[60px] font-semibold leading-relaxed">
          Transforme suas aulas <br></br>
          <ReactTyped
            strings={[
              "engajando seus alunos!",
              "em sessões interativas!",
              "sem esforço!",
              "com quizzes dinâmicos!",
            ]}
            typeSpeed={40}
            backSpeed={50}
            loop
          />
        </div>

        <Button variant="default" size="default" className="mb-28 mt-10">
          Acessar grátis
        </Button>
      </motion.div>

      <div className="relative mx-auto h-[400px] w-[600px]">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="-rotate-15 absolute left-0 z-10 transform"
        >
          <Image
            src={mobile}
            alt="Phone Left"
            width={250}
            height={250}
            className="rounded-lg"
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <Image
            src={mobile}
            alt="Phone Center"
            width={250}
            height={250}
            className="rounded-lg"
          />
        </motion.div>

        <motion.div
          initial={{ x: +100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="rotate-15 absolute right-0 z-10 transform"
        >
          <Image
            src={mobile}
            alt="Phone Right"
            width={250}
            height={250}
            className="rounded-lg"
          />
        </motion.div>
      </div>
    </div>
  );
};
