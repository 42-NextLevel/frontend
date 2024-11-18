import * as THREE from 'three';

const LERP_FACTOR = {
  ball: 0.3,
  paddle: 0.5,
  highlight: 0.1,
};
const TUNNEL_HEIGHT = 5;
const TUNNEL_WIDTH = 8;
const TUNNEL_LENGTH = 42;
const PADDLE_Z = -1;
const INITIAL_BALL_SCALE = 0.5;
const MAX_BALL_SCALE = 1.2;
const NUM_SEGMENTS = 15;
const SEGMENT_SPACING = 3;

export class PongGame {
  websocket = null;
  keys = { left: false, right: false };

  constructor({
    elementId,
    roomId,
    matchType,
    intraId,
    nickname,
    setScore,
    navigate,
    setProfile,
  }) {
    this.roomId = roomId;
    this.elementId = elementId;
    this.navigate = navigate;
    this.setProfile = setProfile;
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
        position: { x: 0, y: 0.2, z: -TUNNEL_LENGTH / 2 },
        velocity: { x: 5, y: 0, z: 5 },
        timestamp: 0,
      },
      paddle: {
        players: {
          player1: { position: { x: 0, y: 0, z: PADDLE_Z } },
          player2: { position: { x: 0, y: 0, z: -TUNNEL_LENGTH - PADDLE_Z } },
        },
        lastProcessedInput: { player1: 0, player2: 0 },
        timestamp: 0,
      },
      score: { player1: 0, player2: 0 },
    };

    this.MAX_PADDLE_MOVEMENT = 0.6;
    this.BASE_SPEED = 10;
    this.MIN_SPEED = 5;
    this.MAX_SPEED = 15;

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 계단 현상 방지
      alpha: true,
    });
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자

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

    // 카메라 설정
    this.camera.position.z = 7;
    this.camera.lookAt(0, 0, 7);

    this.updateScore = setScore;
    this.serverTimeDiff = 0;
    this.lastProcessedTime = null;

    this.waitForInitialState();
  }

  setupLights() {
    // 전체적인 은은한 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // 메인 포인트 라이트 - 위쪽에서 비추는 강한 빛
    const mainLight = new THREE.PointLight(0xffffff, 1);
    mainLight.position.set(0, 10, 0);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    // 전면 보조 조명 - 약한 채움광
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.3);
    frontLight.position.set(0, 0, 5);
    this.scene.add(frontLight);

    // 측면 포인트 라이트 - 볼에 입체감을 주는 강조광
    const sideLight = new THREE.PointLight(0x00ff00, 0.5);
    sideLight.position.set(5, 0, 0);
    this.scene.add(sideLight);
  }

  waitForInitialState() {
    if (this.states) {
      this.processInput();
    } else {
      setTimeout(() => this.waitForInitialState(), 100);
    }
  }

  getServerTime() {
    return Date.now() + this.serverTimeDiff;
  }

  onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') this.keys.left = true;
    if (event.key === 'ArrowRight') this.keys.right = true;
    if (event.key === 'ArrowUp') this.keys.up = true;
    if (event.key === 'ArrowDown') this.keys.down = true;
  };

  onKeyUp = (event) => {
    if (event.key === 'ArrowLeft') this.keys.left = false;
    if (event.key === 'ArrowRight') this.keys.right = false;
    if (event.key === 'ArrowUp') this.keys.up = false;
    if (event.key === 'ArrowDown') this.keys.down = false;
  };

  processInput = () => {
    if (
      this.isStarted &&
      this.playerNumber &&
      this.websocket?.readyState === WebSocket.OPEN
    ) {
      const currentServerTime = this.getServerTime();

      // 첫 실행이거나 서버 시간이 아직 동기화되지 않은 경우
      if (!this.lastProcessedTime) {
        this.lastProcessedTime = currentServerTime;
        requestAnimationFrame(this.processInput);
        return;
      }

      // 서버 시간 기준으로 deltaTime 계산
      const deltaTime = (currentServerTime - this.lastProcessedTime) / 1000; // 초 단위로 변환
      this.lastProcessedTime = currentServerTime;

      // 기본 속도를 초당 단위로 정의
      const BASE_SPEED = 8; // 초당 8 유닛 이동

      let currentX = this.states.paddle.players[this.playerNumber].position.x;
      let currentY = this.states.paddle.players[this.playerNumber].position.y;

      // 서버 시간 기준 이동 거리 계산
      if (this.keys.left) currentX -= BASE_SPEED * deltaTime;
      if (this.keys.right) currentX += BASE_SPEED * deltaTime;
      if (this.keys.up) currentY += BASE_SPEED * deltaTime;
      if (this.keys.down) currentY -= BASE_SPEED * deltaTime;

      // Clamp paddle position - 터널 전체 범위로 수정
      currentX = Math.max(-TUNNEL_WIDTH, Math.min(TUNNEL_WIDTH, currentX));
      currentY = Math.max(-TUNNEL_HEIGHT, Math.min(TUNNEL_HEIGHT, currentY));

      // 위치값 반올림 (서버와 동일한 정밀도 유지)
      currentX = Math.round(currentX * 1000) / 1000;
      currentY = Math.round(currentY * 1000) / 1000;
      const lastPosition = {
        x:
          Math.round(
            this.states.paddle.players[this.playerNumber].position.x * 1000,
          ) / 1000,
        y:
          Math.round(
            this.states.paddle.players[this.playerNumber].position.y * 1000,
          ) / 1000,
      };

      // 의미있는 위치 변화가 있는 경우만 업데이트
      if (
        Math.abs(currentX - lastPosition.x) >= 0.001 ||
        Math.abs(currentY - lastPosition.y) >= 0.001
      ) {
        const serverTimestamp = this.getServerTime();

        const input = {
          inputSequence: this.inputSequence++,
          pressTime: serverTimestamp, // 서버 시간 기준으로 변경
          x: currentX,
          y: currentY,
        };

        this.states.paddle.players[this.playerNumber].position.x = input.x;
        this.states.paddle.players[this.playerNumber].position.y = input.y;

        const update = {
          type: 'client_state_update',
          player: this.playerNumber,
          position: { x: input.x, y: input.y },
          input_sequence: input.inputSequence,
          timestamp: serverTimestamp, // 서버 시간 기준으로 변경
        };
        this.websocket.send(JSON.stringify(update));
      }
    }
    requestAnimationFrame(this.processInput);
  };

  createGameObjects() {
    // 터널 생성
    this.tunnelSegments = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const z = -i * SEGMENT_SPACING;

      const vertices = new Float32Array([
        -TUNNEL_WIDTH,
        -TUNNEL_HEIGHT,
        z,
        TUNNEL_WIDTH,
        -TUNNEL_HEIGHT,
        z,
        TUNNEL_WIDTH,
        TUNNEL_HEIGHT,
        z,
        -TUNNEL_WIDTH,
        TUNNEL_HEIGHT,
        z,
        -TUNNEL_WIDTH,
        -TUNNEL_HEIGHT,
        z,
      ]);

      lineGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3),
      );
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.scene.add(line);
      this.tunnelSegments.push({ line, material: lineMaterial });
    }

    // 터널 모서리 연결선
    for (let corner = 0; corner < 4; corner++) {
      const lineGeometry = new THREE.BufferGeometry();
      const x = corner % 2 === 0 ? -TUNNEL_WIDTH : TUNNEL_WIDTH;
      const y = corner < 2 ? -TUNNEL_HEIGHT : TUNNEL_HEIGHT;

      const vertices = new Float32Array([x, y, 0, x, y, -TUNNEL_LENGTH]);

      lineGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3),
      );
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.scene.add(line);
    }

    // 공 생성
    const ballGeometry = new THREE.SphereGeometry(1, 32, 32); // 더 부드러운 구체를 위해 세그먼트 수 증가
    const ballMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00, // 기본 색상
      emissive: 0x002000, // 약간의 자체 발광
      specular: 0xffffff, // 반사광 색상 (하얀색)
      shininess: 50, // 반사광 강도
      transparent: true, // 투명도 활성화
      opacity: 0.9, // 살짝 투명하게
    });

    this.objects.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.scene.add(this.objects.ball);

    // 공 주변에 와이어프레임 구체 추가 (시각적 효과)
    const wireframeGeometry = new THREE.SphereGeometry(1.1, 16, 16);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });

    const wireframeSphere = new THREE.Mesh(
      wireframeGeometry,
      wireframeMaterial,
    );
    this.objects.ball.add(wireframeSphere);

    // 그림자 설정
    this.objects.ball.castShadow = true;
    this.objects.ball.receiveShadow = true;

    // 회전 속성 추가
    this.ballRotation = {
      x: 0.01,
      y: 0.02,
      z: 0.005,
    };

    // 패들 생성
    const paddleGroup = new THREE.Group();

    // 반투명한 패들 면
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const paddlePlane = new THREE.Mesh(planeGeometry, planeMaterial);
    paddleGroup.add(paddlePlane);

    // 패들 테두리
    const lineGeometry = new THREE.BufferGeometry();
    const size = 1;
    const vertices = new Float32Array([
      -size,
      -size,
      0,
      size,
      -size,
      0,
      size,
      size,
      0,
      -size,
      size,
      0,
      -size,
      -size,
      0,
    ]);

    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3),
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0.8,
    });

    const paddleOutline = new THREE.Line(lineGeometry, lineMaterial);
    paddleGroup.add(paddleOutline);

    // 패들 십자선
    const crossGeometry = new THREE.BufferGeometry();
    const crossVertices = new Float32Array([
      -size,
      0,
      0,
      size,
      0,
      0,
      0,
      -size,
      0,
      0,
      size,
      0,
    ]);

    crossGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(crossVertices, 3),
    );
    const crossLine = new THREE.LineSegments(crossGeometry, lineMaterial);
    paddleGroup.add(crossLine);

    this.objects.playerPaddle = paddleGroup;

    // 상대 플레이어 패들 생성
    const opponentPaddleGroup = paddleGroup.clone();
    opponentPaddleGroup.traverse((child) => {
      if (child.material) {
        child.material = child.material.clone();
        child.material.color.setHex(0xff0000); // 빨간색으로 변경
      }
    });
    this.objects.opponentPaddle = opponentPaddleGroup;

    this.scene.add(this.objects.playerPaddle);
    this.scene.add(this.objects.opponentPaddle);
    const highlightGeometry = new THREE.BufferGeometry();
    const highlightVertices = new Float32Array([
      -TUNNEL_WIDTH,
      -TUNNEL_HEIGHT,
      0,
      TUNNEL_WIDTH,
      -TUNNEL_HEIGHT,
      0,
      TUNNEL_WIDTH,
      TUNNEL_HEIGHT,
      0,
      -TUNNEL_WIDTH,
      TUNNEL_HEIGHT,
      0,
      -TUNNEL_WIDTH,
      -TUNNEL_HEIGHT,
      0,
    ]);

    highlightGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(highlightVertices, 3),
    );
    const highlightMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.highlightSegment = new THREE.Line(
      highlightGeometry,
      highlightMaterial,
    );
    this.scene.add(this.highlightSegment);

    // 페이드 효과용 보조 세그먼트
    const fadeGeometry = highlightGeometry.clone();
    const fadeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });

    this.fadeSegment = new THREE.Line(fadeGeometry, fadeMaterial);
    this.scene.add(this.fadeSegment);
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
    this.websocket.onerror = () => {
      alert('잘못된 접근입니다.');
      this.navigate('/lobby', { replace: true });
    };
    this.websocket.onopen = () => {
      // 게임 상태와 시간 동기화 요청
      this.websocket.send(
        JSON.stringify({
          type: 'request_initial_state',
        }),
      );
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
      case 'initial_game_state':
        // 초기 게임 상태 설정
        this.states = {
          ball: data.ball,
          paddle: data.paddle,
          score: data.score || { player1: 0, player2: 0 },
        };
        this.updateGameObjects(); // 초기 상태로 게임 오브젝트 업데이트
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
    if (this.highlightSegment) {
      this.highlightSegment.geometry.dispose();
      this.highlightSegment.material.dispose();
      this.scene.remove(this.highlightSegment);
    }

    if (this.fadeSegment) {
      this.fadeSegment.geometry.dispose();
      this.fadeSegment.material.dispose();
      this.scene.remove(this.fadeSegment);
    }
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
    document
      .getElementById(this.elementId)
      .removeChild(this.renderer.domElement);
  }

  setGameStarted() {
    this.isStarted = true;
  }

  setPlayerNumber({ player_number }) {
    if (!this.playerNumber) {
      this.playerNumber = player_number;

      // 카메라 위치 고정
      this.camera.position.z = 7;
      this.camera.lookAt(0, 0, 1);
      this.setProfile(player_number);
    }
  }

  updateOpponentPaddle({ player, position, input_sequence }) {
    if (player === this.playerNumber) {
      return;
    }
    this.states.paddle.players[player].position = position;
    this.states.paddle.lastProcessedInput[player] = input_sequence;
  }

  updateGameState({ ball, score }) {
    if (ball) {
      this.updateBallState(ball);
    }

    if (
      score &&
      (score.player1 !== this.states.score.player1 ||
        score.player2 !== this.states.score.player2)
    ) {
      this.states.score = score;
      this.updateScore(score);
    }
  }

  updateBallState(ballData) {
    if (!ballData || !ballData.position) {
      return;
    }

    // 서버로부터 받은 원본 상태 저장
    this.states.ball = {
      position: { ...ballData.position },
      scale: ballData.scale || INITIAL_BALL_SCALE,
    };

    // Player 2의 경우:
    // 1. 전체 터널 길이(42)에서 현재 z position을 빼서 반전
    // 2. 여기서 다시 -를 곱해 방향을 맞춤
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

    // 볼 오브젝트 위치 및 크기 업데이트
    // this.objects.ball.position.copy(ballPosition);
    // const scale = ballData.scale || INITIAL_BALL_SCALE;
    // this.objects.ball.scale.set(scale, scale, scale);

    this.updateGameObjects();
  }

  updateGameObjects() {
    if (!this.playerNumber || !this.states.ball || !this.states.paddle) {
      return;
    }

    // Ball position calculation based on player perspective
    const ballPosition = new THREE.Vector3(
      this.states.ball.position.x,
      this.states.ball.position.y,
      this.playerNumber === 'player2'
        ? -TUNNEL_LENGTH - this.states.ball.position.z
        : this.states.ball.position.z,
    );

    // 볼 위치 보간
    this.objects.ball.position.lerp(ballPosition, LERP_FACTOR.ball);

    // 볼 크기 계산 및 업데이트 - 플레이어별로 반대로 처리
    let progress;
    if (this.playerNumber === 'player2') {
      progress = -this.states.ball.position.z / TUNNEL_LENGTH; // player2는 z가 작을수록(더 음수) 커짐
    } else {
      progress = (TUNNEL_LENGTH + this.states.ball.position.z) / TUNNEL_LENGTH; // player1은 z가 클수록 커짐
    }
    const scale =
      INITIAL_BALL_SCALE + (MAX_BALL_SCALE - INITIAL_BALL_SCALE) * progress;
    this.objects.ball.scale.set(scale, scale, scale);

    // 세그먼트 하이라이트 업데이트
    // 하이라이트 세그먼트 위치 업데이트
    const ballZ = Math.abs(
      this.playerNumber === 'player2'
        ? -(-TUNNEL_LENGTH - this.states.ball.position.z)
        : this.states.ball.position.z,
    );

    const targetZ = -ballZ;
    const currentZ = this.highlightSegment.position.z;
    const newZ = currentZ + (targetZ - currentZ) * 0.1;

    this.highlightSegment.position.setZ(newZ);
    this.fadeSegment.position.setZ(newZ + 0.5);

    // 세그먼트 통과 시 발광 효과
    const proximityToSegment = Math.abs(ballZ % SEGMENT_SPACING);
    const normalizedProximity = 1 - proximityToSegment / SEGMENT_SPACING;

    this.highlightSegment.material.opacity = 0.8 + normalizedProximity * 0.2;
    this.fadeSegment.material.opacity = 0.2 + normalizedProximity * 0.1;

    // 패들 위치 계산
    const player1Z = PADDLE_Z;
    const player2Z = -TUNNEL_LENGTH - PADDLE_Z;

    const player1Position = new THREE.Vector3(
      this.states.paddle.players.player1.position.x,
      this.states.paddle.players.player1.position.y,
      player1Z,
    );

    const player2Position = new THREE.Vector3(
      this.states.paddle.players.player2.position.x,
      this.states.paddle.players.player2.position.y,
      player2Z,
    );

    if (this.playerNumber === 'player1') {
      // Player 1 시점
      this.objects.playerPaddle.position.lerp(
        player1Position,
        LERP_FACTOR.paddle,
      );
      this.objects.opponentPaddle.position.lerp(
        player2Position,
        LERP_FACTOR.paddle,
      );
    } else {
      // Player 2 시점: 위치 반전
      const invertedPlayer1Pos = new THREE.Vector3(
        player1Position.x,
        player1Position.y,
        -TUNNEL_LENGTH - player1Position.z,
      );
      const invertedPlayer2Pos = new THREE.Vector3(
        player2Position.x,
        player2Position.y,
        -TUNNEL_LENGTH - player2Position.z,
      );

      this.objects.playerPaddle.position.lerp(
        invertedPlayer2Pos,
        LERP_FACTOR.paddle,
      );
      this.objects.opponentPaddle.position.lerp(
        invertedPlayer1Pos,
        LERP_FACTOR.paddle,
      );
    }
  }

  animate = () => {
    this.animationFrameId = window.requestAnimationFrame(this.animate);

    if (this.isStarted && this.objects.ball) {
      this.updateGameObjects();

      // 공 회전 애니메이션 - 속도에 따른 회전
      const velocity = this.states.ball.velocity;
      const speed = Math.sqrt(
        velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2,
      );

      // 속도 방향에 따른 회전 축 조정
      this.objects.ball.rotation.x += this.ballRotation.x * speed;
      this.objects.ball.rotation.y += this.ballRotation.y * speed;
      this.objects.ball.rotation.z += this.ballRotation.z * speed;

      // 와이어프레임 반대 방향 회전으로 시각적 효과 강화
      const wireframe = this.objects.ball.children[0];
      if (wireframe) {
        wireframe.rotation.x -= this.ballRotation.x * speed * 0.5;
        wireframe.rotation.y -= this.ballRotation.y * speed * 0.5;
      }
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
