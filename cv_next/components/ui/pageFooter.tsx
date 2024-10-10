import React from 'react';
import { Credits } from "@/lib/definitions";
import Image from 'next/image';
import linkedin from '@/public/icons/linkedin.svg';


const Footer: React.FC = () => {
    return (
        
        <footer className='p-4 w-full font-light text-muted-foreground text-primary inset-x-0 bottom-0'>
            <div className='container columns-4 flex justify-center'>
                <hr className ="w-11/12 h-1 mx-auto my-4 border-0 rounded md:my-10 dark:bg-slate-500"/>
                <a href="https://www.instagram.com" target="_blank" className='max-w-24 max-h-24 mx-3 pl-4 py-5 dark:fill-slate-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://www.linkedin.com" target="_blank" className='max-w-24 max-h-24 mx-3 pr-4 py-5 dark:fill-slate-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="46" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
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