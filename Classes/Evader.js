
class Evader extends Player {
  constructor(x, y, radius, speedVectorDirection, speedVectorLength) {
    super(x, y, radius, speedVectorDirection, speedVectorLength)
    this.wantedAngleToL = 0 //угол, который хотим поддерживать с вектором L
    this.coefficientC = 2
  }
  
  calculateNextPoint(PursuiterCoordinates, PursuiterSpeedVector, PursuiterRadius) {
    //вектор, направленный от преследующего к убегающему
    let Lvector = new Vector({coordinates: [
      this.currentCoordinates[0] - PursuiterCoordinates[0],
      this.currentCoordinates[1] - PursuiterCoordinates[1]
    ]})
    
    if (Lvector.length > this.radius * this.coefficientC) { //выравнивание
      this.wantedPoint = [
        this.currentCoordinates[0] + Lvector.coordinates[0], 
        this.currentCoordinates[1] + Lvector.coordinates[1]
      ]
    } else if (Lvector.length <= this.radius * this.coefficientC) { //если находимся близко
      let buffVector1 = new Vector({direction: PursuiterSpeedVector.direction + 90, length: PursuiterRadius * 1.5})
      let buffVector2 = new Vector({direction: PursuiterSpeedVector.direction - 90, length: PursuiterRadius * 1.5})
      
      let radPoint1 = [PursuiterCoordinates[0] + buffVector1.coordinates[0], PursuiterCoordinates[1] + buffVector1.coordinates[1]]
      let radPoint2 = [PursuiterCoordinates[0] + buffVector2.coordinates[0], PursuiterCoordinates[1] + buffVector2.coordinates[1]]

      let toRad1 = utils.mathUtils.getDistanceBetweenPoints(radPoint1, this.currentCoordinates)
      let toRad2 = utils.mathUtils.getDistanceBetweenPoints(radPoint2, this.currentCoordinates)
      this.wantedPoint = toRad1 < toRad2 ? radPoint1 : radPoint2
    }
  }
}
