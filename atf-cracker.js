function checkValue(value) {
  if (value) {
    return "YES";
  } else {
    return "NO";
  }
}
function checkCorrection(item) {
  document.getElementById(item).value = document
    .getElementById(item)
    .value.replace(",", ".");
  document.getElementById(item).value = document
    .getElementById(item)
    .value.replace(" ", "+");
}
var response;
const ajax = {
  values: "",
  addValue(urlName, name) {
    if (values.length != 0) {
      values += "&";
    }
    values += urlName + "=" + name;
  },
  reset() {
    values = "";
  },
  send(url) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        response = JSON.parse(this.responseText);
        if (response.msg.includes("nenalezen")) {
          showAlert(3, "Uživatel nebyl nalezen v databázi!");
        } else if (response.msg.includes("OK")) {
          showAlert(2);
        } else {
          showAlert(3, "Nepodařilo se připojit k serveru!");
        }
      }
    };
    xhttp.open("GET", "https://atfonline.cz/" + url + ".php?" + values, true);
    xhttp.send();
  },
};

function sendSnap() {
  showAlert(1);
  checkCorrection("erroneous");
  checkCorrection("fromErroneous");
  checkCorrection("toErroneous");
  if (
    isNaN(document.getElementById("lection").value) ||
    parseInt(document.getElementById("lection").value) <= 0 ||
    isNaN(document.getElementById("snap").value) ||
    isNaN(document.getElementById("speed").value) ||
    isNaN(document.getElementById("erroneous").value)
  ) {
    showAlert(3, "Zkontrolujte formulář.");
    return false;
  }
  if (document.getElementById("speedRand").checked) {
    if (
      isNaN(document.getElementById("fromSpeed").value) ||
      isNaN(document.getElementById("toSpeed").value)
    ) {
      showAlert(3, "Zkontrolujte sekci náhodná rychlost.");
      return false;
    }
    document.getElementById("speed").value =
      Math.trunc(
        Math.random() *
          (parseInt(document.getElementById("fromSpeed").value) -
            parseInt(document.getElementById("toSpeed").value) +
            1)
      ) + parseInt(document.getElementById("toSpeed").value);
  }
  if (document.getElementById("erroneousRand").checked) {
    if (
      isNaN(document.getElementById("fromErroneous").value) ||
      isNaN(document.getElementById("toErroneous").value)
    ) {
      showAlert(3, "Zkontrolujte sekci náhodná chybovost.");
      return false;
    }
    document.getElementById("erroneous").value = (
      Math.random() *
        (parseFloat(document.getElementById("fromErroneous").value) -
          parseFloat(document.getElementById("toErroneous").value)) +
      parseFloat(document.getElementById("toErroneous").value)
    ).toFixed(2);
  }
  ajax.reset();
  ajax.addValue("username", document.getElementById("username").value);
  ajax.addValue("normal", "YES");
  ajax.addValue("lection", document.getElementById("lection").value);
  ajax.addValue("sublection", document.getElementById("sublection").value);
  ajax.addValue("snap", document.getElementById("snap").value);
  ajax.addValue("fortime", "-1");
  ajax.addValue("speed", document.getElementById("speed").value);
  ajax.addValue(
    "erroneous",
    parseFloat(document.getElementById("erroneous").value).toFixed(2)
  );
  ajax.addValue("corrmode", "YES");
  ajax.send("saveSnapResult");
  return false;
}
function sendSettings() {
  showAlert(1);
  checkCorrection("font");
  if (
    isNaN(document.getElementById("fontSize").value) ||
    isNaN(document.getElementById("timeMin").value)
  ) {
    showAlert(3, "Zkontrolujte formulář.");
    return false;
  } else {
    ajax.reset();
    ajax.addValue("username", document.getElementById("username").value);
    ajax.addValue(
      "corrmode",
      checkValue(document.getElementById("corrmode").checked)
    );
    ajax.addValue(
      "gensnap",
      checkValue(document.getElementById("gensnap").checked)
    );
    ajax.addValue(
      "errorsound",
      checkValue(document.getElementById("errorsound").checked)
    );
    ajax.addValue(
      "playmode",
      checkValue(document.getElementById("playmode").checked)
    );
    ajax.addValue(
      "movemode",
      checkValue(document.getElementById("movemode").checked)
    );
    ajax.addValue("timemin", document.getElementById("timeMin").value);
    ajax.addValue(
      "displaykeyboard",
      checkValue(document.getElementById("displaykeyboard").checked)
    );
    ajax.addValue(
      "displayhand",
      checkValue(document.getElementById("displayhand").checked)
    );
    ajax.send("saveEduProfile");
    showAlert(1);
    ajax.reset();
    ajax.addValue("username", document.getElementById("username").value);
    ajax.addValue("fontFamily", document.getElementById("font").value);
    ajax.addValue("fontSize", document.getElementById("fontSize").value);
    ajax.addValue("fontWeight", document.getElementById("fontWeight").value);
    ajax.addValue("fontStyle", document.getElementById("fontStyle").value);
    ajax.send("saveFontProfile");
    return false;
  }
}

function getInfo() {
  document.getElementsByClassName("result")[0].classList.add("display-none");
  showAlert(1);
  if (
    isNaN(document.getElementById("lection").value) ||
    parseInt(document.getElementById("lection").value) <= 0 ||
    isNaN(document.getElementById("snap").value)
  ) {
    document.getElementsByClassName("result")[0].classList.add("display-none");
    showAlert(3, "Zkontrolujte formulář.");
    return false;
  } else {
    ajax.reset();
    ajax.addValue("username", document.getElementById("username").value);
    ajax.addValue("lection", document.getElementById("lection").value);
    ajax.addValue("sublection", document.getElementById("sublection").value);
    ajax.addValue("snap", document.getElementById("snap").value);
    ajax.addValue("gensnap", "YES");
    ajax.addValue("widthchar", "1");
    ajax.send("atfSnap");
    setTimeout(function () {
      if (response.msg.includes("OK")) {
        document
          .getElementsByClassName("result")[0]
          .classList.remove("display-none");
        if (response.mrk == 0) {
          document.getElementsByClassName("result")[0].innerHTML = `
          <p>Splněno: <strong style="color: red">NE</strong></p>
        `;
        } else {
          document.getElementsByClassName("result")[0].innerHTML = `
          <p>Splněno: <strong style="color: green">ANO</strong> &nbsp;|&nbsp; Rychlost: <strong>${response.spd}</strong> &nbsp;|&nbsp; Chybovost: <strong>${response.err}</strong> &nbsp;|&nbsp; Známka: <strong>${response.mrk}</strong></p>
        `;
        }
      }
    }, 1000);
    return false;
  }
}

function getText() {
  document.getElementsByClassName("result")[0].classList.add("display-none");
  showAlert(1);
  if (
    isNaN(document.getElementById("lection").value) ||
    parseInt(document.getElementById("lection").value) <= 0 ||
    isNaN(document.getElementById("snap").value) ||
    isNaN(document.getElementById("width").value)
  ) {
    document.getElementsByClassName("result")[0].classList.add("display-none");
    showAlert(3, "Zkontrolujte formulář.");
    return false;
  } else {
    ajax.reset();
    ajax.addValue("username", document.getElementById("username").value);
    ajax.addValue("lection", document.getElementById("lection").value);
    ajax.addValue("sublection", document.getElementById("sublection").value);
    ajax.addValue("snap", document.getElementById("snap").value);
    ajax.addValue("gensnap", "YES");
    ajax.addValue("widthchar", document.getElementById("width").value);
    ajax.send("atfSnap");
    setTimeout(function () {
      if (response.msg.includes("OK")) {
        document
          .getElementsByClassName("result")[0]
          .classList.remove("display-none");
        document.getElementsByClassName("result")[0].innerText =
          response.txt.replace(new RegExp("~", "g"), " ");
      }
    }, 1000);
    return false;
  }
}
