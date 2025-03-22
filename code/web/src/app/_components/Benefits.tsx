import React from 'react'
import { Button } from '~/components/ui/button'
import Image from 'next/image'
import mobile from "public/mobile.png"
import * as motion from "motion/react-client"

const Benefits = () => {
    return (
        <div>
            <div className="w-3/4 mx-auto text-center" id="benefits">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 0.8, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-[50px] font-semibold pt-28">
                    <p>Principais benefícios</p>
                </ motion.div>

                <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 0.8, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-[25px] pb-28"
                >Veja como a Mind<span className="italic">Rush</span> pode revolucionar a forma de ensinar e aprender.</motion.div>

                <div className="flex gap-10">

                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="relative w-[600px] h-[450px] mx-auto bg-secondary rounded-3xl">


                        <div className="absolute inset-0 flex justify-center items-center z-20">
                            <Image
                                src={mobile}
                                alt="Phone Center"
                                width={250}
                                height={250}
                                className="rounded-lg"
                            />
                        </div>


                    </motion.div>



                    <div className="flex-1 p-5">
                        <div className="flex flex-col justify-between">
                            <motion.div
                                initial={{ x: +100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="flex gap-5 items-center mb-8">
                                <p className="rounded-full h-10 w-10 p-2 bg-primary text-background font-bold">
                                    1
                                </p>
                                <p className="font-semibold text-lg">
                                    Crie quizzes em menos de 3 minutos
                                </p>
                            </motion.div>


                            <motion.div
                                initial={{ x: +100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="flex gap-5 items-center mb-8">
                                <p className="rounded-full h-10 w-10 p-2 bg-primary text-background font-bold">
                                    2
                                </p>
                                <p className="font-semibold text-lg">
                                    Acompanhamento em tempo real

                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ x: +100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.7 }}
                                viewport={{ once: true }}
                                className="flex gap-5 items-center mb-8">
                                <p className="rounded-full h-10 w-10 p-2 bg-primary text-background font-bold">
                                    3
                                </p>
                                <p className="font-semibold text-lg">
                                    + Engajamento e interatividade
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ x: +100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.9 }}
                                viewport={{ once: true }}
                                className="flex gap-5 items-center mb-24">
                                <p className="rounded-full h-10 w-10 p-2 bg-primary text-background font-bold">
                                    4
                                </p>
                                <p className="font-semibold text-lg">
                                    Economia de tempo para você!
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ x: +100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 1.1 }}
                                viewport={{ once: true }}
                                className="flex">
                                <Button variant="secondary">Começar agora</Button>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>



            <div className="py-20 mt-[200px] bg-secondary text-center text-background">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 0.8, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <p className="text-[40px]">A solução das aulas chatas e entediantes!</p >
                </motion.div>
            </div>
        </div>
    )
}

export default Benefits