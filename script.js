console.info("Let's do some jQuery magic!");
/*
function hasWhiteSpace(s) {
	var stringLength = s.length;
	var spaceIndex = s.indexOf(' ');
	return spaceIndex >= 0 &&  spaceIndex < stringLength-1;
}
*/
function isPresent(selector, string) {

    if( string.length > 0 ) {
        $(selector).addClass('good-input');
    } else {
        $(selector).removeClass('good-input');
        $(selector).addClass('bad-input');
    }
}

function selectSex(pesel) {
    //console.info(pesel[9]);

    if( pesel[9] % 2 === 0 ) {
        //console.info("pesel -> female");
        $('#sexfemale').prop('checked', true);
    } else {
        //console.info("pesel -> male");
        $('#sexmale').prop('checked', true);
    }
}

function checkPeselValidity(p) {

    if( p < 210000000 ) {
        return false;
    }

    var weights = [ 1, 3, 7, 9, 1, 3, 7, 9, 1, 3, 1];
    var controlsum = 0;

    for( var i=0; i < 11; i++ ) {
        controlsum += weights[i] * p[i];
    }

    console.info(controlsum);

    if( controlsum % 10 === 0 ) {
        console.info("pesel poprawny");
        return true;
    } else {
        console.info("pesel niepoprawny");
        return false;
    }
}

function disableSendButton() {
    $('.btn').prop("disabled", true);
}

function enableSendButton() {
    $('.btn').prop("disabled", false);
}

function main() {

    $('.hint').hide();

    /* Dla imienia i nazwiska w jednym polu:

    $('#imi_naz').keyup( function() {

        var imieinazwisko = $(this).val();

        if( imieinazwisko.length > 1 && hasWhiteSpace(imieinazwisko) ) {
            $(this).addClass('good-input');
        } else {
            $(this).removeClass('good-input');
            $(this).addClass('bad-input');
        }

    });
    */

    $('#fname').keyup( function() {
        var firstname = $(this).val();

        isPresent(this, firstname);
    });

    $('#lname').keyup( function() {
        var lastname = $(this).val();

        isPresent(this, lastname);
    });

    var strongpassword;

	$('#passwd1').keyup( function() {

		var password1 = $(this).val();

        if( password1.length > 7 ) {
            $(this).addClass('weak-input');

            strongpassword = /[a-zA-Z]/.test(password1) && /\d/.test(password1);
            if( strongpassword === true ) {
                $(this).removeClass('weak-input');
                $(this).addClass('good-input');
                $('#passhint').animate({height: 'hide', opacity: 'hide'}, "slow");
            } else {
                $(this).removeClass('good-input');
                $(this).addClass('weak-input');
                $('#passhint').animate({height: 'show', opacity: 'show'}, "slow");
                disableSendButton();
            }
		} else {
			$(this).removeClass('good-input');
            $(this).removeClass('weak-input');
			$(this).addClass('bad-input');
            $('#passhint').animate({height: 'show', opacity: 'show'}, "slow");
            disableSendButton();
		}

	});

	var matchPasswords = function() {

		var password1 = $('#passwd1').val();
		var password2 = $(this).val();

		if( password1 === password2 && password2.length > 7 ) {
            if( strongpassword === true) {
                $(this).addClass('good-input');
                enableSendButton();
            } else {
                $(this).addClass('weak-input');
            }
		} else {
			$(this).removeClass('good-input');
			$(this).addClass('bad-input');
            disableSendButton();
		}

	};

    $('#passwd2').keyup(matchPasswords);
    $('#passwd2').click(matchPasswords);

    $('#bday').focusout( function() {

        var lowLimitDate = new Date('01/01/1900');
        var highLimitDate = new Date();

        var birthday = new Date( $(this).val() );

        if( birthday > lowLimitDate && birthday < highLimitDate ) {
            $(this).addClass('good-input');
            enableSendButton();
        } else {
            $(this).removeClass('good-input');
            $(this).addClass('bad-input');
            disableSendButton();
        }

    });

    var checkAvailability;

	$('#login').keyup( function() {

        var that = this;

        clearTimeout(checkAvailability);
        checkAvailability = setTimeout( function() {

            var login = $(that).val();

            if( login.length >= 1) {
                var check = "http://edi.iem.pw.edu.pl/bach/register/check/";
                var url = check + login;

                //console.info(url);

                $.ajax( url, {
                    success: function(responseText, statusText, jqXHR) {
                        //console.info(responseText);
                        var myresponse = JSON.parse(responseText);
                        var exists = myresponse[login];
                        //console.info(exists);

                        if( exists === false) {
                            $('#login').addClass('good-input');
                            $('#loginhint').animate({height: 'hide', opacity: 'hide'}, "slow");
                            enableSendButton();
                        } else {
                            $('#login').removeClass('good-input');
                            $('#login').addClass('bad-input');
                            $('#loginhint').animate({height: 'show', opacity: 'show'}, "slow");
                            disableSendButton();
                        }
                    }
                });

            } else {
                $('#login').removeClass('good-input');
                $('#login').addClass('bad-input');
            }

        }, 1000);


	});

	$('#pesel').keyup( function() {

		var pesel = $(this).val();

		if( pesel.length === 11 ) {
            if( checkPeselValidity(pesel) === true) {
                $(this).addClass('good-input');
                $('#peselhint').animate({height: 'hide', opacity: 'hide'}, "slow");
                enableSendButton();
                selectSex(pesel);
            }
		} else {
            $(this).removeClass('good-input');
            $(this).addClass('bad-input');
            $('#peselhint').animate({height: 'show', opacity: 'show'}, "slow");
            disableSendButton();
        }

	});

}

$(document).ready(main);
