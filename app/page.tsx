'use client';
import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp, faDiscord, faInstagram, faYoutube, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons'

function page() {
  useGSAP(() => {
    let main = document.body.querySelector(".main");
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 75; j++) {
        let star = document.createElement("div");
        star.className = `star${i} h-1 w-1 bg-white rounded-full absolute scale-50`;
        star.style.left = `${Math.random() * 95}vw`;
        star.style.top = `${Math.random() * 95}vh`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        main?.appendChild(star);
      }
    }
    const tl = gsap.timeline();
    tl.from('.star0', {
      scale: 0,
      duration: 0.1,
      stagger: 0.01
    })
    tl.from('.star1', {
      scale: 0,
      duration: 0.1,
      stagger: 0.01
    })
    tl.from('.star2', {
      scale: 0,
      duration: 0.1,
      stagger: 0.01
    })
    tl.from('.child', {
      scale: 0,
      duration: 1,
      stagger: 0.1
    })
    tl.from('.logo' , {
      x : -100,
      duration: 0.5,
      opacity: 0,
      ease: "power2.out"
    })
    main?.addEventListener('mousemove', (e) => {
      const mouseEvent = e as MouseEvent;
      gsap.to(".star0", {
        x: -(mouseEvent.clientX - window.innerWidth / 2) * 0.05,
        y: -(mouseEvent.clientY - window.innerHeight / 2) * 0.05,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(".star1", {
        x: -(mouseEvent.clientX - window.innerWidth / 2) * 0.1,
        y: -(mouseEvent.clientY - window.innerHeight / 2) * 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(".star2", {
        x: -(mouseEvent.clientX - window.innerWidth / 2) * 0.5,
        y: -(mouseEvent.clientY - window.innerHeight / 2) * 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(".movingPointer", {
        x: mouseEvent.clientX - 20,
        y: mouseEvent.clientY - 20,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  })
  return (
    <div className="main relative h-screen w-full overflow-hidden cursor-none">
      <div className="absolute h-10 w-10 border-2 border-white rounded-full movingPointer z-10"></div>
      <div className="absolute h-full w-full flex justify-center">
        <div className="h-screen w-[50%] flex flex-col justify-center ml-20 text-8xl">
          <Image
            src="/logo-bgless.png"
            width={300}
            height={300}
            alt="Picture of the author"
            className="logo"
          />
          <div className="flex flex-col justify-center">
            <div className="font-bold">
              <span className="text-green-500">A</span>
              <span className="text-stroke-1 text-stroke-white text-transparent">dani</span>
            </div>
            <div className="font-bold">
              <span className="text-green-500">S</span>
              <span className="text-stroke-1 text-stroke-white text-transparent">tudent</span>
            </div>
            <div className="font-bold">
              <span className="text-green-500">P</span>
              <span className="text-stroke-1 text-stroke-white text-transparent">rogramming</span>
            </div>
            <div className="font-bold">
              <span className="text-green-500">D</span>
              <span className="text-stroke-1 text-stroke-white text-transparent">evelopment</span>
            </div>
            <div className="font-bold">
              <span className="text-green-500">C</span>
              <span className="text-stroke-1 text-stroke-white text-transparent">lub</span>
            </div>
          </div>
        </div>
        <div className="h-screen w-[50%] flex flex-col  justify-center gap-12">
          <div className="w-full flex flex-col justify-center items-start gap-2">
            <div className="text-4xl">
              For <span className=" text-green-500 text-5xl">students</span> , By <span className=" text-green-500 text-5xl">students</span>
            </div>
            <div className="text-2xl">
              Dive into the world of coding with ASPDC – where every student, regardless of experience, finds a safe space to learn, grow, and innovate. Join us in exploring web development, AI, competitive programming, and more!
            </div>
          </div>
          <div onMouseMove={() => { document.querySelector('.main')?.classList.remove('cursor-none'); document.querySelector('.movingPointer')?.classList.add('hidden') }} onMouseLeave={() => { document.querySelector('.main')?.classList.add('cursor-none'); document.querySelector('.movingPointer')?.classList.remove('hidden') }}>
            <div className="text-green-500 text-3xl">Join us at :- </div>
            <div className="mt-5 flex items-center gap-4 text-gray-500">
              <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center hover:text-green-500 hover:border-green-500 transition-all hover:translate-y-[-2px]">
                <FontAwesomeIcon icon={faWhatsapp} className="w-8 h-8 text-2xl" />
              </div>
              <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center hover:text-indigo-400 hover:border-indigo-400 transition-all hover:translate-y-[-2px]">
                <FontAwesomeIcon icon={faDiscord} className="w-8 h-8 text-2xl" />
              </div>
              <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center hover:text-pink-600 hover:border-pink-600 transition-all hover:translate-y-[-2px]">
                <FontAwesomeIcon icon={faInstagram} className="w-8 h-8 text-2xl" />
              </div>
              <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center hover:text-red-500 hover:border-red-500 transition-all hover:translate-y-[-2px]">
                <FontAwesomeIcon icon={faYoutube} className="w-8 h-8 text-2xl" />
              </div>
              <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center hover:text-blue-800 hover:border-blue-800 transition-all hover:translate-y-[-2px]">
                <FontAwesomeIcon icon={faLinkedinIn} className="w-8 h-8 text-2xl" />
              </div>
              <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center hover:text-white hover:border-white transition-all hover:translate-y-[-2px]">
                <FontAwesomeIcon icon={faXTwitter} className="w-8 h-8 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
