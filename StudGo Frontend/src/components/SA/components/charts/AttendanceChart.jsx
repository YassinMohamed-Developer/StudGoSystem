import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const AttendanceChart = ({ isLoading }) => {
  const [chartData] = useState({
    series: [{
      name: 'Attendance',
      data: [76, 85, 62, 91, 74, 55, 78]
    }, {
      name: 'Capacity',
      data: [100, 100, 80, 100, 80, 70, 90]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
        fontFamily: 'Inter, sans-serif',
        background: 'transparent'
      },
      theme: {
        mode: 'dark',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Leadership', 'Web Dev', 'AI Ethics', 'Career Fair', 'Networking', 'Mobile Dev', 'Cloud'],
        labels: {
          style: {
            colors: '#9ca3af',
          },
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          trim: true,
          maxHeight: 120
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        title: {
          text: 'Participants',
          style: {
            color: '#9ca3af'
          }
        },
        labels: {
          style: {
            colors: '#9ca3af',
          }
        }
      },
      fill: {
        opacity: 1,
        type: 'solid'
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " participants"
          }
        },
        theme: 'dark'
      },
      grid: {
        show: true,
        borderColor: '#374151',
        strokeDashArray: 5,
        position: 'back',
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#fff'
        }
      },
      colors: ['#3b82f6', '#4b5563']
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse w-full h-full bg-gray-700 rounded-xl"></div>
    );
  }

  return (
    <div id="chart" className="w-full h-full">
      <ReactApexChart 
        options={chartData.options} 
        series={chartData.series} 
        type="bar" 
        height={350} 
      />
    </div>
  );
};

export default AttendanceChart;
