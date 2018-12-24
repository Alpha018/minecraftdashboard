import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ServerService} from '../../services/serverService';
import {UserService} from '../../services/user.services';
import Chart from 'chart.js';
import {UtilsService} from '../../services/utils';

@Component({
    moduleId: module.id,
    selector: 'grid-cmp',
    templateUrl: 'infoSystem.component.html'
})

export class InfoSystemComponent implements OnInit {

    private status;
    private infoCPU;
    private ramTotal = '0 Bytes';
    private uptime = '0 horas, 0 minutos, 0 segundos';


    public canvas: any;
    public ctx;
    public myChart;

    public canvasCPU: any;
    public ctxCPU;
    public myChartCPU;

    private socket = this.serverService.getSocket();

    constructor(private _userService: UserService,
                private router: Router,
                private serverService: ServerService) {
    }

    ngOnInit(): void {
        this.generateChartData();

        this.socket.emit('get_status', {});
        this.socket.on('status', (data: any) => {
            if (data !== null) {
                this.status = 'Online';
            } else {
                this.status = 'Offline';
            }
        });

        this.socket.emit('get_system_type', {});
        this.socket.on('system_type', (data: any) => {
            this.infoCPU = data;
        });

        this.socket.on('system_usage', (data: any) => {
            this.ramTotal = UtilsService.formatSizeUnits(data.totalmem, 0);
            this.uptime = UtilsService.secondsToHms(data.uptime);

            this.changeData(data);
        });
    }

    clickInit() {
        this.socket.emit('start_server', {name: 'ServerMinecraft'});
    }

    clickClose() {
        this.socket.emit('close_server', {});
    }

    clickReboot() {
        this.socket.emit('restart_server', {name: 'ServerMinecraft'});
    }

    generateChartData() {
        Chart.pluginService.register({
            beforeDraw: function (chart) {
                if (chart.config.options.elements.center) {
                    // Get ctx from string
                    const ctx = chart.chart.ctx;

                    // Get options from the center object in options
                    const centerConfig = chart.config.options.elements.center;
                    const fontStyle = centerConfig.fontStyle || 'Arial';
                    const txt = centerConfig.text;
                    const color = centerConfig.color || '#000';
                    const sidePadding = centerConfig.sidePadding || 20;
                    const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
                    // Start with a base font of 30px
                    ctx.font = '30px ' + fontStyle;

                    // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    const stringWidth = ctx.measureText(txt).width;
                    const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                    // Find out how much the font can grow in width.
                    const widthRatio = elementWidth / stringWidth;
                    const newFontSize = Math.floor(30 * widthRatio);
                    const elementHeight = (chart.innerRadius * 2);

                    // Pick a new font size so it will not be larger than the height of label.
                    const fontSizeToUse = Math.min(newFontSize, elementHeight);

                    // Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse + 'px ' + fontStyle;
                    ctx.fillStyle = color;

                    // Draw text in center
                    ctx.fillText(txt, centerX, centerY);
                }
            }
        });

        this.canvas = document.getElementById('chartDonut1');
        this.ctx = this.canvas.getContext('2d');

        this.myChart = new Chart(this.ctx, {
            type: 'pie',
            data: {
                labels: ['Usado: 0%', 'Libre: 0%'],
                datasets: [{
                    label: 'Emails',
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    backgroundColor: ['#4acccd', '#f4f3ef'],
                    borderWidth: 0,
                    data: [0, 100]
                }]
            },
            options: {
                elements: {
                    center: {
                        text: '0%',
                        color: '#66615c', // Default is #000000
                        fontStyle: 'Arial', // Default is Arial
                        sidePadding: 60 // Defualt is 20 (as a percentage)
                    }
                },
                cutoutPercentage: 90,
                legend: {

                    display: true
                },

                tooltips: {
                    enabled: false
                },

                scales: {
                    yAxes: [{

                        ticks: {
                            display: false
                        },
                        gridLines: {
                            drawBorder: false,
                            zeroLineColor: 'transparent',
                            color: 'rgba(255,255,255,0.05)'
                        }

                    }],

                    xAxes: [{
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            color: 'rgba(255,255,255,0.1)',
                            zeroLineColor: 'transparent'
                        },
                        ticks: {
                            display: false,
                        }
                    }]
                },
            }
        });

        this.canvasCPU = document.getElementById('chartStock');
        this.ctxCPU = this.canvasCPU.getContext('2d');

        this.myChartCPU = new Chart(this.ctxCPU, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7'],
                datasets: [{
                    label: 'Active Users',
                    borderColor: '#f17e5d',
                    pointBackgroundColor: '#f17e5d',
                    pointRadius: 3,
                    pointHoverRadius: 3,
                    lineTension: 0,
                    fill: false,
                    borderWidth: 3,
                    data: [0, 0, 0, 0, 0, 0, 0]
                }]
            },
            options: {

                legend: {

                    display: false
                },

                tooltips: {
                    enabled: false
                },

                scales: {
                    yAxes: [{

                        ticks: {
                            fontColor: '#9f9f9f',
                            beginAtZero: false,
                            maxTicksLimit: 5,
                        },
                        gridLines: {
                            drawBorder: false,
                            borderDash: [8, 5],
                            zeroLineColor: 'transparent',
                            color: '#9f9f9f'
                        }

                    }],

                    xAxes: [{
                        barPercentage: 1.6,
                        gridLines: {
                            drawBorder: false,
                            borderDash: [8, 5],
                            color: '#9f9f9f',
                            zeroLineColor: 'transparent'
                        },
                        ticks: {
                            padding: 20,
                            fontColor: '#9f9f9f'
                        }
                    }]
                },
            }
        });
    }

    changeData(data) {
        this.myChart.data.labels.pop();
        this.myChart.data.labels.pop();
        this.myChart.data.labels.push(`Usado:${UtilsService.formatSizeUnits(data.totalmem - data.freemem, 2)}`);
        this.myChart.data.labels.push(`Libre:${UtilsService.formatSizeUnits(data.freemem, 2)}`);

        this.myChart.options.elements.center.text = `${Math.trunc(((data.totalmem - data.freemem) / data.totalmem) * 100)}%`;
        this.myChart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
            dataset.data.pop();
            dataset.data.push(Math.trunc(((data.totalmem - data.freemem) / data.totalmem) * 100));
            dataset.data.push(Math.trunc((data.freemem / data.totalmem) * 100));
        });
        this.myChart.update(0);

        this.myChartCPU.data.datasets.forEach((dataset) => {
            if (dataset.data.length > 7) {
                dataset.data.shift();
            }
            dataset.data.push(data.loadavg[2]);
        });
        this.myChartCPU.update(0);
    }
}
