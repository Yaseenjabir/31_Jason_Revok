import { nanoid } from "nanoid";
import { useNavigate } from "react-router";
import AnimateOnRender from "../../../framer-motion/AnimateOnRender";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../context-Api/ContextAPI";
import AnimateOnClose from "../../../framer-motion/AnimateOnClose";
import EntranceAnimation from "../../../framer-motion/EntranceAnimation";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../../firebasedatabase/firebase";
export default function MainComp() {
  const navigate = useNavigate();

  const { closeAnimation } = useContext(MyContext);

  const { setCloseAnimation } = useContext(MyContext);

  const [categoryData, setCategoryData] = useState([]);

  console.log(categoryData);

  const data = [
    {
      id: nanoid(),
      img: "https://www.jasonrevok.com/wp-content/uploads/2020/12/3CFC8395-2D13-4006-BE47-6075A793066C-780x813.jpeg",
      title: "Spirographs",
      number: 42,
      link: "/spirographs",
    },
    {
      id: nanoid(),
      img: "https://www.jasonrevok.com/wp-content/uploads/2020/12/REV370-1-780x520.jpeg",
      title: "Instrument Frame Drags",
      number: 30,
      link: "/Instrument-frame-drags",
    },
    {
      id: nanoid(),
      img: "https://www.jasonrevok.com/wp-content/uploads/2020/12/REV343-2-780x520.jpeg",
      title: "Tape Loops",
      number: 66,
      link: "/tape-loops",
    },
    {
      id: nanoid(),
      img: "https://www.jasonrevok.com/wp-content/uploads/2021/01/REV356-1-780x520.jpg",
      title: "Self Portrait",
      number: 12,
      link: "/self-portrait",
    },
    {
      id: nanoid(),
      img: "https://www.jasonrevok.com/wp-content/uploads/2021/01/W9A4195-780x520.jpg",
      title: "Objects",
      number: 29,
      link: "/objects",
    },
  ];
  async function fetchCategoryInfo() {
    const firestore = getFirestore(app);
    const collectionRef = collection(firestore, "categories");
    const snapshot = await getDocs(collectionRef);
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    setCategoryData(data);
  }
  useEffect(() => {
    fetchCategoryInfo();
  }, []);

  const [showAnimateOnRender, setShowAnimateOnRender] = useState(false);

  const [entranceAnimate, setEntranceAnimate] = useState(true);

  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setEntranceAnimate(false);
    }, 4200);
    const renderAnimateTimer = setTimeout(() => {
      setShowAnimateOnRender(true);
    }, 2500);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(renderAnimateTimer);
    };
  }, []);

  function handleNavigation(link) {
    setCloseAnimation(true);
    setTimeout(() => {
      navigate(link);
      setCloseAnimation(false);
    }, 2500);
  }

  async function handleDynamicNavigation(link) {
    setCloseAnimation(true);
    setTimeout(() => {
      navigate(`/${link}`);
      setCloseAnimation(false);
    }, 2500);
  }

  return (
    <>
      {entranceAnimate && <EntranceAnimation />}

      {showAnimateOnRender && <AnimateOnRender />}

      <main className="w-full px-5 mt-[85px]">
        <div className="flex flex-col gap-20">
          {categoryData.map((item, index) => {
            return (
              <>
                <div
                  onClick={() => handleDynamicNavigation(item.name)}
                  key={item.id}
                  className="w-full sm:px-[80px] md:px-[100px] lg:px-[180px] xl:px-[240px] cursor-pointer"
                >
                  <img
                    loading="lazy"
                    src={item.image}
                    className="w-full mx-auto"
                  />
                  <div className="flex justify-between w-full gap-1 mt-3 md:mt-5 items-center">
                    <span className="opacity-0"></span>
                    <h1
                      className="text-xl text-center max-w-[275px]"
                      style={{ fontFamily: "Montserrat", fontWeight: 600 }}
                    >
                      {item.name.toUpperCase()}
                    </h1>
                    <div className="relative w-[30px]">
                      <img
                        className="w-full"
                        src="https://www.jasonrevok.com/wp-content/themes/revok/assets/img/images-count.svg"
                      />
                      <h1 className="absolute top-[7px] right-[9px] font-semibold text-gray-800 text-[13px]">
                        {item.postLength}
                      </h1>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </main>

      {closeAnimation && <AnimateOnClose />}
    </>
  );
}
