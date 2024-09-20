import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router";
import { MyContext } from "../../../context-Api/ContextAPI";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../../firebasedatabase/firebase";
export default function Header() {
  const { setCloseAnimation } = useContext(MyContext);

  const location = useLocation();
  const { pathname } = location;

  const [top, setTop] = useState("top-[-120%]");
  const [direction, setDirection] = useState("down");
  const [visibility, setVisibility] = useState("opacity-1");

  const [showLogin, setShowLogin] = useState();

  useEffect(() => {
    const session = sessionStorage.getItem("admin");
    if (!session) {
      setShowLogin(true);
    }
  }, []);

  const handleClick = () => {
    if (direction === "down") {
      setTop("top-[0%]");
      setVisibility("opacity-1");
      setDirection("up");
    } else {
      setTop("top-[100%]");
      setDirection("down");
      setVisibility("opacity-0");
    }
  };

  useEffect(() => {
    if (top === "top-[100%]") {
      setTimeout(() => {
        setTop("top-[-120%]");
        setVisibility("opacity-0");
      }, 1000);
    }
  }, [top]);

  const boldNavLin = [
    { name: "Profile", link: "/profile" },
    { name: "Work", link: "/" },
  ];

  const [animateIndex, setAnimateIndex] = useState(null);

  const [boldAnimateIndex, setBoldAnimateIndex] = useState(null);

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  async function fetchData() {
    const firestore = getFirestore(app);
    const collectionRef = collection(firestore, "categories");
    const snapshot = await getDocs(collectionRef);
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    setData(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleDynamicNavigation = (link) => {
    setCloseAnimation(true);
    setTop("top-[-120%]");
    setDirection("down");
    setVisibility("opacity-1");
    setTimeout(() => {
      navigate(`/${link}`);
      setCloseAnimation(false);
    }, 2500);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="w-7 flex fixed right-5 z-50 top-5 flex-col gap-[7px] before:absolute before:content-[''] before:w-full before:h-full before:top-0 before:left-0 before:cursor-pointer"
      >
        <hr
          className={`border  ${
            pathname === "/profile" ? "border-white" : "border-black"
          }`}
        />
        <hr
          className={`border  ${
            pathname === "/profile" ? "border-white" : "border-black"
          }`}
        />
        <hr
          className={`border  ${
            pathname === "/profile" ? "border-white" : "border-black"
          }`}
        />
      </div>
      <div
        className={`w-full bg-white fixed flex ${visibility} flex-col items-center justify-center left-0 transition-all ease-in-out duration-1000 ${top} z-50  h-[100vh]`}
      >
        <ul className="text-center flex flex-col items-center justify-center px-5">
          {boldNavLin.map((item, index) => {
            return (
              <>
                <li
                  onClick={() => {
                    setTop("top-[-120%]");
                    setDirection("down");
                    setVisibility("opacity-1");
                    navigate(item.link);
                  }}
                  onMouseEnter={() => setBoldAnimateIndex(index)}
                  onMouseLeave={() => setBoldAnimateIndex(null)}
                  style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                  className="text-2xl mb-2 max-w-min cursor-pointer"
                >
                  {item.name}
                  <div
                    className={`h-[1px] bg-black ${
                      boldAnimateIndex === index ? "w-full" : "w-0"
                    } mt-[2px] transition-all ease-in-out duration-500`}
                  ></div>
                </li>
              </>
            );
          })}

          {data.map((item, index) => {
            return (
              <>
                <li
                  onClick={() => handleDynamicNavigation(item.name)}
                  style={{ fontFamily: "sans-serif" }}
                  key={index}
                  onMouseLeave={() => setAnimateIndex(null)}
                  onMouseEnter={() => setAnimateIndex(index)}
                  className="text-xl font-light my-1 cursor-pointer "
                >
                  {item.name}
                  <div
                    className={`h-[1px] bg-black ${
                      animateIndex === index ? "w-full" : "w-0"
                    } mt-[2px] transition-all ease-in-out duration-500`}
                  ></div>
                </li>
              </>
            );
          })}
        </ul>
        {showLogin ? (
          <button
            onClick={() => navigate("/login")}
            className="border-b text-blue-500 border-b-blue-500 mt-10"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => navigate("/admin")}
            className="border-b text-blue-500 border-b-blue-500 mt-10"
          >
            Dashboard
          </button>
        )}

        <motion.div
          onClick={handleClick}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.5 }}
          transition={{ duration: 0.1 }}
          className="absolute top-5 right-5 cursor-pointer flex items-center justify-center"
        >
          <RxCross2 className="w-8 h-8 duration-300 ease-in-out transition-all" />
        </motion.div>
      </div>
    </>
  );
}
