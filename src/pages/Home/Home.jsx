import React, { useRef } from "react";
import {
  Link as LinkScroll,
  Element,
  Events,
  animateScroll as scroll,
  scroller,
} from "react-scroll";
// import Typed from "react-typed";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import PhonelinkIcon from "@mui/icons-material/Phonelink";
import ChatIcon from "@mui/icons-material/Chat";
import Logo from "/assets/VihigaLogo.png";
import NewsAndEvents from "./NewsAndEvents/NewsAndEvents";
import StaffDirectory from "./StaffDirectory";
import JobRequests from "./JobRequests/JobRequests";
import Footer from "./Footer";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import Typewriter from "typewriter-effect";
import FormsAndTemplates from "./FormsAndTemplates";
import QuickLinks from "./QuickLinks";

const Home = () => {
  const {  loadingUSERS } = useOutletContext();

  return (
    <>
      {!loadingUSERS ? (
        <>
          <div className="relative row overflow-clip s h-[90vh]">
            <div className="sm:w-[60vw] w-full col ">
              <img
                src={Logo}
                alt="logo"
                className="flex-1 opacity-60 filter-blur "
              />
            </div>
            <div className="z-10 sm:w-[45vw] absolute h-full w-3/4 right-0 bg-slate-800/5 col justify-center -translate-x-[5vw] ">
              <p className="sm:text-7xl text-3xl font-bold font-">Welcome to our</p>
              <p className="sm:text-5xl text-2xl font-semibold">Intranet System</p>
              <div className="text-primary sm:text-2xl text-3xl font-semibold ">
                <Typewriter
                  options={{
                    strings: [
                      "Here you can find anything",
                      "Request Leave",
                      "Easy Communication ",
                      "Car Loans & Mortgages",
                    ],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </div>
            </div>
          </div>

          <Element name="FormsAndTemplates">
            <FormsAndTemplates />
          </Element>
          <QuickLinks />
          <Element name="NewsAndEvents">
            <NewsAndEvents />
          </Element>

          <Element className="my-5 col items-center" name="JobRequests">
            <JobRequests />
          </Element>

          <Element
            className="mt-10 w-[100vw]d p-6 bg-white"
            name="StaffDirectory"
          >
            <StaffDirectory />
          </Element>
          <Footer />
        </>
      ) : (
        <div className="h-[80vh] w-full">
          <ProgressIndicator />
        </div>
      )}
    </>
  );
};

export default Home;
