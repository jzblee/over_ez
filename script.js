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
    d.setDate(d.getUTCDate() + 1);
  }
  digestDate.value = constructDateString(d, "-", true);
}

function render() {
  document.getElementById('genButton').innerHTML = 'REGEN ADVISED';
  document.getElementById('genButton').style.color = '#f00';
  document.getElementById('output').style.backgroundColor = '#fdd';
  document.getElementById('outputText').style.backgroundColor = '#fdd';
  var renderWindow = window.open();
  renderWindow.document.write(document.getElementById('outputText').value);
}

function gen() {
  document.getElementById('genButton').innerHTML = 'GENERATE';
  document.getElementById('genButton').style.color = '#000';
  document.getElementById('renderButton').disabled = false;
  document.getElementById('output').style.backgroundColor = '#fff';
  document.getElementById('outputText').style.backgroundColor = '#fff';
  var output = "";
  output += genHeader();
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
    + '</html>\n'
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
