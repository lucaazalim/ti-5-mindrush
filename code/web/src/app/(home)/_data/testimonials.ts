import avatar1 from "../../../../public/home/avatar-1.png";
import avatar2 from "../../../../public/home/avatar-2.png";
import avatar3 from "../../../../public/home/avatar-3.png";
import avatar4 from "../../../../public/home/avatar-4.png";
import avatar5 from "../../../../public/home/avatar-5.png";
import avatar6 from "../../../../public/home/avatar-6.png";
import avatar7 from "../../../../public/home/avatar-7.png";
import avatar8 from "../../../../public/home/avatar-8.png";
import avatar9 from "../../../../public/home/avatar-9.png";

type Testimonial = {
  text: string;
  imageSrc: string;
  name: string;
  username: `@${string}`;
};

export const testimonials: Testimonial[] = [
  {
    text: "With this quiz platform, my students are more engaged and participative in classes. It's an incredible tool to dynamize teaching!",
    imageSrc: avatar1.src,
    name: "Maria Souza",
    username: "@professora_maria",
  },
  {
    text: "The quizzes are easy to create and track. As a teacher, I can see all students' performance in real time. This has improved learning a lot!",
    imageSrc: avatar2.src,
    name: "João Oliveira",
    username: "@joao_ensina",
  },
  {
    text: "The platform has an intuitive interface and allows me to customize questions as I want. My students love the experience!",
    imageSrc: avatar3.src,
    name: "Bernardo Costa",
    username: "@beducador",
  },
  {
    text: "I never imagined it would be possible to apply quizzes in such a practical and fun way! Our students are super motivated.",
    imageSrc: avatar4.src,
    name: "Lucas Mendes",
    username: "@lucas_professor",
  },
  {
    text: "The ability to create quizzes for entire classes and track results in real time made all the difference in my online classes.",
    imageSrc: avatar5.src,
    name: "Juliano da Costa",
    username: "@jul_estudante",
  },
  {
    text: "The platform design is very pleasant, and integration with mobile devices facilitates student use. An excellent tool for educators!",
    imageSrc: avatar6.src,
    name: "Thaina Rocha",
    username: "@profthaina",
  },
  {
    text: "The gamification of classes with quizzes made learning much more interesting. Now, studying became a fun challenge for me and my colleagues!",
    imageSrc: avatar7.src,
    name: "Gustavo Ferreira",
    username: "@guga_estudante",
  },
  {
    text: "Using quizzes on mobile was a great innovation. The app is simple and allows students to participate from anywhere, which made classes much more dynamic.",
    imageSrc: avatar8.src,
    name: "Clara Moreira",
    username: "@clara_ensina",
  },
  {
    text: "The platform helped me better understand my students' progress, and the quiz customization functions are perfect for our needs.",
    imageSrc: avatar9.src,
    name: "Renato Lima",
    username: "@renatoensina",
  },
];
