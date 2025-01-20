import './style.css'

// * ------------------------------------------------------------------------
// * ----------------------------VARIABLES-----------------------------------
// * ------------------------------------------------------------------------

// ? ACCESO A ELEMENTOS DEL DOM
const promtInput = document.getElementById('promtInput');
const divPrompt = document.querySelector('.prompt.hidden')
const terminal = document.getElementById('terminal');
const terminalWindow = document.getElementById('terminalWindow');
const elementosDeInicio = document.querySelectorAll('.array')
const elementoAnimado = document.getElementById('terminalWindow');

// ? Vatiables de uso global
let textInicio = []
let idInterval
let indiceElement = 0

// ? Cracion de Objeto para uso de animacion de caracteres
/* COMO FUNCIONA
  * Se recorren todos los elementos con la clase "array", para animarlos mas tarde
  
  ? Se agrega a el array objetos, con una estructura espesifica para usarlos luego
    ? En "elementHtml" se guarda que tipo de elemento estamos iterando
    ? En "text" se alamacena el contenido de esa etiqueta
    
  * Se resetea el elemento con el que ya se estrajo la informacion, esto para que luego cuando se anime no se duplique la indormacion
*/

elementosDeInicio.forEach((element, indice, parent) => {

  textInicio[indice] = {
    elementHtml: `${element.nodeName}`,
    text: `${element.innerText}`,
  }
  elementosDeInicio[indice].innerText = ''
}); // ? -------------------------END----------------------------------



// TODO----------------------------------------------------------------------
// TODO---------------------------FUNCIONES----------------------------------
// TODO----------------------------------------------------------------------

// !-----------FUNCTION animPrintCaracter-----------------
/*
* Saca la clase "hidden" de la terminal
* Saca la clase "hidden" del divPrompt

? Crea un nuevo intervalo cada 2s que va a ejecutar una funcion flecha
? Si el caracter que se esta pintando es el ultimo, se incrementa el indice que hace referencia al elemento trabajado
? Si se llego al ulimo elemento, significa que ya se termino de pintar todo lo permitido. Se elimina el intervalo.
    ? Si todavia no se llego al ultimo caracter de la lista a recorrer, se va a seguir agregando caracteres al elemento
*/

function animPrintCaracter() {
  terminal.classList.remove('hidden')
  divPrompt.classList.remove('hidden')

  idInterval = setInterval(() => {
    if (elementosDeInicio[indiceElement].textContent.length == textInicio[indiceElement].text.length) {
      indiceElement++

      if (indiceElement == elementosDeInicio.length) {
        clearInterval(idInterval)
        return
      }
    }
    elementosDeInicio[indiceElement].textContent += textInicio[indiceElement].text[elementosDeInicio[indiceElement].textContent.length]
  }, 20)
}; // !--------------------END-------------------------------



// !-----------FUNCTION selectCommandBlock -----------

/* COMO FUNCIONA
* Esta funcion revie como parametro "commandUser", que va a ser la entrada del usuario
* Transforma la entrada del usuario a minusculas
 
? Creamos un switch para la entrada del usuario 
*/

const selectCommandBlock = (commandUser) => {
  const lowerCommand = commandUser.toLowerCase()
  switch (lowerCommand) {
    case 'help':
      return getCommandTemplate(lowerCommand)
    case 'clear':
      return clearCommand()
    case 'about':
      return getCommandTemplate(lowerCommand)
    case '':
      break
    default:
      return notFoundCommand(commandUser)
  }
} // !-------------------END----------------------------



// !-----------FUNCTION enterCommand -----------------

/* COMO FUNCIONA enterCommand
* Se crea un clon del element y sus hijos con el id "promptClone".
* Se elimina la clase "hiden" del elemento clonado.

? Si lo que introdujo el usuario no fue "clear" se ejecuta el bloque de codigo.
? Se agrega al elemento hijo con la clase "promptCloneInput" del elemento clonado, lo que agrego el usuario.
? Se le elimina el id al elemento clonado
? Se agrega el elemento clonado al contenido de la terminal

? Si lo que agrego el usuario es distinto a un Enter vacio, se:
? Agrega los bloques html correspondientes a un div del clon del elemento. Llamando la funcion "selectCommandBlock"

* Resetea el contenido del input
* Si el contenido de la terminal excede su tamaño, deja al input visible al final.
*/

const enterCommand = (event) => {

  const clonElemento = document.getElementById('promptClone').cloneNode(true);
  clonElemento.classList.remove('hidden');

  if (event.target.value != 'clear') {
    clonElemento.getElementsByClassName('promptCloneInput')[0].innerHTML = event.target.value;
    clonElemento.setAttribute('id', null);
    terminal.appendChild(clonElemento)
  }

  if (event.target.value != '') clonElemento.getElementsByClassName('promptCloneContent')[0].appendChild(selectCommandBlock(event.target.value));

  promtInput.value = ''
  promtInput.scrollIntoView({ block: 'start' })
} // !-------------------END----------------------------


// !-----------FUNCTION getCommandTemplate -----------
/* 
* Recive 1 parametro llamado "commandUser"
* Se guarda en element una copia del elemento html con el id que sea igual al dato ingresado por el user
* Se borra la clase "hidden" de ese elemento
* Se borra el id tambien del mismo
* Se retorna el elemento clonado 
 */
const getCommandTemplate = (commandUser) => {
  const element = document.getElementById(commandUser).cloneNode(true)
  element.classList.remove('hidden')
  element.setAttribute('id', null)
  return element
} // !-------------------END----------------------------



// !-----------FUNCTION clearCommand -----------------

/* COMO FUNCIONA
* Se limpia todo el contenido de la terminal
* Se crea un span que se guarda en "element"
* Se devuelve "element"
*/

const clearCommand = () => {
  terminal.innerHTML = ''
  const element = document.createElement('span')
  return element
} // !-------------------END----------------------------



// !-----------FUNCTION notFoundCommand --------------
/* COMO FUNCIONA
* Recibe 1 parametro
* Guarda en "element" un nuevo span
* Le agrega codigo al span, el codigo que representa al error cuando el comando no se reconoce
  * Se agrega al span a clase "error", para que se le agregen los estilos correspondientes
  * Se devuelve element
*/

const notFoundCommand = (commandUser) => {
  const element = document.createElement('span')
  element.innerText = `-bash: ${commandUser}: command not found`
  element.classList.add('error')
  return element
} // !-------------------END----------------------------

// TODO----------------------------------------------------------------------
// TODO-----------------------END FUNCIONES----------------------------------
// TODO----------------------------------------------------------------------


// ? ------------------------------------------------------------------------
// ? ----------------SETEOS DE CONFIGURACION INICIAL-------------------------
// ? ------------------------------------------------------------------------

promtInput.focus();
terminalWindow.addEventListener('click', () => promtInput.focus());

// ? ------------------------------------------------------------------------
// ? -----------------------------MAIN---------------------------------------
// ? ------------------------------------------------------------------------
// * Cuando la animacion de "elementoAnimado" termine, va a ejecutar la funcion "myEndFunction"

elementoAnimado.addEventListener('animationend', animPrintCaracter)

// ? -------------------------------------------------------------------------
// ? ---------------------ENTRADA DEL USUARIO---------------------------------
// ? -------------------------------------------------------------------------

// * Cuando el usuario precione enter, se va a ejecutar la funcion enterCommand
promtInput.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    enterCommand(event);
  }
})