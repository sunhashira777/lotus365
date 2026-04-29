/* eslint-disable */
import { BetSlip, Footer, Navbar } from '@/components';
import React from 'react';
import { Outlet } from 'react-router-dom';

import LeftSidebarDesk from '@/components/LeftSidebarDesk';
import FloatingIcons from '@/components/FloatingIcons';

const Sidebar = () => {
  return (
    <div className="light-bg">
      <Navbar />
      <section className=" mx-auto xl:container  px-4   xl:px-0">
        <div className="2xl:container  flex gap-5 mx-auto">
          <LeftSidebarDesk />
          <div className="flex-1 min-w-0 w-full ">
            <Outlet />
          </div>
          <div className="!w-[320px] mt-[15px] hidden lg:block flex-shrink-0">
            <BetSlip />
          </div>
        </div>
      </section>
      <Footer />
      <FloatingIcons />
    </div>
  );
};

export default Sidebar;
