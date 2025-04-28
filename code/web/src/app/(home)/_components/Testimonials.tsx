"use client";

import { testimonials } from "~/app/(home)/_data/testimonials";
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
      whileInView={{ translateY: "-50%" }}
      viewport={{ once: true }}
      transition={{
        duration: props.duration ?? 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[
        ...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, imageSrc, name, username }, id) => (
              <div
                className="w-full max-w-xs rounded-3xl border p-10 shadow-[0_7px_14px_#EAEAEA]"
                key={id}
              >
                <div>{text}</div>
                <div className="mt-5 flex items-center gap-2">
                  <Image
                    src={imageSrc}
                    alt={name}
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="font-medium leading-5 tracking-tight">{name}</div>
                  <div className="leading-5 tracking-tight">{username}</div>
                </div>
              </div>
            ))}
          </React.Fragment>
        )),
      ]}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  return (
    <section className="mb-10 bg-background p-10" id="testimonials">
      <div className="container mx-auto space-y-5 text-center">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 0.8, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-5 text-[50px] font-semibold"
          >
            Feedback dos usuários
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 0.8, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-[25px]"
          >
            Veja como educadores e estudantes estão aproveitando a Mind
            <span className="italic">Rush</span>!
          </motion.div>
        </div>
      </div>
      <div className="mt-10 flex max-h-[738px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <TestimonialsColumn testimonials={firstColumn} duration={15} />
        <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
        <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
      </div>
    </section>
  );
};
