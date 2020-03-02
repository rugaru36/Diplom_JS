class Pursuiter extends Player {
  constructor(x, y, radius, speedVectorDirection, speedVectorLength) {
    super(x, y, radius, speedVectorDirection, speedVectorLength)
    this.FiAngle = this.speedVector.direction
  }

  calculateNextPoint(escaperCoordinates) {
    this.wantedPoint = escaperCoordinates
  }
}