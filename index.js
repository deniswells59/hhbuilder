/**
  Developed on Google Chrome (Version 63.0.3239.132)
*/

(function() {

  var formEl      = document.querySelector('form'),
      addButton   = document.querySelector('.add'),
      houseListEl = document.querySelector('.household'),
      debug       = document.querySelector('.debug'),
      inputEls    = getInputEls(),
      errMsgEl    = createErrorMessage(),

      /* Stores House List */
      dataStore   = [];

  var errMessageLib = {
    missingField: 'Missing required fields. Please try again.',
    invalidAge:   'Invalid age. Please try again.'
  }

  /* Event Handlers */
  function addEvents() {
    addButton.addEventListener('click', addMemberToList);
    formEl.addEventListener('submit', formSubmit);
  }

  /**
     * Attempts to add member. Checks validation first.
     * @param {DOM Event} event Click Event
     */
  function addMemberToList(event) {
    event.preventDefault();
    removeErrorMessages();

    var formValues = getFormValues();

    var isValid = formValidation(formValues);
    if(isValid) {
      addMember(formValues);
      clearInputs();
    }
  }

  /**
     * "Posts" data store to "Server".
     * Just displays the array...
     * @param {DOM Event} event Click Event
     */
  function formSubmit(event) {
    event.preventDefault();
    var dataString = formatData();

    debug.innerHTML = dataString
    debug.style.display = 'block';
  }



  /**
    //////////////////////////////////////////////
    ////       Form Validation Helpers        ////
    //////////////////////////////////////////////

     * Validates form. Checks for requirements using helper functions.
     *
     * @param {Object} formValues stores value of each input element
     * @return {Boolean} results of both helper functions
     */
  function formValidation(formValues) {
    var hasRequiredFields = checkFormValues(formValues),
        hasValidAge       = checkValidAge(formValues);

    /* Show Error
       Hardcoded error because this can only mean one thing */
    if(hasRequiredFields && !hasValidAge) showError('age', errMessageLib.invalidAge);

    return hasRequiredFields && hasValidAge;
  }

  /**
     * Loops through EACH value to check for ANY value.
     * @param {Object} formValues stores value of each input element
     * @return {Boolean} result of all inputs.
     */
  function checkFormValues(formValues) {
    for(var inputKey in formValues) {
      var inputValue = formValues[inputKey];

      if(!hasValue(inputValue)) {
        /* Show Error
           Dynamic error because this can only mean multiple things */
        showError(inputKey, errMessageLib.missingField);

        return false;
      }
    }

    return true; // If all inputs have value, return true
  }

  /**
     * Checks if string if truthy or if it has a boolean from
     * the checkbox.
     * @param {String|Boolean} data value of one input, select, or checkbox
     * @return {Boolean} results of one input
     */
  function hasValue(data) {
    return data.length > 0 || typeof data === typeof false;
  }

  /**
     * Checks if age is type of number and above 0.
     * @param {Object} formValues stores value of each input element
     * @return {Boolean} result
     */
  function checkValidAge(formValues) {
    var num;

    if(formValues && formValues['age']) { // Safe > Sorry
      num = parseInt(formValues['age']);
    }

    return !isNaN(parseInt(num)) && num > 0;
  }



  /**
      //////////////////////////////////////////////
      ////        Error Message Helpers         ////
      //////////////////////////////////////////////

     * Creates an elemnt for cloning. This doesn't have to be very
     * unique, much easier to get a deep clone and modify when needed.
     * @return {Element} styled element available for copy when needed
     */
  function createErrorMessage() {
    var errMsgEl    = document.createElement('div')
    var errMsgStyle = 'display:inline;margin-left:2px;color:#dc0707;';

    errMsgEl.style     = errMsgStyle;
    errMsgEl.className = 'err-message';

    return errMsgEl;
  }

  /**
     * Loops through EACH value to check for ANY value.
     * @param {String} elKey the key of the input element that caused the error
     * @param {String} msg   message to prompt user
     */
  function showError(elKey, msg) {
    var el = getElFromKey(elKey); // Input element where the error occurs

    var newErr = errMsgEl.cloneNode(false);
    newErr.innerHTML = msg;

    insertAfter(newErr, el);
  }

  function removeErrorMessages() {
    removeElementsByClass('err-message'); // Removes all errors via class
  }



  /**
      //////////////////////////////////////////////
      ////         House List Helpers           ////
      //////////////////////////////////////////////

     * Function that adds member to house list. Adds id to values.
     * Adds member to DOM and to local data store.
     * @param {Object} values stores value of each input element
     */
  function addMember(values) {
    var id = Date.now().toString(); // Creates ID for data-tracking
    values.id = id;

    var li = createMemberLi(values);

    dataStore.push(values);
    houseListEl.appendChild(li);
  }

  /**
     * Creates, styles, and adds cotent to <li>. Very customized,
     * element, much easier to create new than clone everytime.
     * @param {Object} values stores value of each input element
     */
  function createMemberLi(values) {
    var li = document.createElement('li'),
        button = document.createElement('button'),
        innerHTML = 'Relation: ' + values.rel + ' Age: ' + values.age +
                    ' Smoker: ' + values.smoker;

    li.dataset.id = values.id;
    li.innerHTML = innerHTML;
    li.appendChild(button);

    button.innerHTML = 'Remove';
    button.addEventListener('click', removeMember);

    return li;
  }

  /**
     * Removes from dom and uses helper function to
     * remove from local data store.
     * @param {DOM Event} event click event
     */
  function removeMember(event) {
    var button = event.target;
    var member = button.parentNode;
    var id     = member.dataset.id;

    removeMemberFromDataStore(id);
    houseListEl.removeChild(member);
  }

  function removeMemberFromDataStore(id) {
    dataStore = dataStore.filter(function(d) {
      return d.id !== id;
    })
  }



  //////////////////////////////////////////////
  ////              DOM Helpers             ////
  //////////////////////////////////////////////

  // Same as jQuery's .after()
  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function getInputEls() {
    if(inputEls) return inputEls;

    return {
      age:    document.querySelector('input[name="age"]'),
      rel:    document.querySelector('select'),
      smoker: document.querySelector('input[name="smoker"]'),
    }
  }

  function clearInputs() {
    var inputs = getInputEls();

    inputs.smoker.checked = false;
    inputs.age.value      = '';
    inputs.rel.value      = '';
  }



  //////////////////////////////////////////////
  ////             Other Helpers            ////
  //////////////////////////////////////////////

  function getElFromKey(key) {
    var formDataEls = getInputEls();

    return formDataEls[key];
  }

  function getFormValues() {
    var formDataEls = getInputEls();

    var formDataVals = {
      age: formDataEls.age.value,
      rel: formDataEls.rel.value,
      smoker: formDataEls.smoker.checked,
    }

    return formDataVals;
  }

  function formatData() {
    var dataString = JSON.stringify(dataStore);

    // Prettifies Array
    // This could be Regex, but I'm working for free here...
    dataString = dataString.split(',"').join(',\n&#9;"');
    dataString = dataString.split('[{').join('[{\n&#9;');
    dataString = dataString.split('{"').join('{\n&#9"');
    dataString = dataString.split('}').join('\n}');

    return dataString;
  }

  // Init Events
  addEvents();
})();
