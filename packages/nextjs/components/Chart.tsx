import React, { useEffect } from "react";

const limit = 10000; //increase number of dataPoints by increasing this
let y = 1000;
const data: Array<{ type: string; dataPoints: Array<{ x: number; y: number }> }> = [];
const dataSeries: { type: string; dataPoints: Array<{ x: number; y: number }> } = { type: "spline", dataPoints: [] };
const dataPoints = [];
for (let i = 0; i < limit; i += 1) {
  y += Math.round(Math.random() * 10 - 5);
  dataPoints.push({ x: i, y: y });
}
dataSeries.dataPoints = dataPoints;
data.push(dataSeries);

export default function Chart() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://canvasjs.com/assets/script/jquery-1.11.1.min.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://cdn.canvasjs.com/canvasjs.stock.min.js";
    script2.async = true;
    document.body.appendChild(script2);

    script2.onload = function () {
      const stockChart = new CanvasJS.StockChart("chartContainer", {
        title: {
          text: "StockChart with Numeric Axis",
        },
        animationEnabled: true,
        exportEnabled: true,
        charts: [
          {
            axisX: {
              crosshair: {
                enabled: true,
                snapToDataPoint: true,
              },
            },
            axisY: {
              crosshair: {
                enabled: true,
                //snapToDataPoint: true
              },
            },
            data: data,
          },
        ],
        rangeSelector: {
          inputFields: {
            startValue: 4000,
            endValue: 6000,
            valueFormatString: "###0",
          },

          buttons: [
            {
              label: "1000",
              range: 1000,
              rangeType: "number",
            },
            {
              label: "2000",
              range: 2000,
              rangeType: "number",
            },
            {
              label: "5000",
              range: 5000,
              rangeType: "number",
            },
            {
              label: "All",
              rangeType: "all",
            },
          ],
        },
      });
      stockChart.render();
    };

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div>
      <div id="chartContainer" className="h-[450px] w-[50vw] mt-10"></div>
    </div>
  );
};

