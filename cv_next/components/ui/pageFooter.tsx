import React from 'react';
import { Credits } from "@/lib/definitions";
import Image from 'next/image';
import linkedin from '@/public/icons/linkedin.svg';


const Footer: React.FC = () => {
    return (
        
        <footer className='p-4 w-full font-light text-muted-foreground text-primary'>
            <div className='container columns-4 flex justify-center'>
                <hr className ="w-11/12 h-1 mx-auto my-4 border-0 rounded md:my-10 dark:bg-slate-500"/>
                <a href="https://www.instagram.com" target="_blank" className='max-w-24 max-h-24 mx-3 pl-4 py-5 dark:fill-slate-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://www.linkedin.com" target="_blank" className='max-w-24 max-h-24 mx-3 pr-4 py-5 dark:fill-slate-100'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> */}
                {/* <svg className='max-w-24 max-h-24 mx-3 pr-4 dark:fill-slate-100' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg> */}
                    <Image src={linkedin} alt=''></Image>
                </a>
                <hr className ="w-11/12 h-1 mx-auto my-4 border-0 rounded md:my-10 dark:bg-slate-500"/>
            </div>
            <div className='flex justify-center mb-2'>
                <img alt="Footer image" loading="lazy" width="125" height="75" src="/images/logo.png"/>
            </div>
            <div className='flex justify-center mb-2'>
                <p>&copy; {new Date().getFullYear()} Magshimim Next. All rights reserved.</p>
            </div>
          <div className="flex h-12 w-full items-center justify-center rounded-md px-4 text-xs opacity-50 shadow-md hover:shadow-xl mb-2">
            {`Credit to our team: ${Credits.slice(0, -1).join(", ")} and ${Credits.slice(-1)}`}
          </div>
        </footer>
    );
};

export default Footer;