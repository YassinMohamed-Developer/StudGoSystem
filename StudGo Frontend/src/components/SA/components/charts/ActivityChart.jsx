import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ActivityChart = ({ isLoading }) => {
  const [chartData] = useState({
    series: [
      {
        name: 'Events',
        data: [31, 40, 28, 51, 42, 109, 100]
      },
      {
        name: 'Workshops',
        data: [11, 32, 45, 32, 34, 52, 41]
      },
      {
        name: 'Talks',
        data: [15, 11, 32, 18, 9, 24, 11]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        fontFamily: 'Inter, sans-serif',
        background: 'transparent'
      },
      theme: {
        mode: 'dark',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            colors: '#9ca3af',
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
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
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      colors: ['#3b82f6', '#10b981', '#f59e0b']
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
        type="area" 
        height={350} 
      />
    </div>
  );
};

export default ActivityChart;
