import * as motion from "motion/react-client";
import Image from "next/image";
import mobile from "public/home/mobile.png";
import { Button } from "~/components/ui/button";

const Benefits = () => {
  return (
    <div>
      <div className="mx-auto w-3/4 text-center" id="benefits">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 0.8, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="pt-28 text-[50px] font-semibold"
        >
          <p>Principais benefícios</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 0.8, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="pb-28 text-[25px]"
        >
          See how Mind<span className="italic">Rush</span> can revolutionize the way of teaching and
          learning.
        </motion.div>

        <div className="flex gap-10">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative mx-auto h-[450px] w-[600px] rounded-3xl bg-secondary"
          >
            <div className="absolute inset-0 z-20 flex items-center justify-center">
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
                className="mb-8 flex items-center gap-5"
              >
                <p className="h-10 w-10 rounded-full bg-primary p-2 font-bold text-background">1</p>
                <p className="text-lg font-semibold">Create quizzes in less than 3 minutes</p>
              </motion.div>

              <motion.div
                initial={{ x: +100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="mb-8 flex items-center gap-5"
              >
                <p className="h-10 w-10 rounded-full bg-primary p-2 font-bold text-background">2</p>
                <p className="text-lg font-semibold">Real-time tracking</p>
              </motion.div>
              <motion.div
                initial={{ x: +100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                viewport={{ once: true }}
                className="mb-8 flex items-center gap-5"
              >
                <p className="h-10 w-10 rounded-full bg-primary p-2 font-bold text-background">3</p>
                <p className="text-lg font-semibold">+ Engagement and interactivity</p>
              </motion.div>

              <motion.div
                initial={{ x: +100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                viewport={{ once: true }}
                className="mb-24 flex items-center gap-5"
              >
                <p className="h-10 w-10 rounded-full bg-primary p-2 font-bold text-background">4</p>
                <p className="text-lg font-semibold">Time saving for you!</p>
              </motion.div>

              <motion.div
                initial={{ x: +100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
                viewport={{ once: true }}
                className="flex"
              >
                <Button variant="secondary">Start now</Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[200px] bg-secondary py-20 text-center text-background">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 0.8, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-[40px]">The solution for boring and tedious classes!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Benefits;
