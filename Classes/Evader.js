
class Evader extends Player {
  constructor(x, y, isInerted, radius, speedVectorDirection, speedVectorLength) {
    super(x, y, isInerted, radius, speedVectorDirection, speedVectorLength)
    this.wantedAngleToL = 0 //угол, который хотим поддерживать с вектором L
    this.numOfPoint = 0 //в какуй именно радиус стремиться
    console.log(this)
  }
  
  calculateNextPoint(PursuiterCoordinates, PursuiterSpeedVector, PursuiterRadius) {
    //вектор, направленный от преследующего к убегающему
    var Lvector = new Vector({coordinates: [
      this.currentCoordinates[0] - PursuiterCoordinates[0],
      this.currentCoordinates[1] - PursuiterCoordinates[1]
    ]})
    
    /*дальняя дистанция, идём по заданному курсу*/
    if (Lvector.length > 10 / PursuiterRadius) {
      this.numOfPoint = 0
      this.wantedPoint = [
        this.currentCoordinates[0] + this.speedVector.coordinates[0], 
        this.currentCoordinates[1] + this.speedVector.coordinates[1]
      ]
    }
    //средняя дистанция
    else if ((Lvector.length > (PursuiterRadius / 2) && Lvector.length <= 10 / PursuiterRadius)) {
      this.numOfPoint = 0
      this.wantedPoint = [
        this.currentCoordinates[0] + Lvector.coordinates[0], 
        this.currentCoordinates[1] + Lvector.coordinates[1]
      ]
    }
    //если находимся близко
    else if (Lvector.length <= (PursuiterRadius / 2)) {
      //вектора от преследователя до цетров
      let buffVector1 = new Vector({direction: PursuiterSpeedVector.direction + 90, length: PursuiterRadius})
      let buffVector2 = new Vector({direction: PursuiterSpeedVector.direction - 90, length: PursuiterRadius})

      let radPoint1 = [PursuiterCoordinates[0] + buffVector1.coordinates[0], PursuiterCoordinates[1] + buffVector1.coordinates[1] * 1.8]
      let radPoint2 = [PursuiterCoordinates[0] + buffVector2.coordinates[0], PursuiterCoordinates[1] + buffVector2.coordinates[1] * 1.8]

      let toRad1 = new Vector({coordinates: [
        radPoint1[0] - this.currentCoordinates[0],
        radPoint1[1] - this.currentCoordinates[1]
      ]}).length

      let toRad2 = new Vector({coordinates: [
        radPoint2[0] - this.currentCoordinates[0],
        radPoint2[1] - this.currentCoordinates[1]
      ]}).length

      if ((toRad2 > toRad1) && this.numOfPoint == 0) {
        this.numOfPoint = 1
      } else if ((toRad2 < toRad1) && this.numOfPoint == 0) {
        this.numOfPoint = 2
      }
      if (this.numOfPoint == 1) {
        this.wantedPoint = radPoint1
      } else if (this.numOfPoint == 2) {
        this.wantedPoint = radPoint2
      }
    }
  }
}
