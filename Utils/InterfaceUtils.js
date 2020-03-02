class InterfaceUtils {
  getSizeOfStepForInput(idOfElement) {
    let sizeOfStep
    let signsAfterDot
    switch (idOfElement) {
      case "escaperVectorDirection":
        sizeOfStep = 10
        signsAfterDot = 0
        break
      case "pursuiterVectorDirection":
        sizeOfStep = 10
        signsAfterDot = 0
        break
      case "pursuiterRadius":
        sizeOfStep = 0.5
        signsAfterDot = 1
        break
      case "escaperRadius":
        sizeOfStep = 0.5
        signsAfterDot = 1
        break
      case "h":
        sizeOfStep = 0.01
        signsAfterDot = 2
        break
      case "accuracy":
        sizeOfStep = 0.05
        signsAfterDot = 2
        break
      case "speed":
        sizeOfStep = 0.5
        signsAfterDot = 1
        break
      default:
        sizeOfStep = 1
        signsAfterDot = 0
        break
    }
    return { sizeOfStep, signsAfterDot }
  }

  //Запись старого значения на всякий пожарный
  setOldValue(idOfElement) {
    document.getElementById("hiddenOldValueBuff").value = document.getElementById(idOfElement).value
  }

  checkPDirection(e) {
    if (e.checked) {
      document.getElementById("pDirectionDiv").style.display = "block"
    } else {
      document.getElementById("pDirectionDiv").style.display = "none"
    }
    GameObject.getValueFromDOM(e)
  }

  //Проверка при изменении прямым вводом
  onChangeCheck(idOfElement) {
    let oldValue = document.getElementById("hiddenOldValueBuff").value
    let isMinExist = document.getElementById(idOfElement).hasAttribute("min")
    let isMaxExist = document.getElementById(idOfElement).hasAttribute("max")
    let min = isMinExist ? +document.getElementById(idOfElement).getAttribute("min") : 0
    let max = isMaxExist ? + document.getElementById(idOfElement).getAttribute("max") : 0
    if (document.getElementById(idOfElement).value == "") {
      alert("Пустое поле!")
      document.getElementById(idOfElement).value = oldValue
      return
    } else if (isMaxExist && document.getElementById(idOfElement).value > max) {
      alert(`Больше максимума! \nМаксимум: ${max}`)
      document.getElementById(idOfElement).value = oldValue
      return
    } else if (isMinExist && document.getElementById(idOfElement).value < min) {
      alert(`Меньше минимума! \nМинимум: ${min}`)
      document.getElementById(idOfElement).value = oldValue
      return
    }
  }

  //изменение кнопкой
  onPlus(idOfElement) {
    const maxValueExists = document.getElementById(idOfElement).hasAttribute("max")
    const max = maxValueExists ? +document.getElementById(idOfElement).getAttribute("max") : 0
    const currentValue = document.getElementById(idOfElement).value * 1
    const { signsAfterDot, sizeOfStep } = this.getSizeOfStepForInput(idOfElement)
    if (maxValueExists && currentValue + sizeOfStep > max) {
      document.getElementById(idOfElement).value = max.toFixed(signsAfterDot)
      GameObject.getValueFromDOM(document.getElementById(idOfElement))
      return
    }
    document.getElementById(idOfElement).value = (currentValue + sizeOfStep).toFixed(signsAfterDot)
    GameObject.getValueFromDOM(document.getElementById(idOfElement))
  }

  //изменение кнопкой
  onMinus(idOfElement) {
    const minValueExists = document.getElementById(idOfElement).hasAttribute("min")
    const min = minValueExists ? +document.getElementById(idOfElement).getAttribute("min") : 0
    const currentValue = document.getElementById(idOfElement).value * 1
    const { signsAfterDot, sizeOfStep } = this.getSizeOfStepForInput(idOfElement)
    if (minValueExists && currentValue - sizeOfStep < min) {
      document.getElementById(idOfElement).value = min.toFixed(signsAfterDot)
      GameObject.getValueFromDOM(document.getElementById(idOfElement))
      return
    }
    document.getElementById(idOfElement).value = (currentValue - sizeOfStep).toFixed(signsAfterDot)
    GameObject.getValueFromDOM(document.getElementById(idOfElement))
  }
}

var interfaceUtils = new InterfaceUtils()