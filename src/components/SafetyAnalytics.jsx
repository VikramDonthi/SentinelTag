import React, { useState, useEffect, useMemo } from 'react';
import { getAllIncidents } from '../utils/firebase';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { BarChart3, TrendingUp, AlertCircle, Battery, ShieldAlert, History } from 'lucide-react';

const SafetyAnalytics = () => {
  const [rawIncidents, setRawIncidents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllIncidents();
      setRawIncidents(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Process data for charts
  const stats = useMemo(() => {
    if (!rawIncidents) return null;

    const allIncidents = [];
    // rawIncidents is { "dateStr": { "id": data, ... }, ... }
    Object.entries(rawIncidents).forEach(([date, dayIncidents]) => {
      Object.entries(dayIncidents).forEach(([id, incident]) => {
        allIncidents.push({ ...incident, date });
      });
    });

    // 1. Frequency (Alerts per Date)
    const frequencyMap = {};
    allIncidents.forEach(inc => {
      frequencyMap[inc.date] = (frequencyMap[inc.date] || 0) + 1;
    });
    const frequencyData = Object.entries(frequencyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date.split('-').reverse().join('-')) - new Date(b.date.split('-').reverse().join('-')));

    // 2. Type Distribution
    const typeMap = {};
    allIncidents.forEach(inc => {
      const type = inc.status.replace(/_/g, ' ');
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

    // 3. Battery at Trigger
    const batteryMap = { '0-20%': 0, '21-40%': 0, '41-60%': 0, '61-80%': 0, '81-100%': 0 };
    let validBatterySum = 0;
    let validBatteryCount = 0;

    allIncidents.forEach(inc => {
      const bat = parseInt(inc.battery);
      if (!isNaN(bat)) {
        validBatterySum += bat;
        validBatteryCount++;

        if (bat <= 20) batteryMap['0-20%']++;
        else if (bat <= 40) batteryMap['21-40%']++;
        else if (bat <= 60) batteryMap['41-60%']++;
        else if (bat <= 80) batteryMap['61-80%']++;
        else batteryMap['81-100%']++;
      }
    });
    const batteryData = Object.entries(batteryMap).map(([range, count]) => ({ range, count }));

    // KPIs
    const mostCommonType = typeData.reduce((prev, current) => (prev.value > current.value) ? prev : current, { name: 'N/A' }).name;
    const avgBattery = validBatteryCount > 0 ? Math.round(validBatterySum / validBatteryCount) : 0;

    return {
      allIncidents,
      frequencyData,
      typeData,
      batteryData,
      mostCommonType,
      avgBattery,
      total: allIncidents.length
    };
  }, [rawIncidents]);

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <div className="card">Analyzing historical data...</div>
    </div>
  );

  if (!stats || stats.total === 0) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <div className="card">No incident data available for analysis.</div>
    </div>
  );

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <History size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Alerts</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Most Frequent</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{stats.mostCommonType}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Battery size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Avg. Battery (At Alert)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.avgBattery}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><TrendingUp size={20} /> Alert Frequency Trend</h2>
        </div>
        <div style={{ height: '350px', marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.frequencyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#3b82f6' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><ShieldAlert size={18} /> Alert Type Distribution</h3>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Battery size={18} /> Battery Distribution at Trigger</h3>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.batteryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                  contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAnalytics;
