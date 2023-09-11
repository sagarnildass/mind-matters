import React from 'react';
import ApexCharts from 'react-apexcharts';

const SingleEmotionChart = ({ emotionData, emotionName, chartHeight = "100", color = '#FF5733' }) => {
    const options = {
        chart: {
            id: 'area-chart',
            type: 'area',
            height: 350,
            toolbar: {
                show: true,
            }
        },
        colors: [color],
        legend: {
            show: false
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
        <div className="rounded-3xl border border-gray-800 shadow-lg w-200 mt-1 mb-1 p-4">
            <h3 className="text-sm font-bold mb-2 text-white">{emotionName}</h3>
            <ApexCharts
                options={options}
                series={[{
                    name: emotionName,
                    data: emotionData
                }]}
                type="area"
                height={chartHeight}// Increase the height to make the chart larger
            />
        </div>
    );
};

export default SingleEmotionChart;