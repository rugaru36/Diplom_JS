class Player {
  constructor(x, y, isInerted, radius, speedVectorDirection, speedVectorLength) {
    this.radius = isInerted ? radius : 0
    this.maxAngle = isInerted ? speedVectorLength / radius : 0
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
    
    while (angleToWantedPoint >= 180) {
      angleToWantedPoint -= utils.radToDeg(2 * Math.PI)
    }
    while (angleToWantedPoint <= -180) {
      angleToWantedPoint += utils.radToDeg(2 * Math.PI)
    }
    
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
    // console.log(this.currentCoordinates, this.speedVector.coordinates)
  }

  resetToStartPoint() {
    this.currentCoordinates = this.startCoordinates
    this.speedVector = new Vector({coordinates: this.startSpeedVector.coordinates})
  }
}
