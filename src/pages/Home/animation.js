const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FONT_SIZE = 16;
const WIDTH = 1600 * 3;
const HEIGHT = 900 * 3;
const TEXT_COLOR = '#2dd4bf';

export class Matrix {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;

    this.ctx = this.canvas.getContext('2d');

    this.raindrops = [];
    // 각 열마다 시작 위치를 랜덤하게 설정
    for (let x = 0; x < WIDTH / FONT_SIZE; x++) {
      this.raindrops[x] = Math.floor((Math.random() * HEIGHT) / FONT_SIZE);
    }
  }

  draw = () => {
    // 흐린 효과를 위한 반투명 검은색 배경
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

    this.ctx.fillStyle = TEXT_COLOR;
    this.ctx.font = `${FONT_SIZE}px monospace`;

    for (let i = 0; i < this.raindrops.length; i++) {
      // 랜덤 문자 선택
      const text = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));

      // 첫 번째 문자는 더 밝게 표시
      if (this.raindrops[i] * FONT_SIZE < FONT_SIZE) {
        this.ctx.fillStyle = '#fff';
      } else {
        this.ctx.fillStyle = TEXT_COLOR;
      }

      this.ctx.fillText(text, i * FONT_SIZE, this.raindrops[i] * FONT_SIZE);

      // 화면 아래에 도달하면 다시 위로
      if (this.raindrops[i] * FONT_SIZE > HEIGHT && Math.random() > 0.975) {
        this.raindrops[i] = 0;
      }
      this.raindrops[i]++;
    }
  };

  animate() {
    return setInterval(this.draw, 30);
  }
}
