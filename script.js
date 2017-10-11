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
}

function today() {
  var digestDate = document.getElementById('digestDate');
  digestDate.value = new Date(Date.now()).toISOString().slice(0, 10);
}

function nextSunday() {
  var digestDate = document.getElementById('digestDate');
  if(!digestDate.value) today();
  var d = new Date(digestDate.value);
  while (d.getUTCDay() != 0) {
    d.setDate(d.getDate() + 1);
  }
  digestDate.value = d.toISOString().slice(0, 10);
}
