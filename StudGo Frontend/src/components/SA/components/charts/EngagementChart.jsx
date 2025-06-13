import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const EngagementChart = ({ isLoading }) => {
  const [chartData] = useState({
    series: [
      {
        name: "Registrations",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        name: "Participation",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 55, 43, 32]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
        fontFamily: 'Inter, sans-serif',
        background: 'transparent',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        }
      },
      theme: {
        mode: 'dark',
      },
      colors: ['#f59e0b', '#3b82f6'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        show: true,
        borderColor: '#374151',
        strokeDashArray: 5,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      markers: {
        size: 4,
        colors: ['#f59e0b', '#3b82f6'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: '#fff'
        }
      },
      tooltip: {
        theme: 'dark',
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (Students)";
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + " (Students)";
              }
            }
          }
        ]
      }
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
        type="line" 
        height={350} 
      />
    </div>
  );
};

export default EngagementChart;
