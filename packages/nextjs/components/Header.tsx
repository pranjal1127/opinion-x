"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

// export const HeaderMenuLinks = () => {
//   const pathname = usePathname();

//   return (
//     <>
//       {menuLinks.map(({ label, href, icon }) => {
//         const isActive = pathname === href;
//         return (
//           <li key={href}>
//             <Link
//               href={href}
//               passHref
//               className={`${
//                 isActive ? "bg-secondary shadow-md" : ""
//               } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
//             >
//               {icon}
//               <span>{label}</span>
//             </Link>
//           </li>
//         );
//       })}
//     </>
//   );
// };

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-end flex justify-between flex-grow mr-4">
        <Link href={"/"} passHref>
          <div className="">
            <Image src="/opinionX_logo-removebg-preview.png" alt="OpinionX Logo" width={100} height={100} />
          </div>
        </Link>
        <div className="flex justify-between items-center">
          {/* <SwitchTheme /> */}
          <RainbowKitCustomConnectButton />
          <FaucetButton />
        </div>
      </div>
    </div>
  );
};
