//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    windowHeight: 0,
    selectIndex:1,
    onInitChart(F2, config) {
      const { Util, G } = F2;
      console.log('config', config)
      const chart = new F2.Chart(config);
      
      const data = [{
        type: '误报',
        percent: 83.59,
        a: '1'
      }, {
          type: '真实',
        percent: 2.17,
        a: '1'
      }];
      const map = {};
      data.forEach(function (obj) {
        map[obj.name] = obj.percent + '%';
      });
      let sum = 0;
      data.map(obj => {
        sum += obj.percent;
      });
      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val + '%';
          }
        }
      });
      let lastClickedShape;
      chart.legend({
        position: 'right',
        marker: 'square',
        align: 'left',
        itemMarginBottom: 20,
        onClick(ev) {
          const { clickedItem } = ev;
          const dataValue = clickedItem.get('dataValue');
          const canvas = chart.get('canvas');
          const coord = chart.get('coord');
          const geom = chart.get('geoms')[0];
          const container = geom.get('container');
          const shapes = geom.get('shapes'); // 只有带精细动画的 geom 才有 shapes 这个属性

          let clickedShape;
          // 找到被点击的 shape
          Util.each(shapes, shape => {
            const origin = shape.get('origin');
            if (origin && origin._origin.type === dataValue) {
              clickedShape = shape;
              return false;
            }
          });

          if (lastClickedShape) {
            lastClickedShape.animate().to({
              attrs: {
                lineWidth: 0
              },
              duration: 200
            }).onStart(() => {
              if (lastClickedShape.label) {
                lastClickedShape.label.hide();
              }
            }).onEnd(() => {
              lastClickedShape.set('selected', false);
            });
          }

          if (clickedShape.get('selected')) {
            clickedShape.animate().to({
              attrs: {
                lineWidth: 0
              },
              duration: 200
            }).onStart(() => {
              if (clickedShape.label) {
                clickedShape.label.hide();
              }
            }).onEnd(() => {
              clickedShape.set('selected', false);
            });
          } else {
            const color = clickedShape.attr('fill');
            clickedShape.animate().to({
              attrs: {
                lineWidth: 5
              },
              duration: 350,
              easing: 'bounceOut'
            }).onStart(() => {
              clickedShape.attr('stroke', color);
              clickedShape.set('zIndex', 1);
              container.sort();
            }).onEnd(() => {
              clickedShape.set('selected', true);
              clickedShape.set('zIndex', 0);
              container.sort();
              lastClickedShape = clickedShape;
              if (clickedShape.label) {
                clickedShape.label.show();
              } else {
                // drawLabel(clickedShape, coord, canvas);
              }
              canvas.draw();
            });
          }
        }
      });
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.7,
        radius: 0.5
      });
      chart.axis(false);
      chart.tooltip(false);
      chart.interval()
        .position('a*percent')
        .color('type', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
        .adjust('stack');

      chart.guide().text({
        position: ['50%', '46%'],
        content: sum.toFixed(2),
        style: {
          fontSize: 14,
          color: '#13C2C2'
        }
      });
      chart.guide().text({
        position: ['50%', '57%'],
        content: '告警',
        style: {
          fontSize: 14,
          color: '#13C2C2'
        }
      });
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
    },
  },
  changTab: function (e) {
    let index = e.currentTarget.dataset['index']
    this.setData({
      selectIndex:index
    })
  },
  onLoad: function() {
    // 算出比例
    let ratio = 750 / app.globalData.clientWidth;
    // 算出高度(单位rpx)
    let height = app.globalData.clientHeight * ratio;
    let navigationBarHeight = app.globalData.navHeight * ratio
    this.setData({
      windowHeight: height - navigationBarHeight
    })
  },
  
})