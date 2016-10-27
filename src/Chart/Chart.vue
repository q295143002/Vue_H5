<template>
  <button @click ='ChartLine'>ChartLine</button>
  <button @click= 'ChartBar'>ChartBar</button>
  <button @click= 'ChartPie'>ChartPie</button>
  <chart :value.sync='Chart.value' :height.sync='Chart.height'></chart>
</template>
<script>
  import Chart from '../Public/Chart'
  export default {
    components: {
      Chart
    },
    data () {
      return {
        Chart: {
          value: {},
          height: '200'
        }
      }
    },
    methods: {
      ChartLine () {
        this.Chart.value = {
          type: 'line',
          data: {
            /* 横向文本 */
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
              label: 'My First dataset',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [65, 59, 80, 81, 56, 55, 40],
              spanGaps: false
            },
            {
              label: 'ooo',
              data: [28, 48, 40, 19, 96, 27, 100],
              fill: false
            }]
          },
          options: {
            responsiveAnimationDuration: 5000,
            tooltips: {
              enable: true
            },
            title: {
              display: true,
              text: 'Custom Chart Title'
            }
          }
        }
      },
      ChartBar () {
        this.Chart.value = {
          type: 'bar',
          data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        }
      },
      ChartPie () {
        this.Chart.value = {
          type: 'pie',
          data: {
            labels: [
              'Red',
              'Blue',
              'Yellow'
            ],
            datasets: [{
              data: [300, 50, 100],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
              ]
            }]
          },
          options: {
            animation: {
              animateScale: true
            }
          }
        }
      }
    }
  }
</script>