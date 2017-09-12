//snake.js
  // 手指开始位置
  var startX = 0;
  var startY = 0;
  // 手指移动路径
  var moveX = 0;
  var moveY = 0;
  // 差值
  var diffX = 0;
  var diffY = 0;
  var snakeW = 10;
  var snakeH = 10;
  var context = null;
  // 蛇头
  var snakeHead = {
    color: "#0000ff",
    x: 0,
    y: 0,
    w: snakeW,
    h: snakeH
  };
  // 蛇身 数组 
  var snakeBodys = [];
  // 窗口宽/高
  var windowW = 0;
  var windowH = 0;
  // 食物
  var foods = [];
  // 蛇头移动方向
  var snakeMoveDirection = "right";
  // 总得分(吃到的食物大小-宽度的总和)
  var score = 0;
  // 蛇身总长(每得perSocre分 +1)
  var snakeLength = 0;
  // 是否变长/即移除蛇身 (每得perSocre分 变长-蛇身+1)
  var shouldRemoveBody = true;
  // (每得perSocre分 变长-蛇身+1)
  var perSocre = 5;
  // 得了count个perSocre分 
  var count = 1;
  // 蛇移动的速度(帧频率-----越大越慢)
  var defaultSpeedLevel = 10;
  var moveSpeedLevel = defaultSpeedLevel;
  //   减慢动画
  var perform = 0;
  // 吃到食物的次数
  var eatFoodCount= 0;
  // 每 speederPerFood 次吃到食物加速
  var speederPerFood = 2;
  Page({
    touchStart: function (e) {
      startX = e.touches[0].x;
      startY = e.touches[0].y;
    },
    touchMove: function (e) {
      //   console.log("开始拖动手指"); 
      moveX = e.touches[0].x;
      moveY = e.touches[0].y;
      diffX = moveX - startX;
      diffY = moveY - startY;
      if (Math.abs(diffX) > Math.abs(diffY) && diffX > 0 && !(snakeMoveDirection == "left")) {
        //  向右
        snakeMoveDirection = "right";
        //   console.log("向右"); 
      } else if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0 && !(snakeMoveDirection == "right")) {
        //  向左
        snakeMoveDirection = "left";
        //   console.log("向左");
      } else if (Math.abs(diffX) < Math.abs(diffY) && diffY > 0 && !(snakeMoveDirection == "top")) {
        //  向下
        snakeMoveDirection = "bottom";
        //   console.log("向下");
      } else if (Math.abs(diffX) < Math.abs(diffY) && diffY < 0 && !(snakeMoveDirection == "bottom")) {
        //  向上
        snakeMoveDirection = "top";
        //   console.log("向上");
      }
    },
    onReady: function (e) {
      // (A,B)中随机一个数 
      function randomAB(A, B) {
        return parseInt(Math.random() * (B - A) + A);
      }
      // 食物构造方法
      function Food() {
        this.color = "rgb(" + randomAB(0, 255) + "," + randomAB(0, 255) + "," + randomAB(0, 255) + ")";
        this.x = randomAB(0, windowW);
        this.y = randomAB(0, windowH);
        var w = randomAB(10, 20);
        this.w = w;
        this.h = w;
        // 重置位置
        this.reset = function () {
          this.color = "rgb(" + randomAB(0, 255) + "," + randomAB(0, 255) + "," + randomAB(0, 255) + ")";
          this.x = randomAB(0, windowW);
          this.y = randomAB(0, windowH);
          var w = randomAB(10, 20);
          this.w = w;
          this.h = w;
        }
      }
      // 吃到食物函数
      function eatFood(snakeHead, food) {
        var sL = snakeHead.x;
        var sR = sL + snakeHead.w;
        var sT = snakeHead.y;
        var sB = sT + snakeHead.h;

        var fL = food.x;
        var fR = fL + food.w;
        var fT = food.y;
        var fB = fT + food.h;

        if (sR > fL && sB > fT && sL < fR && sT < fB && sL < fR) {
          return true;
        } else {
          return false;
        }
      }
      // 初始化游戏环境
      function initGame() {
        snakeHead.x = 0;
        snakeHead.y = 0;
        snakeBodys.splice(0, snakeBodys.length);//清空数组 
        snakeMoveDirection = "right";
        // 上下文
        context = wx.createContext();
        foods.splice(0, foods.length);

        score = 0;
        count = 1;
        moveSpeedLevel = defaultSpeedLevel;  // 恢复默认帧频率
        perform = 0;
        eatFoodCount = 0;
        // 创建食物 20个
        for (var i = 0; i < 20; i++) {
          var food = new Food();
          foods.push(food);
        }
      }
      function beginGame() {
        // 初始化游戏环境
        initGame();
        function drawObj(obj) {
          context.setFillStyle(obj.color);
          context.beginPath();
          context.rect(obj.x, obj.y, obj.w, obj.h);
          context.closePath();
          context.fill();
        }
        function beginDraw() {
          // 绘制食物 20个
          for (var i = 0; i < foods.length; i++) {
            var food = foods[i];
            drawObj(food);
            // 吃食物
            if (eatFood(snakeHead, food)) {
              // 食物重置
              food.reset();
              wx.showToast({
                title: "+" + food.w + "分",
                icon: 'succes',
                duration: 500
              })
              score += food.w;
              // 吃到食物的次数
              eatFoodCount++
              if (eatFoodCount % speederPerFood == 0) {
                // 每吃到speederPerFood次食物 蛇移动速度变快               
                moveSpeedLevel -= 1;
                if (moveSpeedLevel <= 2) {
                  moveSpeedLevel = 2;
                }
              }
            }
          }
          if (++perform % moveSpeedLevel == 0) {
            // 添加蛇身
            snakeBodys.push({
              color: "#00ff00",
              x: snakeHead.x,
              y: snakeHead.y,
              w: snakeW,
              h: snakeH
            });
            // 移除蛇身
            if (snakeBodys.length > 5) {
              if (score / perSocre >= count) { // 得分
                count++;
                shouldRemoveBody = false;
              }
              if (shouldRemoveBody) {

                snakeBodys.shift();
              }
              shouldRemoveBody = true;
            }
            switch (snakeMoveDirection) {
              case "left":
                snakeHead.x -= snakeHead.w;
                break;
              case "right":
                snakeHead.x += snakeHead.w;
                break;
              case "top":
                snakeHead.y -= snakeHead.h;
                break;
              case "bottom":
                snakeHead.y += snakeHead.h;
                break;
            }
            // 游戏失败
            if (snakeHead.x > windowW || snakeHead.x < 0 || snakeHead.y > windowH || snakeHead.y < 0) {
              // console.log("游戏结束");
              wx.showModal({
                title: "消耗pm2.5(总得分):" + score + "μg/m3**肺里被污染的面积是（蛇身总长）:" + snakeBodys.length + "",
                content: '游戏失败, 是否重新开始',
                success: function (res) {
                  console.log(res)
                  if (res.confirm) {
                    // console.log('用户点击确定')
                    beginGame();

                  } else {
                    initGame();
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
              return;
            }
       }
          // 绘制蛇头
          drawObj(snakeHead);
          // 绘制蛇身体
          for (var i = 0; i < snakeBodys.length; i++) {
            var snakeBody = snakeBodys[i];
            drawObj(snakeBody);
          }
          // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
          wx.drawCanvas({
            canvasId: 'snakeCanvas',
            actions: context.getActions() // 获取绘图动作数组
          });
          // 循环执行动画绘制
          requestAnimationFrame(beginDraw);
        }
        beginDraw();
      }
      wx.getSystemInfo({
        success: function (res) {
          // console.log(res.windowWidth);
          // console.log(res.windowHeight);
          windowW = res.windowWidth;
          windowH = res.windowHeight;
        }
      })
      wx.showModal({
        title: '开始游戏',
        content: "每消耗" + perSocre + "μg/m3,蛇身增长1 ",
        success: function (res) {
          if (res.confirm) {
            beginGame();
          } else {
            initGame();
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });
    }
  })