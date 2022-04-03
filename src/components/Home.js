import React, { useState } from 'react'
import './homeStyles.css'
import { WebcamCapture} from './Webcam'
import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001/api/v0')

const Home = () => {

  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState([]);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrlArr((prev) => [...prev, url]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const [file, setFile] =  useState('');
  const submitForm = () => {
      alert("Form submitted");
  }

  return (
      <div className="home-container">
          <div className="container">
              <div className="text">
                  <h1>Fill up this form!</h1>
                  <form className="form" onSubmit={handleSubmit}>
                      <WebcamCapture/>
                      Aadhar Card Image:<input type="file" />
                      Pan Card Image:<input type="file" />
                      {/* <input type="file" /> */}
                      <button type="submit" className="button">Submit</button>
                  </form>
              </div>
              <div className="display">
        {urlArr.length !== 0
          ? urlArr.map((el) => <img src={el} alt="nfts" />)
          : <h3>Upload data</h3>}
      </div>
          </div>
      </div>
  )
}
export default Home