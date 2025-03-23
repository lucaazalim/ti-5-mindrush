"use client";

import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingTiers } from "~/data/pricing";

export const Pricing = () => {
  return (
    <section className="mx-auto w-3/4" id="price">
      <div className="container max-w-none">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 0.8, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-[50px] font-semibold"
          >
            Escolha o plano ideal
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 0.8, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-[25px]"
          >
            Gratuito para sempre. Faça o upgrade para obter recursos exclusivos!
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          scale: { type: "keyframes", visualDuration: 1.5 },
        }}
        viewport={{ once: true }}
        className="mt-10 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-center"
      >
        {pricingTiers.map(
          (
            { title, monthlyPrice, buttonText, popular, inverse, features },
            id,
          ) => (
            <div
              key={id}
              className={twMerge(
                "card w-full rounded-xl border border-secondary/20 p-5",
                inverse === true &&
                  "border-secondary bg-secondary text-background/80",
              )}
            >
              <div className="flex justify-between">
                <h3
                  className={twMerge(
                    "text-lg font-bold text-secondary/50",
                    inverse === true && "text-background/50",
                  )}
                >
                  {title}
                </h3>
                {popular && (
                  <div className="inline-flex rounded-xl border border-background/20 px-4 py-1.5 text-sm">
                    <motion.span
                      animate={{
                        backgroundPositionX: "-100%",
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      }}
                      className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] bg-clip-text font-medium text-transparent [background-size:200%]"
                    >
                      Popular
                    </motion.span>
                  </div>
                )}
              </div>
              <div className="mt-[30px] flex items-baseline gap-1">
                <span className="text-4xl font-bold leading-none tracking-tighter">
                  R$ {monthlyPrice}
                </span>
                <span
                  className={twMerge(
                    "font-bold tracking-tight text-secondary/50",
                    inverse === true &&
                      "font-bold tracking-tight text-background/50",
                  )}
                >
                  /mês
                </span>
              </div>
              <button
                className={twMerge(
                  "btn btn-primary mt-[30px] w-full rounded-3xl bg-primary px-8 py-3 text-background",
                  inverse === true && "bg-card text-secondary",
                )}
              >
                {buttonText}
              </button>
              <ul className="mt-8 flex flex-col space-y-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-4 text-sm">
                    <Check className="h-6 w-6" />
                    <span> {feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </motion.div>
    </section>
  );
};
