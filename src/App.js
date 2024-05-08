import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const XAXISRANGE = 86400000; // 1 วันในมิลลิวินาที
let lastDate = new Date('2024-01-01').getTime(); // วันที่ 1 มกราคม 2022
let data = [];

function getNewSeries(baseval, yrange) {
  var newDate = baseval + XAXISRANGE;
  lastDate = newDate;

  for(var i = 0; i< data.length - 30; i++) {
    data[i].x = newDate - XAXISRANGE * 30; // เริ่มต้นใหม่ทุกๆ 30 วัน
    data[i].y = 0;
  }

  for (let i = 1; i <= 30; i++) {
    let currentDate = new Date(newDate - XAXISRANGE * (30 - i));
    data.push({
      x: currentDate.getTime(),
      y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min,
      date: currentDate.toLocaleDateString('th-TH') // แปลงวันที่เป็นข้อความในรูปแบบภาษาไทย
    });
  }
}

const App = () => {
  const [series, setSeries] = useState([{ data: [] }]);
  const [options] = useState({
    chart: {
      id: 'realtime',
      height: 400, // ปรับค่าความสูงของกราฟ
      width: 600, // ปรับค่าความกว้างของกราฟ
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Dynamic Updating Chart',
      align: 'left'
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      range: XAXISRANGE * 30, // แสดงข้อมูลสำหรับ 30 วัน
    },
    yaxis: {
      max: 100
    },
    legend: {
      show: false
    },
  });

  useEffect(() => {
	const interval = setInterval(() => {
	  getNewSeries(lastDate, {
		min: 10,
		max: 90
	  });
  
	  // กำหนด lastDate ใหม่เป็นเวลาปัจจุบัน
	  lastDate = Date.now();
  
	  // เพิ่มข้อมูลวันที่ลงไปในอาร์เรย์ data
	  data[data.length - 15].date = new Date(lastDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  
	  // อัปเดต State ของ series
	  setSeries([{ data }]);
	}, 1000); // เปลี่ยนจาก 1000 เป็น 5000 เพื่อให้เลื่อนทีละ 5 วินาที
  
	return () => clearInterval(interval);
  }, []);  

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={options.chart.height} width={options.chart.width} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default App;
