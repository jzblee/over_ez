weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function gen() {
    var title = document.getElementsByName( 'title' )[0].value;
    var link = document.getElementsByName( 'link' )[0].value;
    var chair = document.getElementsByName( 'chair' )[0].value;
    var desc = document.getElementsByName( 'desc' )[0].value;

    var date = new Date( document.getElementsByName( 'date' )[0].value );
    var st = document.getElementsByName( 'start-time' )[0].value.split(':');
    var et = document.getElementsByName( 'end-time' )[0].value.split(':');
    var dayOfWeekStr = weekdays[date.getUTCDay()];
    var monthStr = months[date.getUTCMonth()];
    var dayStr = date.getUTCDate().toString();
    var st_hr = parseInt(st[0]);
    var st_min = st[1];
    var st_mer = '';
    var et_hr = parseInt(et[0]);
    var et_min = et[1];
    var et_mer = '';

    if ( st_hr > 11 ) {
        if ( st_hr > 12 ) st_hr -= 12;
        st_mer = 'pm';
    }
    else {
        if ( st_hr === '00' ) st_hr = 12;
        st_mer = 'am';
    }

    if ( et_hr > 11 ) {
        if ( et_hr > 12 ) et_hr -= 12;
        et_mer = 'pm';
    }
    else {
        if ( et_hr === '00' ) et_hr = 12;
        et_mer = 'am';
    }

    var timeStr = '';

    if ( st[0] !== '' ) {
        if ( st_min === '00' ) timeStr += st_hr + ' ' + st_mer;
        else timeStr += st_hr + ':' + st_min + ' ' + st_mer;
        if ( et[0] !== '' ) {
            timeStr += ' - ';
            if ( et_min === '00'  ) timeStr += et_hr + ' ' + et_mer;
            else timeStr += et_hr + ':' + et_min + ' ' + et_mer;
        }
    }
    else {
        timeStr = 'time TBD';
    }

    var dateStr = '';
    if ( date.toString() !== 'Invalid Date' )
        dateStr = dayOfWeekStr + ', ' + monthStr + ' ' + dayStr + ', ' + timeStr;
    else
        dateStr = 'date and time TBD';

    var output = '<li><strong>';
    if ( link !== '' ) {
        output += '<a target="_blank" href="' + link + '">';
    }
    if ( title !== '' ) {
        output += title;
    }
    else {
        output += 'No event title';
    }
    if ( link !== '' ) {
        output += '</a>';
    }
    output += '</strong>';
    if ( chair !== '' ) {
        output += ' (' + chair + ')';
    }
    output += '<br/>';
    output += dateStr;
    output += '<br/>';
    output += '<em>'
    if ( desc !== '' ) output += desc;
    else output += 'No description provided.'
    output += '</em>' + '</li>';

    document.getElementsByName( 'output' )[0].value = output;
    
}
