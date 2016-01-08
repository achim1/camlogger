/*
 * user interface convenience functions
 *
 */

function getCSRFToken(elementid){
    /*
     * Get the crsftoken which is an element of 
     * the datepicker form
     */
    var token = $(elementid).find(':hidden').attr('value');
    return token;
};

/*************************************/

function GetDate(elementid) {
        var date  = $(elementid).datepicker('getDate');
        if (date != null){
        return date
        }
        else{
        RaiseNoDateError();
        }
}

/************************************/

function GetBinning(elementid) {
        var bins = $(elementid).val();
        console.log("Got" + bins + "bins");
        return bins;
        }

/*************************************/

function RaiseNoDateError(){
    // make the user aware that he/she entered a bad date
    $("#no-date-error").show("scale", {}, 500,function(){});
}

/**************************************/

function ApplyDatePicker () {
    // apply jquery ui datepicker to form element

    $("#from").datepicker({
    defaultDate: new Date(),
    changeMonth: true,
    numberOfMonths: 1,
    changeYear: true,
    onClose: function( selectedDate ) {
    $( "#to" ).datepicker( "option", "minDate", selectedDate );
    }
    });
    $( "#to" ).datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    changeYear: true,
    defaultDate: new Date(),
    numberOfMonths: 1,
    onClose: function( selectedDate ) {
    $( "#from" ).datepicker( "option", "maxDate", selectedDate );
    }
    });
}

/************************************/

function NewWindow() {

    newwin = window.open();
    return newwin
}
