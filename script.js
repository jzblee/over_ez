weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

init();

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
  today();
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
  var digestDate = document.getElementById('digestDate');
  var todayDate = new Date(Date.now());
  digestDate.value = constructDateString(todayDate, "-", false);
}

function nextSunday() {
  var digestDate = document.getElementById('digestDate');
  today();
  var d = new Date(digestDate.value);
  while (d.getUTCDay() != 0) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  digestDate.value = constructDateString(d, "-", true);
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
    + '          <ul class="eventlist special">\n'
    + '            <li>Special events go here.</li>\n'
    + '          </ul>\n'
    + '          <h3>UPCOMING SERVICE</h3>\n'
    + '          <ul class="eventlist">\n'
    + '            <li>Upcoming service events go here.</li>\n'
    + '          </ul>\n'
    + '          <p class="deemphasize">' + svpString + '</p>\n'
    + '          <h3>UPCOMING FELLOWSHIP</h3>\n'
    + '          <ul class="eventlist">\n'
    + '            <li>Upcoming fellowship events go here.</li>\n'
    + '          </ul>\n'
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
