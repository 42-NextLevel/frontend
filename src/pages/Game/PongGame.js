import * as THREE from 'three';

const LERP_FACTOR = {
  ball: 0.3,
  paddle: 0.5,
};

const PADDLE_SPEED = 0.2; // Paddle movement speed

export class PongGame {
  websocket = null;
  keys = { left: false, right: false };

  constructor(
    { elementId, roomId, matchType, intraId, nickname },
    setScore,
    navigate,
  ) {
    this.roomId = roomId;
    this.navigate = (path, options) => {
      this.dispose();
      document.getElementById(elementId).removeChild(this.renderer.domElement);
      navigate(path, options);
    };
    this.objects = {
      ball: null,
      playerPaddle: null,
      opponentPaddle: null,
      table: null,
      countdownText: null,
      winnerText: null,
    };

    this.textObjects = {
      countdown: null,
      winner: null,
    };

    this.inputSequence = 0;
    this.isStarted = false;
    this.playerNumber = '';
    this.states = {
      ball: {
        position: { x: 0, y: 0.2, z: 0 },
        velocity: { x: 5, y: 0, z: 5 },
        timestamp: 0,
      },
      paddle: {
        players: {
          player1: { position: { x: 0, z: 7 } },
          player2: { position: { x: 0, z: -7 } },
        },
        lastProcessedInput: { player1: 0, player2: 0 },
        timestamp: 0,
      },
      score: { player1: 0, player2: 0 },
    };

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(WIDTH, HEIGHT);
    document.getElementById(elementId).appendChild(this.renderer.domElement);

    this.createGameObjects();
    this.setupLights();
    this.setupTextSprites();

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('resize', this.onWindowResize);
    this.initWebSocket(
      `${import.meta.env.VITE_ROOM_WEBSOCKET_URI}/game/${roomId}_${matchType}?nickname=${nickname}&intraId=${intraId}`,
    );

    this.camera.position.set(0, 7, 10);
    this.camera.lookAt(0, 0, 0);
    this.updateScore = setScore;

    this.processInput();
  }

  onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') this.keys.left = true;
    if (event.key === 'ArrowRight') this.keys.right = true;
  };

  onKeyUp = (event) => {
    if (event.key === 'ArrowLeft') this.keys.left = false;
    if (event.key === 'ArrowRight') this.keys.right = false;
  };

  processInput = () => {
    if (
      this.isStarted &&
      this.playerNumber &&
      this.websocket?.readyState === WebSocket.OPEN
    ) {
      let currentX = this.states.paddle.players[this.playerNumber].position.x;

      if (this.keys.left) currentX -= PADDLE_SPEED;
      if (this.keys.right) currentX += PADDLE_SPEED;

      // Clamp paddle position to table bounds (-4 to 4)
      currentX = Math.max(-4, Math.min(4, currentX));

      // 위치값 반올림 (소수점 3자리)
      currentX = Math.round(currentX * 1000) / 1000;
      const lastPosition =
        Math.round(
          this.states.paddle.players[this.playerNumber].position.x * 1000,
        ) / 1000;

      // 의미있는 위치 변화가 있는 경우만 업데이트
      if (Math.abs(currentX - lastPosition) >= 0.001) {
        const input = {
          inputSequence: this.inputSequence++,
          pressTime: Date.now(),
          x: currentX,
        };

        this.states.paddle.players[this.playerNumber].position.x = input.x;

        const update = {
          type: 'client_state_update',
          player: this.playerNumber,
          position: { x: input.x },
          input_sequence: input.inputSequence,
          timestamp: Date.now(),
        };
        this.websocket.send(JSON.stringify(update));
      }
    }
    requestAnimationFrame(this.processInput);
  };

  createGameObjects() {
    // Ball
    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    this.objects.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.scene.add(this.objects.ball);
    // Paddles
    const paddleGeometry = new THREE.BoxGeometry(2, 0.2, 0.5);
    const paddleMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.objects.playerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    this.scene.add(this.objects.playerPaddle);
    this.objects.opponentPaddle = this.objects.playerPaddle.clone();
    this.objects.opponentPaddle.material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });
    this.scene.add(this.objects.opponentPaddle);
    // Table
    const tableGeometry = new THREE.BoxGeometry(10, 0.1, 15);
    const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x1560bd });
    this.objects.table = new THREE.Mesh(tableGeometry, tableMaterial);
    this.scene.add(this.objects.table);
  }

  setupLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0xffffff, 500);
    pointLight.position.set(0, 10, 0);
    this.scene.add(pointLight);
  }

  onWindowResize = () => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(WIDTH, HEIGHT);
  };

  initWebSocket(webSocketConnectionURI) {
    this.websocket = new WebSocket(webSocketConnectionURI);
    this.websocket.onopen = () => {
      this.websocket.send(JSON.stringify({ type: 'request_game_state' }));
    };
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleServerMessage(data);
    };
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'sync_time':
        const clientTime = Date.now();
        const serverTimestamp = data.server_timestamp; // 서버에서 보낸 타임스탬프
        this.serverTimeDiff = serverTimestamp - clientTime;
        break;
      case 'game_start':
        return this.setGameStarted();
      case 'countdown_sequence':
        if (this.serverTimeDiff === undefined) {
          // 시간 동기화가 아직 안 됐으면 잠시 대기 후 재시도
          setTimeout(() => this.handleCountdownSequence(data), 100);
          return;
        }
        this.handleCountdownSequence(data);
        break;
      case 'player_assigned':
        this.websocket.send(
          JSON.stringify({
            type: 'sync_time',
            client_time: Date.now(), // timestamp 대신 client_time 사용
          }),
        );
        return this.setPlayerNumber(data);
      case 'opponent_update':
        return this.updateOpponentPaddle(data);
      case 'game_state_update':
        return this.updateGameState(data);
      case 'countdown':
        return this.handleCountdown(data);
      case 'game_end':
        return this.handleGameEnd(data);
    }
  }

  handleCountdownSequence(data) {
    const sequence = data.sequence;
    const serverTime = data.server_time * 1000; // 서버 시간을 밀리초로 변환
    const clientTime = Date.now();
    const timeDiff = clientTime - serverTime; // 서버와 클라이언트의 시간 차이

    // 각 카운트다운에 대해 타이머 설정
    sequence.forEach((item) => {
      const delay = item.delay * 1000; // 딜레이를 밀리초로 변환
      const adjustedDelay = Math.max(0, delay - timeDiff); // 시간 차이를 고려한 딜레이 계산

      setTimeout(() => {
        this.handleCountdown({ count: item.count });
      }, adjustedDelay);
    });
  }

  setupTextSprites() {
    // 카운트다운 텍스트 스프라이트 생성
    this.textObjects = {
      countdown: this.createTextSprite(''),
      winner: this.createTextSprite(''),
      subText: this.createTextSprite(''), // 추가 안내 텍스트를 위한 스프라이트
    };

    // 메인 카운트다운 텍스트
    this.textObjects.countdown.position.set(0, 3, 0);
    this.textObjects.countdown.visible = false;
    this.scene.add(this.textObjects.countdown);

    // 승자 텍스트
    this.textObjects.winner.position.set(0, 3, 0);
    this.textObjects.winner.visible = false;
    this.scene.add(this.textObjects.winner);

    // 부가 설명 텍스트 (준비 안내, 게임 종료 카운트다운 등)
    this.textObjects.subText.position.set(0, 2, 0);
    this.textObjects.subText.visible = false;
    this.scene.add(this.textObjects.subText);
  }

  createTextSprite(text, size = 48, color = '#ffffff') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 캔버스 크기를 더 넓게 설정
    canvas.width = 1024; // 512에서 1024로 증가
    canvas.height = 256; // 128에서 256으로 증가

    context.font = `bold ${size}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.shadowColor = 'rgba(0, 0, 0, 0.5)';
    context.shadowBlur = 4;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    });

    const sprite = new THREE.Sprite(material);
    // 스프라이트 스케일 조정 - 더 넓은 가로 비율 적용
    sprite.scale.set(8, 2, 1); // 4, 1, 1에서 8, 2, 1로 변경

    return sprite;
  }

  updateTextSprite(type, text) {
    const sprite = this.textObjects[type];
    if (!sprite) return;

    const size = type === 'countdown' ? 64 : 48;
    const newSprite = this.createTextSprite(text, size);

    // 위치와 스케일 복사
    newSprite.position.copy(sprite.position);
    newSprite.scale.copy(sprite.scale);

    // 이전 스프라이트 제거 및 리소스 정리
    this.scene.remove(sprite);
    sprite.material.map.dispose();
    sprite.material.dispose();

    // 새 스프라이트 추가
    this.textObjects[type] = newSprite;
    this.scene.add(newSprite);
    newSprite.visible = text !== '';
  }

  handleCountdown({ count }) {
    const countValue = count.toString();

    // 모든 텍스트 객체 표시 상태 초기화
    this.textObjects.countdown.visible = true;
    this.textObjects.countdown.material.opacity = 0;
    this.textObjects.subText.visible = true;
    this.textObjects.subText.material.opacity = 0;

    if (countValue === 'GO!') {
      // GO! 메시지 표시
      this.updateTextSprite('countdown', 'GO!', 72);
      this.updateTextSprite('subText', '');

      // 페이드인 효과 적용
      this.fadeInText(this.textObjects.countdown);

      // 1초 후에 모든 텍스트 페이드아웃
      setTimeout(() => {
        this.fadeOutText(this.textObjects.countdown, () => {
          this.isStarted = true;
        });
        this.fadeOutText(this.textObjects.subText);
      }, 1000);
    } else {
      // 숫자 카운트다운
      const fontSize = 64;
      this.updateTextSprite('countdown', countValue, fontSize);
      this.updateTextSprite('subText', 'Get Ready!', 36);

      // 페이드인 효과 적용
      this.fadeInText(this.textObjects.countdown);
      this.fadeInText(this.textObjects.subText);

      // 숫자가 변경될 때 애니메이션 효과
      this.textObjects.countdown.scale.set(9, 2.2, 1);
      setTimeout(() => {
        this.textObjects.countdown.scale.set(8, 2, 1);
        // 이전 숫자를 페이드아웃
        setTimeout(() => {
          this.fadeOutText(this.textObjects.countdown);
          this.fadeOutText(this.textObjects.subText);
        }, 800); // 0.8초 후에 페이드아웃 시작
      }, 100);
    }
  }

  fadeInText(textSprite) {
    const fadeIn = () => {
      if (textSprite.material.opacity < 1) {
        textSprite.material.opacity += 0.05;
        requestAnimationFrame(fadeIn);
      }
    };
    fadeIn();
  }

  fadeOutText(textSprite, callback) {
    const fadeOut = () => {
      if (textSprite.material.opacity > 0) {
        textSprite.material.opacity -= 0.05;
        requestAnimationFrame(fadeOut);
      } else {
        textSprite.visible = false;
        if (callback) callback();
      }
    };
    fadeOut();
  }

  handleGameEnd({ winner, match }) {
    this.isStarted = false;

    // 게임 오브젝트 초기화
    this.objects.ball.position.set(0, 0.2, 0);
    this.objects.playerPaddle.position.set(0, 0.1, 7);
    this.objects.opponentPaddle.position.set(0, 0.1, -7);

    // 승자 스코어 업데이트
    const winnerScore = winner === 'player1' ? 'player1' : 'player2';
    this.states.score[winnerScore]++;
    this.updateScore(this.states.score);

    // 결승전(3)이나 3,4위전(4)인 경우 순위 표시
    let winnerText;
    if (match === '3') {
      // 결승전일 때 각 플레이어의 화면에 맞는 텍스트 표시
      winnerText = winner === this.playerNumber ? '🏆 Champion!' : '2nd Place';
    } else if (match === '4') {
      // 3,4위전일 때 각 플레이어의 화면에 맞는 텍스트 표시
      winnerText = winner === this.playerNumber ? '3rd Place' : '4th Place';
    } else if (match === '0' || match === '1' || match === '2') {
      // 일반 게임일 때 승/패 표시
      winnerText = winner === this.playerNumber ? 'You Win!' : 'You Lose';
    }

    // 텍스트 업데이트 및 표시
    this.updateTextSprite('winner', winnerText, 64);
    this.textObjects.winner.visible = true;
    this.fadeInText(this.textObjects.winner);

    // 카운트다운 시작
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        this.updateTextSprite(
          'subText',
          `Returning to lobby in ${countdown}...`,
          36,
        );
        this.textObjects.subText.visible = true;
      } else {
        clearInterval(countdownInterval);
        this.fadeOutText(this.textObjects.winner);
        this.fadeOutText(this.textObjects.subText, () => {
          const { message, path } = this.getResult(winner, match);
          alert(message);
          return this.navigate(path, { replace: true });
        });
      }
    }, 1000);
  }

  dispose() {
    // Update event listener cleanup
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('resize', this.onWindowResize);
    window.cancelAnimationFrame(this.animationFrameId);
    this.websocket?.close();

    Object.values(this.textObjects).forEach((sprite) => {
      if (sprite) {
        sprite.material.map.dispose();
        sprite.material.dispose();
      }
    });

    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (object.material.map) object.material.map.dispose();
        object.material.dispose();
      }
    });

    this.renderer.dispose();
  }

  setGameStarted() {
    this.isStarted = true;
  }

  setPlayerNumber({ player_number }) {
    this.playerNumber = player_number;
  }

  updateOpponentPaddle({ player, position, input_sequence }) {
    if (player === this.playerNumber) {
      return;
    }
    this.states.paddle.players[player].position = position;
    this.states.paddle.lastProcessedInput[player] = input_sequence;
  }

  updateGameState({ ball, score }) {
    this.updateBallState(ball);
    if (score && (score.player1 != this.states.score.player1 || score.player2 != this.states.score.player2)) {
      this.states.score = score;
      this.updateScore(score);
    }
  }

  updateBallState(ballData) {
    if (!ballData) {
      return;
    }

    // 현재 위치와 새로운 위치의 거리가 큰 경우 (리셋되는 경우) 즉시 이동
    const currentPos = this.objects.ball.position;
    const newPos = new THREE.Vector3(
      ballData.position.x,
      ballData.position.y,
      ballData.position.z,
    );

    // 중앙 위치({x: 0, y: 0.2, z: 0})로 이동하는 경우 즉시 이동
    if (
      ballData.position.x === 0 &&
      ballData.position.y === 0.2 &&
      ballData.position.z === 0
    ) {
      this.objects.ball.position.copy(newPos);
    }

    // 공 상태 업데이트
    this.states.ball = {
      position: {
        x: ballData.position.x,
        y: ballData.position.y,
        z: ballData.position.z,
      },
      velocity: {
        x: ballData.velocity.x,
        y: ballData.velocity.y,
        z: ballData.velocity.z,
      },
      timestamp: ballData.timestamp,
    };

    // 일반적인 게임 오브젝트 업데이트 (보간 적용)
    this.updateGameObjects();
  }

  updateGameObjects() {
    if (!this.playerNumber) {
      return;
    }
    // Ball update with interpolation
    let ballTargetPosition = new THREE.Vector3(
      this.states.ball.position.x,
      this.states.ball.position.y,
      this.states.ball.position.z,
    );
    // Invert Z axis for player 2
    if (this.playerNumber === 'player2') {
      ballTargetPosition.z *= -1;
    }
    this.objects.ball.position.lerp(ballTargetPosition, LERP_FACTOR.ball);
    // Paddle updates remain the same...
    const player1TargetPosition = new THREE.Vector3(
      this.states.paddle.players.player1.position.x,
      0.1,
      7,
    );
    const player2TargetPosition = new THREE.Vector3(
      this.states.paddle.players.player2.position.x,
      0.1,
      -7,
    );
    if (this.playerNumber === 'player2') {
      player1TargetPosition.z *= -1;
      player2TargetPosition.z *= -1;
    }
    if (this.playerNumber === 'player1') {
      this.objects.playerPaddle.position.lerp(
        player1TargetPosition,
        LERP_FACTOR.paddle,
      );
      this.objects.opponentPaddle.position.lerp(
        player2TargetPosition,
        LERP_FACTOR.paddle,
      );
      return;
    }
    this.objects.playerPaddle.position.lerp(
      player2TargetPosition,
      LERP_FACTOR.paddle,
    );
    this.objects.opponentPaddle.position.lerp(
      player1TargetPosition,
      LERP_FACTOR.paddle,
    );
  }

  animate = () => {
    this.animationFrameId = window.requestAnimationFrame(this.animate);
    if (this.isStarted) {
      this.updateGameObjects();
    }
    this.renderer.render(this.scene, this.camera);
  };

  getResult = (winner, match) => {
    const isWinner = winner === this.playerNumber;
    if (match === '1' || match === '2') {
      if (isWinner) {
        return {
          message: '게임에서 승리했습니다. 결승전으로 이동합니다.',
          path: `/room/${this.roomId}_final`,
        };
      }
      return {
        message: '게임에서 패배했습니다. 3,4위전으로 이동합니다.',
        path: `/room/${this.roomId}_3rd`,
      };
    }
    let result = isWinner ? '게임에서 승리했습니다.' : '게임에서 패배했습니다.';
    let rank = isWinner ? 1 : 2;
    if (match === '4') {
      rank += 2;
    }
    return {
      message: `${result} (${rank}위)`,
      path: '/lobby',
    };
  };
}
