function sendData() {
            document.getElementById("erroneous").value = (document.getElementById("erroneous").value).replace(",", ".");
            if (isNaN(document.getElementById("lection").value) || isNaN(document.getElementById("snap").value) || isNaN(document.getElementById("speed").value) || isNaN(document.getElementById("erroneous").value)) {
                alert("Požadavek se nepodařilo odeslat, zkontrolujte formulář.");
                return false;
            }
            if (document.getElementById("rand").checked) {
                if (isNaN(document.getElementById("from").value) || isNaN(document.getElementById("to").value)) {
                    alert("Požadavek se nepodařilo odeslat, zkontrolujte formulář. Chyba bude nejspíše v sekci: Náhodná rychlost");
                    return false;
                }
                document.getElementById("speed").value = Math.trunc(Math.random() * (parseInt(document.getElementById("from").value) - parseInt(document.getElementById("to").value) + 1)) + parseInt(document.getElementById("to").value);
            }
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText.includes("nenalezen")) {
                        alert("Uživatel nebyl nalezen v databázi!");
                    } else if (this.responseText.includes("OK")) {
                        alert("Požadavek byl úspěšně odeslán!");
                    } else {
                        alert("Požadavek se nepodařilo odeslat!");
                    }
                }
            }
            xhttp.open("GET", "https://www.atfonline.cz/saveSnapResult.php?username=" + document.getElementById("username").value + "&normal=YES&lection=" + document.getElementById("lection").value + "&sublection=" + document.getElementById("sublection").value + "&snap=" + document.getElementById("snap").value + "&fortime=-1&speed=" + document.getElementById("speed").value + "&erroneous=" + (parseFloat(document.getElementById("erroneous").value)).toFixed(2) + "&corrmode=YES", true);
            xhttp.send();
            return false;
}
