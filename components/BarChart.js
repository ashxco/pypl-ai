// Simplified BarChart component based on Tremor
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { constructCategoryColors, getColorClassName } from '../lib/chartUtils';

const BarChart = ({
  data = [],
  index,
  categories = [],
  colors = ['blue', 'emerald', 'violet'],
  valueFormatter,
  className = '',
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  showTooltip = true,
  height = 200,
  startEndOnly = false,
  yAxisDomain,
}) => {
  const categoryColors = constructCategoryColors(categories, colors);

  const defaultValueFormatter = (value) => {
    if (valueFormatter) {
      return valueFormatter(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const yAxisFormatter = (value) => {
    // Check if this is percentage data (Auth Rate) by checking if yAxisDomain is set
    if (yAxisDomain) {
      return `${value}%`;
    }
    // Default currency formatting for other charts
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const entry = payload[0];
      
      // Check if this is sales data with channels
      const hasSalesChannels = data.shopify !== undefined;
      
      // Check if this is conversion data with user types
      const hasUserTypes = data.paypalUser !== undefined && data.guestUser !== undefined;
      
      // Check if this is AOV data with payment methods
      const hasPaymentMethods = data.paypal !== undefined && data.paypalCredit !== undefined && data.creditDebit !== undefined;
      
      if (hasSalesChannels) {
        const channelColors = {
          shopify: '#00C853',
          storeA: '#FF6D00',
          invoicing: '#00BCD4',
          other: '#9C27B0'
        };
        
        const channelNames = {
          shopify: 'Shopify',
          storeA: 'Store A',
          invoicing: 'Invoicing',
          other: 'Other'
        };
        
        return (
          <div 
            className="border border-gray-200" 
            style={{ 
              backgroundColor: 'white',
              padding: '1px 16px 12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '12px',
              borderRadius: '12px'
            }}
          >
            <p className="font-medium mb-1" style={{ fontSize: '12px', lineHeight: '1.2', color: '#9ca3af' }}>
              {label}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginTop: '-10px',
              whiteSpace: 'nowrap'
            }}>
              <div 
                style={{ 
                  backgroundColor: '#0066F5',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: '13px', color: '#000000', lineHeight: '1.2', fontWeight: '500' }}>
                Overall: <span style={{ fontWeight: '700' }}>{defaultValueFormatter(data.revenue)}</span>
              </span>
            </div>
            {Object.entries(channelColors).map(([key, color]) => (
              <div key={key} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginTop: '3px',
                whiteSpace: 'nowrap'
              }}>
                <div 
                  style={{ 
                    backgroundColor: color,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '13px', color: '#000000', lineHeight: '1.2', fontWeight: '500' }}>
                  {channelNames[key]}: <span style={{ fontWeight: '700' }}>{defaultValueFormatter(data[key])}</span>
                </span>
              </div>
            ))}
          </div>
        );
      } else if (hasUserTypes) {
        // Tooltip for PayPal Checkout Conversion Rate with user types
        return (
          <div 
            className="border border-gray-200" 
            style={{ 
              backgroundColor: 'white',
              padding: '1px 16px 12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '12px',
              borderRadius: '12px'
            }}
          >
            <p className="font-medium mb-1" style={{ fontSize: '12px', lineHeight: '1.2', color: '#9ca3af' }}>
              {label}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginTop: '-10px',
              whiteSpace: 'nowrap'
            }}>
              <div 
                style={{ 
                  backgroundColor: '#8b5cf6',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: '13px', color: '#000000', lineHeight: '1.2', fontWeight: '500' }}>
                PayPal User: {data.paypalUser.toFixed(2)}%
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginTop: '3px',
              whiteSpace: 'nowrap'
            }}>
              <div 
                style={{ 
                  backgroundColor: '#6366f1',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: '11px', color: '#666', lineHeight: '1.2', fontWeight: '400' }}>
                Guest User: {data.guestUser.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      } else if (hasPaymentMethods) {
        // Tooltip for AOV data with payment methods
        const paymentColors = {
          paypal: '#1e40af',
          paypalCredit: '#0066F5',
          creditDebit: '#06b6d4'
        };
        
        const paymentNames = {
          paypal: 'PayPal',
          paypalCredit: 'PayPal Credit',
          creditDebit: 'Credit and Debit Cards'
        };
        
        return (
          <div 
            className="border border-gray-200" 
            style={{ 
              backgroundColor: 'white',
              padding: '1px 16px 12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '12px',
              borderRadius: '12px'
            }}
          >
            <p className="font-medium mb-1" style={{ fontSize: '12px', lineHeight: '1.2', color: '#9ca3af' }}>
              {label}
            </p>
            {Object.entries(paymentColors).map(([key, color]) => (
              <div key={key} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginTop: key === 'paypal' ? '-10px' : '3px',
                whiteSpace: 'nowrap'
              }}>
                <div 
                  style={{ 
                    backgroundColor: color,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '13px', color: '#000000', lineHeight: '1.2', fontWeight: '500' }}>
                  {paymentNames[key]}: <span style={{ fontWeight: '700' }}>${data[key].toFixed(2)}</span>
                </span>
              </div>
            ))}
          </div>
        );
      } else {
        // Simple tooltip for other single metrics
        const metricName = entry.dataKey === 'aov' ? 'AOV' : 
                          entry.dataKey === 'conversion' ? 'Conversion Rate' : 
                          entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1);
        
        return (
          <div 
            className="border border-gray-200" 
            style={{ 
              backgroundColor: 'white',
              padding: '1px 16px 12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '12px',
              borderRadius: '12px'
            }}
          >
            <p className="font-medium mb-1" style={{ fontSize: '12px', lineHeight: '1.2', color: '#9ca3af' }}>
              {label}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginTop: '-10px',
              whiteSpace: 'nowrap'
            }}>
              <div 
                style={{ 
                  backgroundColor: entry.color,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: '13px', color: '#000000', lineHeight: '1.2', fontWeight: '500' }}>
                {metricName}: <span style={{ fontWeight: '700' }}>{entry.dataKey === 'aov' ? `$${entry.value.toFixed(2)}` : 
                              entry.dataKey === 'conversion' ? `${entry.value.toFixed(2)}%` :
                              defaultValueFormatter(entry.value)}</span>
              </span>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const getBarColor = (category) => {
    const color = categoryColors.get(category);
    
    // Check if color is already a hex code
    if (color && color.startsWith('#')) {
      return color;
    }
    
    const colorMap = {
      blue: '#0066F5',
      navy: '#1e40af',
      emerald: '#10b981', 
      violet: '#8b5cf6',
      indigo: '#6366f1',
      purple: '#9333ea',
      amber: '#f59e0b',
      gray: '#6b7280',
      cyan: '#06b6d4',
      pink: '#ec4899',
      lime: '#84cc16',
      fuchsia: '#d946ef',
    };
    return colorMap[color] || '#0066F5';
  };

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <style jsx global>{`
        .recharts-tooltip-wrapper {
          transition: opacity 0.2s ease !important;
        }
        .recharts-tooltip-wrapper .recharts-default-tooltip {
          animation: none !important;
          transition: none !important;
        }
      `}</style>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 15, right: 5, left: -15, bottom: -15 }}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
          {showXAxis && (
            <XAxis 
              dataKey={index}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
              axisLine={{ stroke: '#e5e7eb' }}
              height={40}
              padding={{ left: 5 }}
              ticks={startEndOnly && data.length > 0 ? [
                data[0][index], 
                data[data.length - 1][index]
              ] : undefined}
            />
          )}
          {showYAxis && (
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={yAxisFormatter}
              domain={yAxisDomain || ['auto', 'auto']}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f7fa' }} />}
          {categories.map((category, index) => (
            <Bar 
              key={category}
              dataKey={category}
              stackId={yAxisDomain ? undefined : "stack"}
              fill={getBarColor(category)}
              radius={yAxisDomain ? [2, 2, 2, 2] : (index === categories.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0])}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart; 