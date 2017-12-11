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
  loadConfig();
}

function loadConfig() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var config_json = JSON.parse(request.responseText);
        document.getElementById('signoff2').value =
          config_json.maintainer.first + ' "'
        + config_json.maintainer.nickname + '" '
        + config_json.maintainer.last;
        document.getElementById('svpName').value =
          config_json.svp.first;
        document.getElementById('svpEmail').value =
          config_json.svp.email;
        document.getElementById('fvpName').value =
          config_json.fvp.first;
        document.getElementById('fvpEmail').value =
          config_json.fvp.email;
        for (var i = 0; i < config_json.committees.length; i++) {
          spawnNewMeetingListingFull(config_json.committees[i].name,
                                     config_json.committees[i].time,
                                     config_json.committees[i].location);
        }
      }
  };
  request.open("GET", "config.json", true);
  request.send();
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
  digestDate.value = constructDateString(today(), '-', false);
}

function setDigestDateNextSunday() {
  var digestDate = document.getElementById('digestDate');
  digestDate.value = constructDateString(nextDayOfWeekOcurrence(0), '-', true);
}

function setEventDateNextDOWOccurence(elem, day) {
  var eventDate = elem.parentNode.getElementsByClassName('eventDate')[0];
  eventDate.value = constructDateString(nextDayOfWeekOcurrence(day), '-', true);
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
  var dateString = constructDateString(digestDate, '.', true);
  var digestCSS = document.getElementById('digestCSS').value;
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
  var messageBody = document.getElementById('messageBody').value;
  var signoff1 = document.getElementById('signoff1').value;
  var signoff2 = document.getElementById('signoff2').value;
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

  var meetings = genMeetingListings();

  var meetingsGDriveLink = '';
  var svpString = 'For more on upcoming service, contact ';
  if (svpName) {
    if (svpEmail) svpString += '<a href="mailto:' + svpEmail + '">';
    svpString += svpName;
    if (svpEmail) svpString += '</a>';
    svpString += ', the SVP';
  }
  else {
    svpString += 'the '
    if (svpEmail) svpString += '<a href="mailto:' + svpEmail + '">';
    svpString += 'SVP';
    if (svpEmail) svpString += '</a>';
  }
  svpString += '.';
  var fvpString = 'For more on upcoming fellowship, contact ';
  if (fvpName) {
    if (fvpEmail) fvpString += '<a href="mailto:' + fvpEmail + '">';
    fvpString += fvpName;
    if (fvpEmail) fvpString += '</a>';
    fvpString += ', the FVP';
  }
  else {
    fvpString += 'the '
    if (fvpEmail) fvpString += '<a href="mailto:' + fvpEmail + '">';
    fvpString += 'FVP';
    if (fvpEmail) fvpString += '</a>';
  }
  fvpString += '.';
  var contentStr =
      '      <tr>\n'
    + '        <td id="content">\n'
    + '          <h3>CHAPTER EVENTS</h3>\n'
    + '          <p class="deemphasize">Event signup sheets are linked where available. Unless noted otherwise, meet in the office 15 minutes prior to the start time.</p>\n'
    + '          ' + specialEvents + '\n'
    + '          <h3>UPCOMING SERVICE</h3>\n'
    + '          ' + serviceEvents + '\n'
    + '          <p class="deemphasize">' + svpString + '</p>\n'
    + '          <h3>UPCOMING FELLOWSHIP</h3>\n'
    + '          ' + fellowshipEvents + '\n'
    + '          <p class="deemphasize">' + fvpString + '</p>\n'
    + '          <h3>MEETINGS AND MINUTES</h3>\n'
    + '          <p>Meeting times and locations may change.</p>\n'
    + '          <ul>\n' + meetings + '\n'
    + '          </ul>\n'
    + '          <p>All minutes are available on <a target="_blank" href="' + meetingsGDriveLink + '">Google Drive</a>.</p>\n'
    + '        </td>\n'
    + '      </tr>\n';
  return contentStr;
}

function genEventGroup(groupElem, group) {
  var events = groupElem.getElementsByTagName('p');
  var eventGroupStr = '';
  if (events.length) {
    eventGroupStr += group
      ? '<ul class="eventlist">\n'
      : '<ul class="eventlist special">\n';
    for (var i = 0; i < events.length; i++) {
      eventGroupStr += 
        '            ' + genEventEntry(events[i]) + '\n';
    }
    eventGroupStr +=
        '          </ul>\n';
  }
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

function genMeetingListings() {
  var meetings = document.getElementById('groupMeetings').getElementsByTagName('p');
  var meetingsStr = '';
  if (meetings.length) {
    for (var i = 0; i < meetings.length; i++) {
      var name = meetings[i].getElementsByClassName( 'committeeName' )[0].value;
      var time = meetings[i].getElementsByClassName( 'committeeTime' )[0].value;
      var loc = meetings[i].getElementsByClassName( 'committeeLoc' )[0].value;
      meetingsStr += 
        '            <li><strong>' + name + '</strong> meets on <em>' + time + ' in ' + loc + '</em>.</li>\n';
    }
  }
  return meetingsStr;
}

function genFooter() {
  var footerStr =
      '      <tr>\n'
    + '        <td id="footer">\n'
    + '          <p><em>The goal of the weekly EZ Digest is to provide a concise summary of recent and upcoming chapter activities.</em></p>\n'
    + '          <p>Generated with <a href="https://github.com/jzblee/over_ez">Over EZ</a>. Please reply with any feedback.</p>\n'
    + '          <p>Alpha Phi Omega - Epsilon Zeta Chapter - Rensselaer Polytechnic Institute</p>\n'
    + '        </td>\n'
    + '      </tr>\n'
    + '    </table>\n'
    + '  </body>\n'
    + '</html>\n';
  return footerStr;
}

function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}

function constructDateString(date, separator, utc) {
  return utc
    ? date.getUTCFullYear() + separator + pad(date.getUTCMonth() + 1, 2) + separator + pad(date.getUTCDate(), 2)
    : date.getFullYear() + separator + pad(date.getMonth() + 1, 2) + separator + pad(date.getDate(), 2);
}

function constructMDYString(date, utc) {
  return utc
    ? months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()
    : months[date.getMonth()] + ' '  + date.getDate() + ', ' + date.getFullYear();

}

function spawnNewEvent(group) {
  nonce++;

  var newElement = '<p class="eventEntry">\n'
                 + '  <button type="button" class="removePrompt" onclick="removeEventPrompt(this)">Remove this event</button>\n'
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
                 + '</p>\n';

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

function spawnNewMeetingListing() {
  spawnNewMeetingListingFull('', '', '');
}

function spawnNewMeetingListingFull(name, time, loc) {
  nonce++;

  var newElement = '<p class="eventEntry">\n'
                 + '  <button type="button" class="removePrompt" onclick="removeEventPrompt(this)">Remove this listing</button>\n'
                 + '  <label for="committeeName_' + nonce + '">Group/Committee Name: </label><input class="eventDetails committeeName" id="committeeName_' + nonce + '" placeholder="Type the group/committee name here." value="' + name + '" />\n'
                 + '  <label for="committeeTime_' + nonce + '">Meeting Date:</label> <input class="eventDetails committeeTime" id="committeeTime_' + nonce + '" placeholder="Enter the day of week and time when this committee meets." value="' + time + '" />\n'
                 + '  <label for="committeeLoc_' + nonce + '">Meeting Location: </label><input class="eventDetails committeeLoc" id="committeeLoc_' + nonce + '" placeholder="Enter the building and room where this committee meets." value="' + loc + '" />\n'
                 + '</p>\n';
  document.getElementById('groupMeetings').insertAdjacentHTML('beforeend', newElement);
}

function removeEventPrompt(elem) {
  elem.insertAdjacentHTML('afterend', '<span class="removePrompt"><span class="removePromptQ">Are you sure?</span> | <span class="removePromptA" onclick="removeEventCancel(this)">no, cancel</span> | <span class="removePromptA" onclick="removeEvent(this)">yes, remove</span></span>');
  elem.remove();
}

function removeEventCancel(elem) {
  elem.parentNode.insertAdjacentHTML('afterend', '<button type="button" class="removePrompt" onclick="removeEventPrompt(this)">Remove this event</button>');
  elem.parentNode.remove();
}
function removeEvent(elem) {
  elem.parentNode.parentNode.remove();
}
