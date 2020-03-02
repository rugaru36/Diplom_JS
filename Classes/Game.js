
class Game {
  constructor(inputStepSize, inputAccuracy, inputTime) {
    this.l_vector = new Vector({coordinates: [
      document.getElementById("Xe").value - document.getElementById("Xp").value,
      document.getElementById("Ye").value - document.getElementById("Yp").value
    ]})
    this.stepSize = inputStepSize
    this.accuracy = inputAccuracy
    this.iterations = inputTime
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
    let vectorToCenter1 = new Vector({direction: this.p_player.speedVector.direction + 90, length: this.p_player.radius})
    let vectorToCenter2 = new Vector({direction: this.p_player.speedVector.direction - 90, length: this.p_player.radius})
    //центры
    let radCenter1 = [
      this.p_player.currentCoordinates[0] + vectorToCenter1.coordinates[0], 
      this.p_player.currentCoordinates[1] + vectorToCenter1.coordinates[1]
    ]
    let radCenter2 = [
      this.p_player.currentCoordinates[0] + vectorToCenter2.coordinates[0], 
      this.p_player.currentCoordinates[1] + vectorToCenter2.coordinates[1]
    ]
    let isInFirstRad = utils.mathUtils.getDistanceBetweenPoints(this.e_player.currentCoordinates, radCenter1) < this.p_player.radius * 0.8
    let isInSecondRad = utils.mathUtils.getDistanceBetweenPoints(this.e_player.currentCoordinates, radCenter2) < this.p_player.radius * 0.8
    if (isInFirstRad || isInSecondRad) {
      this.gameData["whoWon"] = "E"
      return true
    } else {
      return false
    }
  }

  createPlayers() {
    this.p_player = new Pursuiter(
      +document.getElementById("Xp").value,
      +document.getElementById("Yp").value,
      +document.getElementById('pursuiterRadius').value,
      +document.getElementById("pursuiterVectorDirection").value,
      +document.getElementById("pursuiterVectorLength").value)
    this.e_player = new Evader(
      +document.getElementById("Xe").value,
      +document.getElementById("Ye").value,
      +document.getElementById("escaperRadius").value,
      +document.getElementById("escaperVectorDirection").value,
      +document.getElementById("escaperVectorLength").value
    )
  }

  startGameProcess() {
    this.rebootData()
    for (let i = 0; i < 2000; i++) {
      this.updateGameData(i)
      this.makeNextStep()
      if (this.checkIsSolved()) {
        this.updateGameData(i, true)
        break
      }
    }
  }

  makeNextStep() {
    this.e_player.calculateNextPoint(this.p_player.currentCoordinates, this.p_player.speedVector, this.p_player.radius)
    this.p_player.calculateNextPoint(this.e_player.currentCoordinates)
    this.e_player.moveToWantedPoint(this.stepSize)
    this.p_player.moveToWantedPoint(this.stepSize)
    this.l_vector = new Vector({coordinates: [
      this.e_player.currentCoordinates[0] - this.p_player.currentCoordinates[0],
      this.e_player.currentCoordinates[1] - this.p_player.currentCoordinates[1]
    ]})
  }

  updateGameData(iteration, isFinished) {
    this.gameData["alphaAngles"].push(this.p_player.speedVector.direction - this.l_vector.direction)
    this.gameData["distance"].push(this.l_vector.length)
    this.gameData["min_X"] = Math.min(this.e_player.currentCoordinates[0], this.p_player.currentCoordinates[0], this.gameData["min_X"])
    this.gameData["max_X"] = Math.max(this.e_player.currentCoordinates[0], this.p_player.currentCoordinates[0], this.gameData["max_X"])
    this.gameData["min_Y"] = Math.min(this.e_player.currentCoordinates[1], this.p_player.currentCoordinates[1], this.gameData["min_Y"])
    this.gameData["max_Y"] = Math.max(this.e_player.currentCoordinates[1], this.p_player.currentCoordinates[1], this.gameData["max_Y"])
    this.gameData["endTime"] = (iteration + 1)

    if (iteration == (this.iterations / this.stepSize) - 2 || iteration % 50 == 0 || isFinished) {
      this.gameData["pursuiterCoordinates"].push({
        "x": this.p_player.currentCoordinates[0],
        "y": this.p_player.currentCoordinates[1]
      })
      this.gameData["escaperCoordinates"].push({
        "x": this.e_player.currentCoordinates[0],
        "y": this.e_player.currentCoordinates[1]
      })
    }
    if (iteration == (this.iterations / this.stepSize) - 2 || iteration % 4 == 0 || isFinished) {
      this.dataToDrawGraphics["Pursuiter"].push({
        "x": this.p_player.currentCoordinates[0],
        "y": this.p_player.currentCoordinates[1]
      })
      this.dataToDrawGraphics["Escaper"].push({
        "x": this.e_player.currentCoordinates[0],
        "y": this.e_player.currentCoordinates[1]
      })
    }
  }

  getValueFromDOM(e) {
    let value_id = e.id
    let value = e.value * 1
    if (e.type == 'checkbox') value = e.checked
    switch (value_id) {
      case "Xp":
        this.p_player.startCoordinates[0] = value
        break
      case "Yp":
        this.p_player.startCoordinates[1] = value
        break
      case "pursuiterVectorLength":
        this.p_player.startSpeedVector = new Vector({
          direction: this.p_player.startSpeedVector.direction, 
          length: value
        })
        return
      case "pursuiterRadius":
        this.p_player.radius = value
        this.p_player.maxAngle = this.p_player.startSpeedVector.length / value
        break
      case "pursuiterVectorDirection":
        this.p_player.startSpeedVector = new Vector({
          direction: value, 
          length: this.p_player.startSpeedVector.length
        })
        break
      case "Xe":
        this.e_player.startCoordinates[0] = value
        break
      case "Ye":
        this.e_player.startCoordinates[1] = value
        return
      case "escaperVectorLength":
        this.e_player.startSpeedVector = new Vector({
          direction: this.e_player.startSpeedVector.direction, 
          length: value
        })
        break
      case "escaperVectorDirection":
        this.e_player.startSpeedVector = new Vector({
          direction: value, 
          length: this.e_player.startSpeedVector.length
        })
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
        this.iterations = value
        break
      case "IsEscaperInerted":
        this.e_player.radius = document.getElementById("escaperRadius").value * value
        this.e_player.maxAngle = this.e_player.startSpeedVector.length / this.e_player.radius * value
        break
      case "manualPDirection":
        if (value) {
          this.p_player.startSpeedVector = new Vector({
            direction: +document.getElementById("pursuiterVectorDirection").value,
            length: this.p_player.startSpeedVector.length
          })
        } else {
          let lVector = new Vector({coordinates: [
            this.e_player.startCoordinates[0] - this.p_player.startCoordinates[0],
            this.e_player.startCoordinates[1] - this.p_player.startCoordinates[1]
          ]})
          this.p_player.startSpeedVector = new Vector({
            direction: lVector.direction,
            length: lVector.length
          })
        }
        break
    }
  }
}