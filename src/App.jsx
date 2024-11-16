import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Main from "./components/Main";
import SideBar from "./components/SideBar";

function App() {  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = `import.meta.env.VITE_NASA_API_KEY`
      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`

      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;
      
      // Clear old cache entries
      localStorage.clear();

      // Check cache
      if(localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey));
        setData(apiData);
        console.log('Fetched from cache today');
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log('Fetched from API today');
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAPIData();
  }, []);

  return (
    <>
      {data ? (<Main data={data}/>):(
        <div className="LoadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && <SideBar data={data} handleToggleModal={handleToggleModal} />}
      {data && (
        <Footer data={data} handleToggleModal={handleToggleModal} />)}
    </>
  );
}

export default App;