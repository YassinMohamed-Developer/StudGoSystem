import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ActivityTypeChart = ({ isLoading, statistics }) => {
  const [chartData, setChartData] = useState({
    series: [0, 0, 0],
    options: {
      chart: {
        type: 'donut',
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      theme: {
        mode: 'dark',
      },
      labels: ['Technical', 'Non-Technical', 'Mixed'],
      colors: ['#6366f1', '#ec4899', '#8b5cf6'],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              },
              value: {
                show: true,
                fontSize: '18px',
                fontWeight: 700,
                color: '#fff',
                offsetY: 0
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: '#fff',
          useSeriesColors: false
        },
        markers: {
          width: 8,
          height: 8,
          strokeWidth: 0,
          radius: 8,
        },
        itemMargin: {
          horizontal: 8,
          vertical: 4
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      stroke: {
        width: 0
      }
    },
  });

  useEffect(() => {
    if (statistics) {
      setChartData(prev => ({
        ...prev,
        series: [
          statistics.numOfTechnicalActivites,
          statistics.numOfNonTechnicalActivites,
          statistics.numOfMixedActivites
        ]
      }));
    }
  }, [statistics]);

  if (isLoading) {
    return (
      <div className="animate-pulse w-full h-full bg-gray-700/50 rounded-lg"></div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactApexChart 
        options={chartData.options} 
        series={chartData.series} 
        type="donut" 
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default ActivityTypeChart; 