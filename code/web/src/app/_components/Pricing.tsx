"use client";

import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingTiers } from "~/data/pricing";



export const Pricing = () => {
  return <section className="w-3/4 mx-auto" id="price">
    <div className="container max-w-none">
      <div className=" text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 0.8, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-[50px] font-semibold">Escolha o plano ideal</motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 0.8, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-[25px]"
        >Gratuito para sempre. Faça o upgrade para obter features exclusivas e mais segurança!</motion.div>
      </div>
    </div>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, scale: { type: "keyframes", visualDuration: 1.5 } }}
      viewport={{ once: true }}
      className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
      {pricingTiers.map(({ title, monthlyPrice, buttonText, popular, inverse, features }, id) => (
        <div key={id} className={twMerge("card w-full  border p-5 rounded-xl border-secondary/20", inverse === true && "border-secondary  bg-secondary text-background/80")}>
          <div className="flex justify-between">
            <h3 className={twMerge("text-lg font-bold text-secondary/50", inverse === true && "text-background/50")}>{title}</h3>
            {popular && (
              <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-background/20">
                <motion.span
                  animate={{
                    backgroundPositionX: '-100%'
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: "loop",
                  }}
                  className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)]  [background-size:200%] text-transparent bg-clip-text font-medium">Popular</motion.span>
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-[30px]">
            <span className="text-4xl font-bold tracking-tighter leading-none">R$ {monthlyPrice}</span>
            <span className={twMerge("tracking-tight font-bold text-secondary/50", inverse === true && "tracking-tight font-bold text-background/50")}>/mês</span>
          </div>
          <button className={twMerge("btn btn-primary w-full mt-[30px] rounded-3xl py-3 px-8 bg-primary text-background", inverse === true && "bg-card text-secondary")}>{buttonText}</button>
          <ul className="flex flex-col space-y-5 mt-8">
            {features.map((feature, index) => (
              <li key={index} className="text-sm flex items-center gap-4">
                <Check className="h-6 w-6" />
                <span> {feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

    </motion.div>
  </section>
};