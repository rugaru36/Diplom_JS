class Player {
  constructor(x, y, radius, speedVectorDirection, speedVectorLength) {
    this.radius = radius
    this.maxAngle = speedVectorLength
    this.maxAngle = speedVectorLength / radius
    this.wantedPoint = [0,0]
    this.currentCoordinates = [x, y]
    this.startCoordinates = [x, y]
    this.speedVector = new Vector({direction: speedVectorDirection, length: speedVectorLength})
    this.startSpeedVector = new Vector({direction: speedVectorDirection, length: speedVectorLength})
  }

  moveToWantedPoint(stepSize) {
    let Jvector = new Vector({coordinates: [
      this.wantedPoint[0] - this.currentCoordinates[0], 
      this.wantedPoint[1] - this.currentCoordinates[1]
    ]})
    let angleToWantedPoint = this.speedVector.direction.toFixed(5) - Jvector.direction.toFixed(5)
    
    angleToWantedPoint = utils.mathUtils.getCorrectAngle(angleToWantedPoint)
    
    if (this.radius == 0) {
      this.speedVector.turnVector(angleToWantedPoint)
    } else if (this.radius > 0) {
      if (Math.abs(angleToWantedPoint) < this.maxAngle * stepSize) {
        this.speedVector.turnVector(angleToWantedPoint)
      } else {
        this.speedVector.turnVector(Math.sign(angleToWantedPoint) * this.maxAngle)
      }
    }
    this.currentCoordinates[0] += (this.speedVector.coordinates[0]) * stepSize
    this.currentCoordinates[1] += (this.speedVector.coordinates[1]) * stepSize
  }

  resetToStartPoint() {
    this.currentCoordinates = this.startCoordinates
    this.speedVector = new Vector({coordinates: this.startSpeedVector.coordinates})
  }

  getRadiusPoints() {
    let buffVector1 = new Vector({direction: this.direction + 90, length: this.radius})
    let buffVector2 = new Vector({direction: this.direction - 90, length: this.radius})
    let radPoint1 = [this.currentCoordinates[0] + buffVector1.coordinates[0], this.currentCoordinates[1] + buffVector1.coordinates[1]]
    let radPoint2 = [this.currentCoordinates[0] + buffVector2.coordinates[0], this.currentCoordinates[1] + buffVector2.coordinates[1]]
    return {radPoint1, radPoint2}
  }
}
