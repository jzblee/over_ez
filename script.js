daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

init();

var nonce = 0;

function init() {
  var fieldsets = document.getElementsByTagName('fieldset');
  for (var i = fieldsets.length - 1; i >= 0; i--) {
    fieldsets[i].onmouseover = function() {
      this.getElementsByTagName('legend')[0].style.borderColor = 'threedhighlight';
      this.style.borderColor = 'threedhighlight'
    };
    fieldsets[i].onmouseout = function() {
      this.getElementsByTagName('legend')[0].style.borderColor = 'threedface';
      this.style.borderColor = 'threedface'
    };
  }
  var output = document.getElementById('output');
  output.onmouseover = function() {
    this.style.borderColor = 'threedhighlight'
  };
  output.onmouseout = function() {
    this.style.borderColor = 'threedface'
  };
  setDigestDateToday();
  var formInputs = document.getElementsByTagName('form')[0].getElementsByTagName('input');
  for (var i = formInputs.length - 1; i >= 0; i--) {
    formInputs[i].onmouseover = function() {
      this.style.backgroundColor = '#eee'
    };
    formInputs[i].onmouseout = function() {
      this.style.backgroundColor = '#ddd'
    };
  }
  var textAreas = document.getElementsByTagName('form')[0].getElementsByTagName('textarea');
  for (var i = textAreas.length - 1; i >= 0; i--) {
    textAreas[i].onmouseover = function() {
      this.style.backgroundColor = '#eee'
    };
    textAreas[i].onmouseout = function() {
      this.style.backgroundColor = '#ddd'
    };
  }
}

function today() {
  return new Date(Date.now());
}

function nextDayOfWeekOcurrence(dayOfWeek) {
  var d = new Date(Date.now());
  while (d.getUTCDay() != dayOfWeek) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

function setDigestDateToday() {
  var digestDate = document.getElementById('digestDate');
  digestDate.value = constructDateString(today(), "-", false);
}

function setDigestDateNextSunday() {
  var digestDate = document.getElementById('digestDate');
  digestDate.value = constructDateString(nextDayOfWeekOcurrence(0), "-", true);
}

function setEventDateNextDOWOccurence(elem, day) {
  var eventDate = elem.parentNode.getElementsByClassName('eventDate')[0];
  eventDate.value = constructDateString(nextDayOfWeekOcurrence(day), "-", true);
}

function render() {
  document.getElementById('renderButton').innerHTML = 'REGEN ADVISED';
  document.getElementById('renderButton').style.color = '#f00';
  document.getElementById('output').style.backgroundColor = '#fdd';
  document.getElementById('outputText').style.backgroundColor = '#fdd';
  var renderWindow = window.open();
  renderWindow.document.write(document.getElementById('outputText').value);
}

function gen() {
  document.getElementById('renderButton').innerHTML = 'RENDER';
  document.getElementById('renderButton').style.color = '#000';
  document.getElementById('renderButton').disabled = false;
  document.getElementById('output').style.backgroundColor = '#fff';
  document.getElementById('outputText').style.backgroundColor = '#fff';
  var output = "";
  output += genHeader();
  if (document.getElementById('enableMessage').checked)
    output += genMessage();
  output += genContent();
  output += genFooter();
  document.getElementById('outputText').value = output;
}

function genHeader() {
  var digestDate = new Date(document.getElementById('digestDate').value);
  var dateString = constructDateString(digestDate, ".", true);
  var digestCSS = document.getElementById("digestCSS").value;
  var mdyString = constructMDYString(digestDate, true);
  var headerStr =
      '<!doctype HTML>\n'
    + '<html lang="en">\n'
    + '  <head>\n'
    + '    <title>EZ Digest - ' + dateString + '</title>\n'
    + '    <link rel="stylesheet" type="text/css" href="' + digestCSS + '">\n'
    + '  </head>\n'
    + '  <body>\n'
    + '    <table id="wrapper">\n'
    + '      <tr>\n'
    + '        <td id="header">\n'
    + '          EZ Digest - ' + mdyString + '\n'
    + '        </td>\n'
    + '      </tr>\n';
  return headerStr;
}

function genMessage() {
  var messageBody = document.getElementById("messageBody").value;
  var signoff1 = document.getElementById("signoff1").value;
  var signoff2 = document.getElementById("signoff2").value;
  var messageStr =
      '      <tr>\n'
    + '        <td id="message">\n'
    + '          ' + messageBody.replace(/\r?\n/g, '<br />') + '\n'
    + '        </td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td id="signoff">\n'
    + '          <em>' + signoff1 + '<br/>' + signoff2 + '</em>\n'
    + '        </td>\n'
    + '      </tr>\n';
  return messageStr;
}

function genContent() {
  var svpName = document.getElementById('svpName').value;
  var svpEmail = document.getElementById('svpEmail').value;
  var fvpName = document.getElementById('fvpName').value;
  var fvpEmail = document.getElementById('fvpEmail').value;
  var specialEvents = genEventGroup(document.getElementById('groupSpecialEvents'), 0);
  var serviceEvents = genEventGroup(document.getElementById('groupServiceEvents'), 1);
  var fellowshipEvents = genEventGroup(document.getElementById('groupFellowshipEvents'), 2);

  var meetingsGDriveLink = '';
  var svpString = 'For further information on upcoming service events, contact the Service Vice President';
  if (svpName) {
    svpString += ', ' + svpName;
  }
  if (svpEmail) {
    if (svpName) svpString += ','
    svpString += ' at <a href="mailto:' + svpEmail + '">' + svpEmail + '</a>';
  }
  svpString += '.';
  var fvpString = 'For further information on fellowship service events, contact the Fellowship Vice President';
  if (fvpName) {
    fvpString += ', ' + fvpName;
  }
  if (fvpEmail) {
    if (fvpName) fvpString += ','
    fvpString += ' at <a href="mailto:' + fvpEmail + '">' + fvpEmail + '</a>';
  }
  fvpString += '.';
  var contentStr =
      '      <tr>\n'
    + '        <td id="content">\n'
    + '          <h3>CHAPTER EVENTS</h3>\n'
    + '          <p class="deemphasize">If an event has a signup sheet, you can click on the title to go to the sheet. For all events, meet in the office 15 minutes prior to the start time, unless noted otherwise.</p>\n'
    + '          ' + specialEvents + '\n'
    + '          <h3>UPCOMING SERVICE</h3>\n'
    + '          ' + serviceEvents + '\n'
    + '          <p class="deemphasize">' + svpString + '</p>\n'
    + '          <h3>UPCOMING FELLOWSHIP</h3>\n'
    + '          ' + fellowshipEvents + '\n'
    + '          <p class="deemphasize">Notices for impromptu fellowship events will be posted on our Facebook group.</p>\n'
    + '          <p class="deemphasize">' + fvpString + '</p>\n'
    + '          <h3>MEETINGS AND MINUTES</h3>\n'
    + '          <p>Meeting times and locations may change.</p>\n'
    + '          <ul>\n'
    + '            <li>Meeting locations and times go here.</li>\n'
    + '          </ul>\n'
    + '          <p>All minutes are available on <a target="_blank" href="' + meetingsGDriveLink + '">Google Drive</a>.</p>\n'
    + '        </td>\n'
    + '      </tr>\n';
  return contentStr;
}

function genEventGroup(groupElem, group) {
  var events = groupElem.getElementsByTagName('p');
  var eventGroupStr = group
    ? '<ul class="eventlist">\n'
    : '<ul class="eventlist special">\n';
  for (var i = 0; i < events.length; i++) {
    eventGroupStr += 
      '            ' + genEventEntry(events[i]) + '\n';
  }
  eventGroupStr +=
      '          </ul>\n';
  return eventGroupStr;
}

function genEventEntry(event) {
    var title = event.getElementsByClassName( 'eventName' )[0].value;
    var link = event.getElementsByClassName( 'eventLink' )[0].value;
    var chair = event.getElementsByClassName( 'eventChairs' )[0].value;
    var desc = event.getElementsByClassName( 'eventDesc' )[0].value;

    var date = new Date( event.getElementsByClassName( 'eventDate' )[0].value );
    var st = event.getElementsByClassName( 'eventStartTime' )[0].value.split(':');
    var et = event.getElementsByClassName( 'eventEndTime' )[0].value.split(':');
    var dayOfWeekStr = daysOfWeek[date.getUTCDay()];
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
    if ( desc !== '' ) {
      output += '<br/><em>'
      output += desc;
      output += '</em>';
    }
    output += '</li>';

    return output;
    
}

function genFooter() {
  var footerStr =
      '      <tr>\n'
    + '        <td id="footer">\n'
    + '          <p><em>The goal of the weekly EZ Digest is to provide a concise summary of recent and upcoming chapter activities.</em></p>\n'
    + '          <p>Unlike eggs, digests are always better when they\'re <a href="https://github.com/jzblee/over_ez">Over EZ</a>.</p>\n'
    + '          <p>Feel free to reply to this message with any comments or suggestions!</p>\n'
    + '          <p>Alpha Phi Omega - Epsilon Zeta Chapter - Rensselaer Polytechnic Institute</p>\n'
    + '        </td>\n'
    + '      </tr>\n'
    + '    </table>\n'
    + '  </body>\n'
    + '</html>\n';
  return footerStr;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function constructDateString(date, separator, utc) {
  return utc
    ? date.getUTCFullYear() + separator + pad(date.getUTCMonth() + 1, 2) + separator + pad(date.getUTCDate(), 2)
    : date.getFullYear() + separator + pad(date.getMonth() + 1, 2) + separator + pad(date.getDate(), 2);
}

function constructMDYString(date, utc) {
  return utc
    ? months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear()
    : months[date.getMonth()] + " "  + date.getDate() + ", " + date.getFullYear();

}

function spawnNewEvent(group) {
  nonce++;

  var newElement = '<p class="eventEntry">\n'
                 + '  <label for="eventName_' + nonce + '">Event Name: </label><input class="eventDetails eventName" id="eventName_' + nonce + '" placeholder="Type the event name here." />\n'
                 + '  <label for="eventLink_' + nonce + '">Event Link: </label><input class="eventDetails eventLink" id="eventLink_' + nonce + '" placeholder="Enter the event signup link here (optional)." />\n'
                 + '  <label for="eventChairs_' + nonce + '">Event Chairs: </label><input class="eventDetails eventChairs" id="eventChairs_' + nonce + '" placeholder="List all of the event chairs here (optional)." />\n'
                 + '  <label for="eventDate_' + nonce + '">Event Date:</label> <input class="eventDate" type="date" id="eventDate_' + nonce + '" />\n'
                 + '  <span>Set to...</span>\n'
                 + '  <button type="button" onclick="setEventDateNextDOWOccurence(this, 0)">U</button>\n'
                 + '  <button type="button" onclick="setEventDateNextDOWOccurence(this, 1)">M</button>\n'
                 + '  <button type="button" onclick="setEventDateNextDOWOccurence(this, 2)">T</button>\n'
                 + '  <button type="button" onclick="setEventDateNextDOWOccurence(this, 3)">W</button>\n'
                 + '  <button type="button" onclick="setEventDateNextDOWOccurence(this, 4)">R</button>\n'
                 + '  <button type="button" onclick="setEventDateNextDOWOccurence(this, 5)">F</button>\n'
                 + '  <button type="button" onclick="setEventDateNextDOWOccurence(this, 6)">S</button>\n'
                 + '  <br/>\n'
                 + '  <label for="eventStartTime_' + nonce + '">Start Time:</label> <input class="eventTime eventStartTime" type="time" id="eventStartTime_' + nonce + '" />\n'
                 + '  <label for="eventEndTime_' + nonce + '">End Time:</label> <input class="eventTime eventEndTime" type="time" id="eventEndTime_' + nonce + '" />\n'
                 + '  <br/>\n'
                 + '  <label for="eventDesc_' + nonce + '">Event Description: </label><input class="eventDetails eventDesc" id="eventDesc_' + nonce + '" placeholder="Enter the event description (optional)." />\n'
                 + '</p>\n'

  var elem;
  switch(group) {
    case 0:
      elem = document.getElementById('groupSpecialEvents');
    break;
    case 1:
      elem = document.getElementById('groupServiceEvents');
    break;
    case 2:
      elem = document.getElementById('groupFellowshipEvents');
    break;
    default:
  }
  elem.insertAdjacentHTML('beforeend', newElement);
}
