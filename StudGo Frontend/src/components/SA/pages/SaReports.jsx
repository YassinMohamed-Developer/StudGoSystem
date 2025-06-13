import { useState } from "react";
import { 
  Download, 
  Filter, 
  Calendar, 
  BarChart2, 
  PieChart,
  LineChart,
  FileText,
  Users
} from "lucide-react";

// Mock data for reports
const ACTIVITIES_DATA = [
  { month: "Jan", workshops: 4, talks: 2, seminars: 1 },
  { month: "Feb", workshops: 3, talks: 3, seminars: 2 },
  { month: "Mar", workshops: 5, talks: 1, seminars: 3 },
  { month: "Apr", workshops: 2, talks: 4, seminars: 2 },
  { month: "May", workshops: 6, talks: 2, seminars: 1 },
  { month: "Jun", workshops: 4, talks: 3, seminars: 2 }
];

const ATTENDANCE_DATA = [
  { name: "Computer Science", value: 35 },
  { name: "Engineering", value: 25 },
  { name: "Business", value: 20 },
  { name: "Arts", value: 10 },
  { name: "Medicine", value: 10 }
];

const GROWTH_DATA = [
  { month: "Jan", followers: 120 },
  { month: "Feb", followers: 150 },
  { month: "Mar", followers: 200 },
  { month: "Apr", followers: 230 },
  { month: "May", followers: 280 },
  { month: "Jun", followers: 320 }
];

const ENGAGEMENT_DATA = [
  { activity: "Web Dev Workshop", attendance: 28, capacity: 30, satisfaction: 4.5 },
  { activity: "AI Ethics Talk", attendance: 65, capacity: 100, satisfaction: 4.2 },
  { activity: "Mobile App Dev", attendance: 25, capacity: 25, satisfaction: 4.8 },
  { activity: "Cybersecurity Seminar", attendance: 42, capacity: 50, satisfaction: 4.3 },
  { activity: "Data Science Bootcamp", attendance: 20, capacity: 20, satisfaction: 4.7 }
];

function SaReports() {
  const [timeRange, setTimeRange] = useState("6months");
  const [reportType, setReportType] = useState("activities");

  // Function to render the Activities Chart
  const renderActivitiesChart = () => {
    return (
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Activities by Month</h3>
        <div className="h-64 w-full">
          {/* This would be a real chart in a production app */}
          <div className="h-full flex items-end justify-between">
            {ACTIVITIES_DATA.map((data, index) => (
              <div key={index} className="flex flex-col items-center w-1/6">
                <div className="flex items-end h-48 space-x-1">
                  <div 
                    className="w-3 bg-blue-500 rounded-t-sm" 
                    style={{ height: `${data.workshops * 8}px` }}
                    title={`Workshops: ${data.workshops}`}
                  ></div>
                  <div 
                    className="w-3 bg-green-500 rounded-t-sm" 
                    style={{ height: `${data.talks * 8}px` }}
                    title={`Talks: ${data.talks}`}
                  ></div>
                  <div 
                    className="w-3 bg-purple-500 rounded-t-sm" 
                    style={{ height: `${data.seminars * 8}px` }}
                    title={`Seminars: ${data.seminars}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-300">Workshops</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-300">Talks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-300">Seminars</span>
          </div>
        </div>
      </div>
    );
  };

  // Function to render the Attendance Chart
  const renderAttendanceChart = () => {
    const total = ATTENDANCE_DATA.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    return (
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Attendance by Department</h3>
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {ATTENDANCE_DATA.map((item, index) => {
                const angle = (item.value / total) * 360;
                const endAngle = startAngle + angle;
                
                // Calculate the path for the pie slice
                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = `
                  M 50 50
                  L ${x1} ${y1}
                  A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                  Z
                `;
                
                const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
                
                const result = (
                  <path
                    key={index}
                    d={pathData}
                    fill={colors[index % colors.length]}
                  />
                );
                
                startAngle = endAngle;
                return result;
              })}
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {ATTENDANCE_DATA.map((item, index) => {
            const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
            return (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-sm mr-2" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-xs text-gray-300">{item.name} ({item.value}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Function to render the Growth Chart
  const renderGrowthChart = () => {
    const maxFollowers = Math.max(...GROWTH_DATA.map(item => item.followers));
    
    return (
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Follower Growth</h3>
        <div className="h-64 w-full relative">
          <div className="absolute inset-0 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 600 240">
              {/* Line Chart */}
              <polyline
                points={GROWTH_DATA.map((item, index) => 
                  `${index * 100 + 50},${240 - (item.followers / maxFollowers) * 200}`
                ).join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
              />
              
              {/* Data Points */}
              {GROWTH_DATA.map((item, index) => (
                <circle
                  key={index}
                  cx={index * 100 + 50}
                  cy={240 - (item.followers / maxFollowers) * 200}
                  r="5"
                  fill="#3B82F6"
                />
              ))}
              
              {/* X-Axis Labels */}
              {GROWTH_DATA.map((item, index) => (
                <text
                  key={index}
                  x={index * 100 + 50}
                  y="235"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#9CA3AF"
                >
                  {item.month}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // Function to render the Engagement Table
  const renderEngagementTable = () => {
    return (
      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-600">
          <h3 className="text-lg font-medium text-white">Activity Engagement</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Fill Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Satisfaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {ENGAGEMENT_DATA.map((item, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.activity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.attendance} / {item.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(item.attendance / item.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {Math.round((item.attendance / item.capacity) * 100)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg 
                            key={star} 
                            className={`w-4 h-4 ${star <= Math.floor(item.satisfaction) ? 'text-yellow-400' : 'text-gray-500'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-300">{item.satisfaction.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Reports & Analytics</h1>
        <div className="flex space-x-3">
          <select
            className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReportType("activities")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              reportType === "activities"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <BarChart2 size={18} className="mr-2" />
            Activities
          </button>
          <button
            onClick={() => setReportType("attendance")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              reportType === "attendance"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <PieChart size={18} className="mr-2" />
            Attendance
          </button>
          <button
            onClick={() => setReportType("growth")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              reportType === "growth"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <LineChart size={18} className="mr-2" />
            Growth
          </button>
          <button
            onClick={() => setReportType("engagement")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              reportType === "engagement"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <FileText size={18} className="mr-2" />
            Engagement
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportType === "activities" && (
          <>
            {renderActivitiesChart()}
            {renderEngagementTable()}
          </>
        )}
        
        {reportType === "attendance" && (
          <>
            {renderAttendanceChart()}
            {renderEngagementTable()}
          </>
        )}
        
        {reportType === "growth" && (
          <>
            {renderGrowthChart()}
            {renderAttendanceChart()}
          </>
        )}
        
        {reportType === "engagement" && (
          <>
            {renderEngagementTable()}
            {renderActivitiesChart()}
          </>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Activities</p>
              <h3 className="text-2xl font-bold text-white">24</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Calendar size={20} className="text-blue-400" />
            </div>
          </div>
          <p className="text-green-400 text-xs mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            12% increase
          </p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Followers</p>
              <h3 className="text-2xl font-bold text-white">320</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <Users size={20} className="text-green-400" />
            </div>
          </div>
          <p className="text-green-400 text-xs mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            14.3% increase
          </p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Attendance</p>
              <h3 className="text-2xl font-bold text-white">85%</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Users size={20} className="text-purple-400" />
            </div>
          </div>
          <p className="text-green-400 text-xs mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            5.2% increase
          </p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Satisfaction</p>
              <h3 className="text-2xl font-bold text-white">4.5/5</h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p className="text-green-400 text-xs mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            0.3 increase
          </p>
        </div>
      </div>
    </div>
  );
}

export default SaReports;
