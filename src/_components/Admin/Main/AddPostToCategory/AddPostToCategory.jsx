import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../../../../firebasedatabase/firebase";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { BsArrowClockwise } from "react-icons/bs";

export default function AddPostToCategory() {
  const [file, setFile] = useState();

  const [category, setCategory] = useState();

  const [loader, setLoader] = useState(false);

  const [categoryId, setCategoryId] = useState();

  const titleRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !category || !titleRef.current?.value) {
      alert("Fields are missing");
      return;
    }

    const title = titleRef.current.value; // Ensure title is set properly

    try {
      setLoader(true);
      const firestore = getFirestore(app);
      const docRef1 = doc(firestore, "categories", categoryId);
      await updateDoc(docRef1, { postLength: increment(1) });

      const storage = getStorage(app);
      const imgRef = ref(storage, `${category}Posts/${title}`);
      await uploadBytes(imgRef, file);
      const imageURL = await getDownloadURL(imgRef);

      await addDoc(collection(firestore, `${category}`), {
        title: title,
        image: imageURL,
      });

      alert(`Post added to ${category}`);
      location.reload();
    } catch (error) {
      console.error(error); // Log for debugging
      alert(error.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  }

  const [data, setData] = useState();

  console.log(data);

  const fetchData = async () => {
    const firestore = getFirestore(app);
    const collectionRef = collection(firestore, "categories");
    const snapshot = await getDocs(collectionRef);
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full min-h-screen px-5">
        <h1 className="text-xl font-medium mb-5">Add post to categpory</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 py-5 max-w-[500px] w-full px-5 rounded-lg gap-2 flex items-start justify-center flex-col"
        >
          <select
            className="w-full py-2 px-3 rounded-full"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option selected disabled>
              Select Category below
            </option>
            {data &&
              data.map((item) => (
                <option onClick={() => setCategoryId(item.id)}>
                  {item.name}
                </option>
              ))}
          </select>

          <input
            ref={titleRef}
            type="text"
            placeholder="Enter Post Title"
            className="border outline-none py-2 bg-white px-2 rounded-full w-full"
          />
          <input
            className="border bg-white outline-none py-2 px-2 rounded-full w-full"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {loader ? (
            <button
              type="submit"
              className="bg-blue-500 px-2 py-1 my-2 rounded-md w-full font-medium text-white text-lg hover:bg-transparent hover:text-blue-500 hover:border-blue-500 border border-blue-500 transition-all ease-in-out duration-300 flex items-center justify-center gap-2"
            >
              <BsArrowClockwise className="text-2xl animate-spin" />
              Please wait
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 px-2 py-1 my-2 rounded-md w-full font-medium text-white text-lg hover:bg-transparent hover:text-blue-500 hover:border-blue-500 border border-blue-500 transition-all ease-in-out duration-300"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </>
  );
}
