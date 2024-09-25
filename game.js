const canvas = wx.createCanvas();  // 创建 Canvas
const context = canvas.getContext('2d');  // 获取 Canvas 的绘制上下文

let score = 0;  // 当前玩家的得分
let currentRound = 1;  // 当前游戏的轮数
const totalRounds = 6;  // 游戏的总轮数
const yOffset = 113;  // 向下偏移量，大约为3cm
const buttonOffset = 189;  // 向下移动按钮5cm，大约189像素
let gameOver = false;  // 游戏是否结束的标志
let gameStarted = false;  // 游戏是否已经开始

// 定义两个转盘
const wheelA = {
  probability: 90,  // 90% 概率获得 5 分
  reward: 5,
  penalty: 0,
  riskProbability: 10  // 10% 概率获得 0 分
};

const wheelB = {
  probability: 50,  // 50% 概率获得 20 分
  reward: 20,
  penalty: -10,     // 50% 概率失去 10 分
  riskProbability: 50
};

// 加载背景图片
const background = wx.createImage();
background.src = "assets/wallpaper.png";  // 确保将图片放在assets目录下

// 在图片加载完成后，使用背景图绘制
background.onload = () => {
  showHomePage();  // 图片加载完成后显示首页
};

// 绘制背景图片函数
function drawBackground() {
  context.clearRect(0, 0, canvas.width, canvas.height);  // 清空 Canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);  // 绘制背景图片
}

// 显示首页，带有背景图片、"幸运转盘"字样和“开始游戏”按钮
function showHomePage() {
  drawBackground();  // 绘制背景

  // 插入“幸运转盘”字样
  context.fillStyle = "#FFFFFF";  // 文字颜色，白色
  context.font = "40px Arial";  // 字体大小和字体类型
  context.textAlign = "center";  // 设置文字居中对齐
  context.fillText("幸运转盘", canvas.width / 2, 150);  // 将文字放在屏幕中央位置

  // 重置 textAlign 为默认值（left）
  context.textAlign = "left";

  // 绘制“开始游戏”按钮
  context.fillStyle = "#FF9800";  // 按钮颜色
  context.fillRect(100, 300 + yOffset + buttonOffset, 200, 50);  // 向下平移5cm
  context.fillStyle = "#FFFFFF";
  context.font = "20px Arial";
  context.fillText("开始游戏", 160, 330 + yOffset + buttonOffset);  // 按钮文字
}

// 初始化游戏
function initGame() {
  score = 0;  // 重置得分
  currentRound = 1;  // 重置回合数
  gameOver = false;  // 重置游戏状态
  gameStarted = true;  // 标记游戏已经开始
  console.log("游戏初始化完成");
  drawGameBoard();  // 绘制游戏界面
}

// 绘制游戏界面，显示两个转盘
function drawGameBoard() {
  drawBackground();  // 绘制背景
  context.font = "20px Arial";
  context.fillStyle = "#FFFFFF";
  context.fillText(`当前得分: ${score}`, 10, 30 + yOffset);  // 向下偏移
  context.fillText(`当前回合: ${currentRound}/${totalRounds}`, 10, 60 + yOffset);  // 向下偏移

  // 绘制转盘A
  context.fillStyle = "#FF0000";  // 红色
  context.beginPath();
  context.arc(100, 200 + yOffset, 80, 0, Math.PI * 2);  // 向下偏移
  context.fill();
  context.fillStyle = "#FFFFFF";
  context.fillText("转盘A", 70, 200 + yOffset);  // 向下偏移

  // 绘制转盘B
  context.fillStyle = "#00FF00";  // 绿色
  context.beginPath();
  context.arc(300, 200 + yOffset, 80, 0, Math.PI * 2);  // 向下偏移
  context.fill();
  context.fillStyle = "#FFFFFF";
  context.fillText("转盘B", 270, 200 + yOffset);  // 向下偏移
}

// 游戏结束，显示最终得分并添加“再来一局”按钮
function endGame() {
  gameOver = true;  // 标记游戏结束
  drawBackground();  // 绘制背景
  context.fillStyle = "#FFFFFF";
  context.font = "30px Arial";
  context.fillText(`游戏结束！总得分: ${score}`, 50, 200 + yOffset);

  // 绘制“再来一局”按钮
  context.fillStyle = "#FF9800";  // 按钮颜色
  context.fillRect(100, 300 + yOffset, 200, 50);  // 按钮大小和位置
  context.fillStyle = "#FFFFFF";
  context.font = "20px Arial";
  context.fillText("再来一局", 160, 330 + yOffset);  // 按钮文字
}

// 处理玩家选择转盘A或转盘B
function chooseWheel(wheel) {
  const randomValue = Math.random() * 100;
  let result;

  if (randomValue < wheel.probability) {
    result = wheel.reward;
  } else {
    result = wheel.penalty;
  }

  score += result;

  // 如果是第六轮，更新得分并冻结1秒后结束游戏
  if (currentRound === totalRounds) {
    console.log(`最后一轮得分: ${result}，冻结画面1秒`);
    
    // 在冻结之前先更新得分显示
    drawGameBoard();  // 显示当前得分和转盘
    gameOver = true;  // 标记游戏结束，禁止再点击操作

    setTimeout(() => {  // 冻结1秒后结束游戏
      endGame();
    }, 1000);
  } else {
    // 不是最后一轮，递增回合数
    currentRound++;
    drawGameBoard();
    console.log(`本轮得分: ${result}，当前总分: ${score}`);
  }
}


// 监听触屏事件来选择转盘或点击按钮
wx.onTouchStart((event) => {
  const x = event.touches[0].clientX;
  const y = event.touches[0].clientY;

  if (!gameStarted) {
    // 检查是否点击了“开始游戏”按钮
    if (x > 100 && x < 300 && y > (300 + yOffset + buttonOffset) && y < (350 + yOffset + buttonOffset)) {
      console.log("开始游戏");
      initGame();  // 进入游戏
    }
  } else if (!gameOver) {
    // 检查是否点击了转盘A
    if (x > 20 && x < 180 && y > (120 + yOffset) && y < (280 + yOffset)) {
      console.log("选择了转盘A");
      chooseWheel(wheelA);
    }

    // 检查是否点击了转盘B
    if (x > 220 && x < 380 && y > (120 + yOffset) && y < (280 + yOffset)) {
      console.log("选择了转盘B");
      chooseWheel(wheelB);
    }
  }

  // 检查是否点击了“再来一局”按钮
  if (gameOver && x > 100 && x < 300 && y > (300 + yOffset) && y < (350 + yOffset)) {
    console.log("再来一局");
    initGame();  // 重新开始游戏
  }
});
