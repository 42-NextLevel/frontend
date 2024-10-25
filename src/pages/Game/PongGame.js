import * as THREE from 'three';

const LERP_FACTOR = {
  ball: 0.3,
  paddle: 0.5,
};

export class PongGame {
  websocket = null;

  constructor(elementId, webSocketConnectionURI, setScore) {
    // Game Objects
    this.objects = {
      ball: null,
      playerPaddle: null,
      opponentPaddle: null,
      table: null,
    };
    // Game States
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
    document.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onWindowResize);
    this.initWebSocket(webSocketConnectionURI);
    this.camera.position.set(0, 7, 10);
    this.camera.lookAt(0, 0, 0);
    this.updateScore = setScore;
  }

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

  onMouseMove = (event) => {
    if (
      !this.isStarted ||
      !this.playerNumber ||
      this.websocket?.readyState !== WebSocket.OPEN
    ) {
      return;
    }
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const paddleX = mouseX * 5;
    const input = {
      inputSequence: this.inputSequence++,
      pressTime: Date.now(),
      x: paddleX,
    };
    // apply input
    if (this.states.paddle.players[this.playerNumber]) {
      this.states.paddle.players[this.playerNumber].position.x = input.x;
    }
    // send client update
    const update = {
      type: 'client_state_update',
      player: this.playerNumber,
      position: { x: input.x },
      input_sequence: input.inputSequence,
      timestamp: Date.now(),
    };
    this.websocket.send(JSON.stringify(update));
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
      case 'game_start':
        return this.setGameStarted();
      case 'player_assigned':
        return this.setPlayerNumber(data);
      case 'opponent_update':
        return this.updateOpponentPaddle(data);
      case 'game_state_update':
        return this.updateGameState(data);
    }
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
    this.states.score = score;
    this.updateScore(score);
  }

  updateBallState(ballData) {
    if (!ballData) {
      return;
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
    // 게임 오브젝트 업데이트
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
    window.requestAnimationFrame(this.animate);
    if (this.isStarted) {
      this.updateGameObjects();
    }
    this.renderer.render(this.scene, this.camera);
  };
}
