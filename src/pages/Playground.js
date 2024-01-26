/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import aki from "../assets/images/Aki.png";
import jocke from "../assets/images/Jocke.png";
import uki from "../assets/images/Uki.png";
import micko from "../assets/images/Micko.png";
import { useParams } from "react-router-dom";
import axios from "axios";

const Playground = () => {
  const { agent } = useParams();
  const canvasRef = useRef(null);
  const [prevLoaded, setPrevLoaded] = useState(false)
  const [prevPoints, setPrevPoints] = useState([])
  const [prevPrices, setPrevPrices] = useState([])
  const [agentLocationChoice, setAgentLocationChoice] = useState(false);
  const [coinsLocationChoice, setCoinsLocationChoice] = useState(false);
  const [points, setPoints] = useState([]);
  const [info, setInfo] = useState(null);
  const [tempPrices, setTempPrices] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [prices, setPrices] = useState([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);
  const [modal, setModal] = useState(false);
  const [result, setResult] = useState([]);
  const [end] = useState(false);
  const [step, setStep] = useState(0);

  const canvasClickHandler = (e) => {
    if ((agentLocationChoice || coinsLocationChoice) && points.length < 7) {
      setPoints([
        ...points,
        {
          id: points?.length + 1,
          x: e.clientX,
          y: e.clientY,
        },
      ]);
      setCoinsLocationChoice(false);
      setAgentLocationChoice(false);
    } else return;
  };

  const drawPoint = (point, ind) => {
    const canvas = canvasRef.current;
    //! IMPORTANT: COORDINATES CAN BE SHOWCASED IF NEEDED
    // const rect = canvas.getBoundingClientRect();
    // const xScale = 1000 / rect.width;
    // const yScale = 800 / rect.height;
    // coordinate system starting at top left corner
    // const x = Math.round((e.clientX - rect.left) * xScale);
    // const y = Math.round((e.clientY - rect.top) * yScale);
    // alert(`Clicked coordinates: x = ${x}, y = ${y}`);

    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(point.x, point.y, 36, 0, 2 * Math.PI); // 25px radius for a 50x50px circle
    ctx.fillStyle = "white"; // Circle color
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(point.x, point.y, 32, 0, 2 * Math.PI); // 25px radius for a 50x50px circle
    ctx.fillStyle = point.id === 1 ? "green" : "gold"; // Circle color
    ctx.fill();
    ctx.closePath();

    if (point.id === 1) {
      const img = new Image();
      img.onload = () => {
        const imgSize = 40; // Adjust the image size
        ctx.drawImage(
          img,
          point.x - imgSize / 2,
          point.y - imgSize / 2,
          imgSize,
          imgSize
        );
      };

      img.src = switchAvatar();
    } else {
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.fontWight = "900";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(point.id - 1, point.x, point.y);
      var point2 = { x: point.x, y: point.y, id: points?.length + 1 };
      drawPaths(point2, ind);
    }
  };

  const drawPaths = (sourcePoint, val) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    points
      .filter((n) => n.id < points.length)
      .forEach((endpoint, index) => {
        ctx.strokeStyle = "#fff";
        ctx.setLineDash([0, 0]);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(sourcePoint.x, sourcePoint.y);
        ctx.lineTo(endpoint.x, endpoint.y);
        ctx.stroke();

        // Calculate the midpoint between the two points
        const midX = (sourcePoint.x + endpoint.x) / 2;
        const midY = (sourcePoint.y + endpoint.y) / 2;

        if (
          midX !== sourcePoint.x &&
          midX !== endpoint.x &&
          midY !== sourcePoint.y &&
          midY !== endpoint.y
        ) {
          //Draw a rectangle at the midpoint
          const rectSize = 50; // Adjust the size of the rectangle
          ctx.fillStyle = "rgba(0, 0, 0, .25)"; // Set the fill color and transparency
          ctx.fillRect(
            midX - rectSize / 2,
            midY - rectSize / 2,
            rectSize,
            rectSize
          );

          //Draw the text inside the rectangle
          ctx.fillStyle = "white";
          ctx.font = "16px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.fillText(prices[val][index], midX, midY);
        }
      });
  };

  function drawCoordinateSystem() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;

    const xScale = width / 1000; // Scale for x-axis (1000 units)
    const yScale = height / 800; // Scale for y-axis (800 units)

    canvas.width = width;
    canvas.height = height;
    ctx.beginPath();
    ctx.strokeStyle = "#77aa77";
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Arial";
    // ctx.fontWeight = '900'

    // Draw vertical lines and labels
    for (let x = 0; x <= width; x += 100 * xScale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.fillText(Math.round(x / xScale), x + 5, height - 5);
    }

    // Draw horizontal lines and labels
    for (let y = 0; y <= height; y += 100 * yScale) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.fillText(Math.round(height / yScale - y / yScale), 5, y - 5);
    }

    ctx.stroke();

    points.forEach((n, index) => {
      drawPoint(n, index);
    });

    if (result.length > 0) {
      if (end) {
        //! it is never going inside this
        //! won't delete it because only God knows what would happen
        //! don't ever touch

        ctx.strokeStyle = "#ff5555";
        ctx.setLineDash([50, 10]);
        ctx.lineWidth = 8;
        result.forEach((n) => {
          // result for each
          if (result.indexOf(n) !== 0) {
            ctx.beginPath();
            ctx.moveTo(getPoint(n + 1).x, getPoint(n + 1).y);
            ctx.lineTo(
              getPoint(result[result.indexOf(n) - 1] + 1).x,
              getPoint(result[result.indexOf(n) - 1] + 1).y
            );
            ctx.stroke();
          }
        });
      } else {
        if (step > 0) {
          ctx.strokeStyle = "#ff5555";
          ctx.setLineDash([75, 15]);
          ctx.lineWidth = 8;
          result.forEach((n) => {
            // result for each
            if (result.indexOf(n) !== 0 && result.indexOf(n) <= step) {
              ctx.beginPath();
              ctx.moveTo(getPoint(n + 1).x, getPoint(n + 1).y);
              ctx.lineTo(
                getPoint(result[result.indexOf(n) - 1] + 1).x,
                getPoint(result[result.indexOf(n) - 1] + 1).y
              );
              ctx.stroke();
            }
          });
        }
      }
    }
  }

  const getPoint = (id) => points.find((n) => n.id === id);

  const switchAvatar = () => {
    switch (agent) {
      case "micko":
        return micko;
      case "aki":
        return aki;
      case "jocke":
        return jocke;
      case "uki":
        return uki;
      default:
        return;
    }
  };

  const handleRun = async () => {
    console.log(prices);
    localStorage.setItem('prices', JSON.stringify(prices));
    localStorage.setItem('pointsArray', JSON.stringify(points));
    // extract '0' rows & columns
    const newMatrix = prices
      .slice(0, points.length)
      .map((row) => row.slice(0, points.length));

    try {
      const response = await axios.post(
        "https://django-api-eazf.vercel.app/api/get-path",
        {
          agent,
          prices: newMatrix,
          nmberOfPoints: points.length,
        }
      );
      setResult(response.data.minPath.slice(0, points?.length));
      setInfo({
        cost: response.data.pathCost,
        time: response.data.elapsedTime,
      });
      if(agent === "aki") alert("Oduzmite cenu od prvog do poslednjeg cvora!")
    } catch (err) {
      alert("Something went wrong...");
      console.log(err);
    }
  };

  const handlePriceChange = (e, index) => {
    var newTempPrices = tempPrices.map((n, ind) =>
      ind === index ? e.target.value : n
    );
    setTempPrices(newTempPrices);
  };

  const closeModal = () => {
    const newPrices = prices;
    for (let i = 0; i < points.length; i++) {
      newPrices[i][points.length - 1] = Number(tempPrices[i]);
    }
    for (let i = 0; i < points.length; i++) {
      newPrices[points.length - 1][i] = Number(tempPrices[i]);
    }

    setPrices(newPrices);
    setTempPrices([0, 0, 0, 0, 0, 0, 0]);
    setModal(false);
  };

  const previousMapHandler = () =>{
    setPrevLoaded(true)
    // Retrieve values from localStorage
  const pricesMatrixString = localStorage.getItem('prices');
  const pointsArrayString = localStorage.getItem('pointsArray');

  // Check if the values exist in localStorage
  if (pricesMatrixString && pointsArrayString) {
    try {
      // Parse the JSON strings to get the actual arrays
      const pricesMatrix = JSON.parse(pricesMatrixString);
      const pointsArray = JSON.parse(pointsArrayString);

      // Set the prices matrix and points array
      setPrices(pricesMatrix);
      setPoints(pointsArray);

      console.log("Values read from localStorage:", pricesMatrix, pointsArray);
    } catch (error) {
      console.error("Error parsing values from localStorage:", error);
    }
  } else {
    console.log("Values not found in localStorage");
  }
  }

  const resetHandler = () => {
    setCoinsLocationChoice(false);
    setAgentLocationChoice(false);
    setPoints([]);
    setPrevLoaded(false)
    setModal(false);
    setTempPrices([0, 0, 0, 0, 0, 0, 0]);
    setPrices([
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]);
    setResult([]);
    setStep(0);
  };

  useEffect(()=>{
    const pricesMatrixString = localStorage.getItem('prices');
    const pointsArrayString = localStorage.getItem('pointsArray');

    if (pricesMatrixString && pointsArrayString) {
        // Parse and set the values using useState
        const pricesMatrix = JSON.parse(pricesMatrixString);
        const pointsArray = JSON.parse(pointsArrayString);
      
        setPrevPoints(pointsArray)
        setPrevPrices(pricesMatrix)
    }
  },[])

  useEffect(() => {
    if (points || result) drawCoordinateSystem();
    // eslint-disable-next-line
  }, [points, end, result, modal, step]);

  useEffect(() => {
    if (points?.length > 1 && points?.length < 8 && !prevLoaded) setModal(true);
  }, [points]);

  return (
    <div className="map">
      <button
        disabled={points?.length > 0}
        className={agentLocationChoice ? "add-agent active" : "add-agent"}
        onClick={() => {
          setAgentLocationChoice((s) => !s);
          setCoinsLocationChoice(false);
        }}
      >
        <img alt="agent" src={switchAvatar()} width={"60px"} />
      </button>
      <button
        disabled={
          points?.length === 0 ||
          points?.length > 6 ||
          modal ||
          result.length > 0 ||
          prevLoaded
        }
        className={coinsLocationChoice ? "add-coin active" : "add-coin"}
        onClick={() => {
          setCoinsLocationChoice((s) => !s);
          setAgentLocationChoice(false);
        }}
      >
        COINS
      </button>
      {result.length === 0 ? (
        <button
          disabled={points?.length <= 2}
          className={coinsLocationChoice ? "run-algo active" : "run-algo"}
          onClick={() => {
            setCoinsLocationChoice(false);
            setAgentLocationChoice(false);
            handleRun();
          }}
        >
          RUN
        </button>
      ) : (
        <>
          <button
            className={"execute-algo active"}
            onClick={() => {
              // setEnd(true);
              setStep(result.length - 1);
            }}
            disabled={step === result.length - 1}
          >
            END
          </button>
          <button
            className={"step-algo-fwd"}
            onClick={() => {
              setCoinsLocationChoice(false);
              setAgentLocationChoice(false);
              setStep((s) => s + 1);
            }}
            disabled={step === result.length - 1}
          >
            STEP FWD
          </button>
          <button
            className={"step-algo-bwd"}
            onClick={() => {
              setCoinsLocationChoice(false);
              setAgentLocationChoice(false);
              setStep((s) => s - 1);
            }}
            disabled={step === 0}
          >
            STEP BWD
          </button>
        </>
      )}
      <button
        disabled={points?.length === 0}
        className={"reset-btn"}
        onClick={resetHandler}
      >
        RESET
      </button>
      {(prevPoints.length > 0 && result?.length === 0 && !prevLoaded) &&
      <button
        // disabled={}
        className={"prev-prices-btn"}
        onClick={previousMapHandler}
      >
        PREV
      </button>}
      {result.length > 0 ? (
        <div className="result-info">
          <h4>Elapsed Time: {info.time} seconds</h4>
          <h4>Total Cost: {info.cost}</h4>
        </div>
      ) : (
        ""
      )}
      <canvas
        className={agentLocationChoice || coinsLocationChoice ? "target" : ""}
        onClick={canvasClickHandler}
        ref={canvasRef}
      ></canvas>
      {modal ? (
        <div className="prices-modal">
          <h3>
            Enter path prices to{" "}
            {points?.length === 0 ? "Agent" : `Coin ${points?.length - 1}`}:
          </h3>
          {points?.map(
            (n, index) =>
              index + 1 < points[points.length - 1].id && (
                <div className="price-input">
                  <p>Price from {index === 0 ? "Agent" : "Coin " + index}:</p>
                  <input
                    onChange={(e) => handlePriceChange(e, index)}
                    type="number"
                  />
                </div>
              )
          )}
          <button onClick={closeModal} className="confirm-modal">
            Confirm
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Playground;
