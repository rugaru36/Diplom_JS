
class Game {
  constructor(inputStepSize, inputAccuracy, inputTime) {
    this.l_vector = new Vector({coordinates: [
      document.getElementById("Xe").value - document.getElementById("Xp").value,
      document.getElementById("Ye").value - document.getElementById("Yp").value
    ]})
    this.stepSize = inputStepSize
    this.accuracy = inputAccuracy
    this.time = inputTime
    this.createPlayers()
  }

  rebootData() {
    this.createPlayers()
    this.p_player.resetToStartPoint()
    this.e_player.resetToStartPoint()

    this.l_vector = new Vector({coordinates: [
      this.e_player.currentCoordinates[0] - this.p_player.currentCoordinates[0],
      this.e_player.currentCoordinates[1] - this.p_player.currentCoordinates[1]
    ]})

    this.gameData = []
    this.gameData.whoWon = "N"
    this.gameData.endTime = 0
    this.gameData.escaperCoordinates = []
    this.gameData.pursuiterCoordinates = []
    this.gameData.alphaAngles = []
    this.gameData.distance = []
    this.gameData.min_X = this.e_player.currentCoordinates[0]
    this.gameData.max_X = this.e_player.currentCoordinates[0]
    this.gameData.min_Y = this.e_player.currentCoordinates[1]
    this.gameData.max_Y = this.e_player.currentCoordinates[1]
    this.dataToDrawGraphics = []
    this.dataToDrawGraphics.Escaper = []
    this.dataToDrawGraphics.Pursuiter = []
  }

  checkIsSolved() {
    //догнал
    if (this.l_vector.length <= this.accuracy) {
      this.gameData.whoWon = "P"
      return true
    }
    //векторы к центрам
    let buffVector1 = new Vector({direction: this.p_player.speedVector.direction + 90, length: this.p_player.radius})
    let buffVector2 = new Vector({direction: this.p_player.speedVector.direction - 90, length: this.p_player.radius})
    //центры
    let radCenter1 = [
      this.p_player.currentCoordinates[0] + buffVector1.coordinates[0], 
      this.p_player.currentCoordinates[1] + buffVector1.coordinates[1]
    ]
    let radCenter2 = [
      this.p_player.currentCoordinates[0] + buffVector2.coordinates[0], 
      this.p_player.currentCoordinates[1] + buffVector2.coordinates[1]
    ]
    //вектор от убегающего к центру
    let vectorToFirstRadPoint = new Vector({coordinates: [
      radCenter1[0] - this.e_player.currentCoordinates[0], 
      radCenter1[1] - this.e_player.currentCoordinates[1]
    ]})
    let vectorToSecondRadPoint = new Vector({coordinates: [
      radCenter2[0] - this.e_player.currentCoordinates[0], 
      radCenter2[1] - this.e_player.currentCoordinates[1]
    ]})
    let isInFirstRad = vectorToFirstRadPoint.length < this.p_player.radius * 0.8
    let isInSeconsRad = vectorToSecondRadPoint.length < this.p_player.radius * 0.8
    if (isInFirstRad || isInSeconsRad) {
      this.gameData["whoWon"] = "E"
      return true
    } else {
      return false
    }
  }

  createPlayers() {
    var pDirection
    if (document.getElementById("manualPDirection").checked) {
      pDirection = +document.getElementById("pursuiterVectorDirection").value
    } else {
      pDirection = this.l_vector.direction
    }
    //объекты игроков
    this.p_player = new Pursuiter(
      +document.getElementById("Xp").value,
      +document.getElementById("Yp").value,
      +document.getElementById('pursuiterRadius').value,
      +pDirection,
      +document.getElementById("pursuiterVectorLength").value)
    this.e_player = new Evader(
      +document.getElementById("Xe").value,
      +document.getElementById("Ye").value,
      document.getElementById("IsEscaperInerted").checked,
      +document.getElementById("escaperRadius").value,
      +document.getElementById("escaperVectorDirection").value,
      +document.getElementById("escaperVectorLength").value
    )
  }

  startGameProcess() {
    this.rebootData()
    //console.log(this.gameData["endTime"])
    for (var i = 0; i < (this.time / this.stepSize) - 1; i++) {
      //отслеживаемые точки - кратные 50ти
      if (i == (this.time / this.stepSize) - 2 || i % 50 == 0) {
        this.gameData["pursuiterCoordinates"].push({
          "x": this.p_player.currentCoordinates[0],
          "y": this.p_player.currentCoordinates[1]
        })
        this.gameData["escaperCoordinates"].push({
          "x": this.e_player.currentCoordinates[0],
          "y": this.e_player.currentCoordinates[1]
        })
        this.gameData["alphaAngles"].push(this.p_player.speedVector.direction - this.l_vector.direction)
        this.gameData["distance"].push(this.l_vector.length)
      }

      //точки, по которым будет строиться график
      if (i == (this.time / this.stepSize) - 2 || i % 4 == 0 || i == 0) {
        this.dataToDrawGraphics["Pursuiter"].push({
          "x": this.p_player.currentCoordinates[0],
          "y": this.p_player.currentCoordinates[1]
        })
        this.dataToDrawGraphics["Escaper"].push({
          "x": this.e_player.currentCoordinates[0],
          "y": this.e_player.currentCoordinates[1]
        })
      }

      this.makeNextStep()
      this.gameData["min_X"] = Math.min(this.e_player.currentCoordinates[0], this.p_player.currentCoordinates[0], this.gameData["min_X"])
      this.gameData["max_X"] = Math.max(this.e_player.currentCoordinates[0], this.p_player.currentCoordinates[0], this.gameData["max_X"])
      this.gameData["min_Y"] = Math.min(this.e_player.currentCoordinates[1], this.p_player.currentCoordinates[1], this.gameData["min_Y"])
      this.gameData["max_Y"] = Math.max(this.e_player.currentCoordinates[1], this.p_player.currentCoordinates[1], this.gameData["max_Y"])
      this.gameData["endTime"] = (i + 1) / 100

      if (this.checkIsSolved()) {
        this.gameData["pursuiterCoordinates"].push({
          "x": this.p_player.currentCoordinates[0],
          "y": this.p_player.currentCoordinates[1]
        })
        this.gameData["escaperCoordinates"].push({
          "x": this.e_player.currentCoordinates[0],
          "y": this.e_player.currentCoordinates[1]
        })
        this.dataToDrawGraphics["Pursuiter"].push({
          "x": this.p_player.currentCoordinates[0],
          "y": this.p_player.currentCoordinates[1]
        })
        this.dataToDrawGraphics["Escaper"].push({
          "x": this.e_player.currentCoordinates[0],
          "y": this.e_player.currentCoordinates[1]
        })

        this.gameData["alphaAngles"].push(this.p_player.speedVector.direction - this.l_vector.direction)
        this.gameData["distance"].push(this.l_vector.length)
        break
      }
    }
  }

  makeNextStep() {
    // console.log({"this.e_player":this.e_player})
    this.e_player.calculateNextPoint(this.p_player.currentCoordinates, this.p_player.speedVector, this.p_player.radius)
    this.p_player.calculateNextPoint(this.e_player.currentCoordinates)
    this.e_player.moveToWantedPoint(this.stepSize)
    this.p_player.moveToWantedPoint(this.stepSize)
    this.l_vector = new Vector({coordinates: [
      this.e_player.currentCoordinates[0] - this.p_player.currentCoordinates[0],
      this.e_player.currentCoordinates[1] - this.p_player.currentCoordinates[1]
    ]})
  }

  updateData(e) {
    var value_id = e.id
    var value = e.value * 1
    if (e.type == 'checkbox') value = e.checked
    switch (value_id) {
      case "Xp":
        this.p_player.startCoordinates[0] = value
        break
      case "Yp":
        this.p_player.startCoordinates[1] = value
        break
      case "pursuiterVectorLength":
        var currentDir = this.p_player.startSpeedVector.direction
        this.p_player.startSpeedVector = createVector(currentDir, value)
        return
      case "pursuiterRadius":
        this.p_player.radius = value
        this.p_player.maxAngle = this.p_player.startSpeedVector.length / value
        break
      case "pursuiterVectorDirection":
        this.p_player.startSpeedVector = createVector(value, this.p_player.startSpeedVector.length)
        break
      case "Xe":
        this.e_player.startCoordinates[0] = value
        break
      case "Ye":
        this.e_player.startCoordinates[1] = value
        return
      case "escaperVectorLength":
        var currentDir = this.e_player.startSpeedVector.direction
        this.e_player.startSpeedVector = createVector(currentDir, value)
        break
      case "escaperVectorDirection":
        this.e_player.startSpeedVector = createVector(value, this.e_player.startSpeedVector.length)
        break
      case "escaperRadius":
        this.e_player.radius = value
        this.e_player.maxAngle = this.e_player.startSpeedVector.length / value
        break
      case "h":
        this.stepSize = value
        break
      case "accuracy":
        this.accuracy = value
        break
      case "time":
        this.time = value
        break
      case "IsEscaperInerted":
        this.e_player.radius = document.getElementById("escaperRadius").value * value
        this.e_player.maxAngle = this.e_player.startSpeedVector.length / this.e_player.radius * value
        break
      case "manualPDirection":
        let pDir
        if (value) {
          pDir = document.getElementById("pursuiterVectorDirection").value * 1
          this.p_player.startSpeedVector = createVector(pDir, this.p_player.startSpeedVector.length)
        } else {
          var lVector = []
          lVector[0] = this.e_player.startCoordinates[0] - this.p_player.startCoordinates[0]
          lVector[1] = this.e_player.startCoordinates[1] - this.p_player.startCoordinates[1]
          pDir = lVector.direction
          this.p_player.startSpeedVector = createVector(pDir, this.p_player.startSpeedVector.length)
        }
        break
    }
  }
}