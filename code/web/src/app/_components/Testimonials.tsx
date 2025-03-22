"use client";

import { testimonials } from "~/data/testimonials";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

  

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;

}) => (
  <div className={props.className}>
    <motion.div
      whileInView={{ translateY: '-50%' }}
      viewport={{ once: true }}
      transition={{
        duration: props.duration || 10,
        repeat: Infinity,
        ease: 'linear',
        repeatType: "loop"
      }}
      className="flex flex-col gap-6 pb-6">
      {[...new Array(2).fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {props.testimonials.map(({ text, imageSrc, name, username }, id) => (
            <div className="p-10 border rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full" key={id}>
              <div>
                {text}
              </div>
              <div className="flex items-center gap-2 mt-5">
                <Image src={imageSrc} alt={name} className=" rounded-full" width={40} height={40} />
              </div>
              <div className="flex flex-col">
                <div className="font-medium tracking-tight leading-5">{name}</div>
                <div className="leading-5 tracking-tight">{username}</div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))]}
    </motion.div>
  </div>
)

export const Testimonials = () => {
  return <section className="bg-background p-10 mb-10" id="testimonials">
    <div className="container space-y-5 text-center">
      <div className="flex flex-col justify-center">
        <motion.div 
        initial={{scale:0, opacity:0}}
        whileInView={{scale:0.8, opacity:1}}
        viewport={{ once: true }}
        transition={{duration:1,  delay:0.6}}
        className="text-[50px] font-semibold mt-5">Feedback dos usuários</motion.div>
        <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 0.8, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="text-[25px]"
                        >Veja como educadores e alunos estão aproveitando a Mind<span className="italic">Rush</span>!</motion.div>
      </div>
    </div>
    <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
      <TestimonialsColumn testimonials={firstColumn} duration={15} />
      <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19}/>
      <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17}/>
    </div>
  </section>
};