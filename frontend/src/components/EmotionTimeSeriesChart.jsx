// EmotionTimeSeriesChart.js

import React from 'react';
import ApexCharts from 'react-apexcharts';
import moment from 'moment-timezone';

const EmotionTimeSeriesChart = ({ data }) => {
    // console.log(data);
    const chartData = prepareChartData(data);

    const options = {
        chart: {
            id: 'area-chart',
            type: 'area',
            height: 350,
            toolbar: {
                show: true,
            }
        },
        colors: [
            '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#A633FF', 
            '#FF8333', '#33FF83', '#8333FF', '#FF3383', '#83FF33'
            // ... Add more colors if you have more than 10 areas
        ],
        legend: {
            position: 'bottom',
            offsetY: 5, // Adjust this value to move the legend further down if needed
            labels: {
                colors: '#ffffff'
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#ffffff'
                }
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#ffffff'
                },
                formatter: function (val) {
                    return val.toFixed(2);
                }
            }
        },
        grid: {
            show: true,
            borderColor: '#90A4AE',
            strokeDashArray: 5,
            row: {
                colors: undefined,
                opacity: 0.2
            },
            column: {
                colors: undefined,
                opacity: 0.2
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 0.4,
                opacityFrom: 0.2,
                opacityTo: 0.7,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            y: {
                formatter: function (val) {
                    return val.toFixed(5)
                }
            }
        }
    };

    return (
        <div
            className="rounded-3xl border border-gray-800 shadow-lg p-6 mt-6 mb-6"
            style={{
                backgroundImage: 'linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)'
            }}
        >
            <h2 className="text-xl font-bold mb-4 text-white">Emotions Over Time</h2>
            <ApexCharts
                options={options}
                series={chartData}
                type="area"
                height="500"
            />
        </div>
    );
};

const computeRecentVariance = (data, windowSize = 3) => {
    if (data.length < windowSize) return 0;

    const recentData = data.slice(-windowSize);
    const mean = recentData.reduce((acc, val) => acc + val.y, 0) / windowSize;
    const variance = recentData.reduce((acc, val) => acc + Math.pow(val.y - mean, 2), 0) / windowSize;

    return variance;
};

const prepareChartData = (data) => {
    const emotions = {};

    data.forEach(item => {
        const adjustedTime = moment(item.timestamp).tz('Asia/Kolkata').valueOf(); // Convert to IST
        if (!emotions[item.sentiment_label]) {
            emotions[item.sentiment_label] = [];
        }
        emotions[item.sentiment_label].push({
            x: adjustedTime,
            y: item.sentiment_score
        });
    });

    // Compute recent variance for each emotion
    const emotionsWithVariance = Object.entries(emotions).map(([emotion, data]) => ({
        emotion,
        data,
        variance: computeRecentVariance(data)
    }));

    // Sort by variance and pick top 5
    const topEmotions = emotionsWithVariance.sort((a, b) => b.variance - a.variance).slice(0, 8);

    return topEmotions.map(({ emotion, data }) => ({
        name: emotion.replace(/\"/g, ''),
        data: data
    }));
};


export default EmotionTimeSeriesChart;
