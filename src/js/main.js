import { generatePdf } from './pdf-util'
import pdfBase from '../certificate.pdf'

console.log("Main")

function make_date_str(today) {

  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var today_str = dd + '/' + mm + '/' + yyyy;
  return today_str
}

function make_time_str(today) { 
  return String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0')
}


const today = new Date()
var today_str = make_date_str(today)
var time_str_1 = make_time_str(today)
today.setHours(today.getHours() + 1) 
var time_str_2 =  make_time_str(today)

/***** Fill your data here *****/

// It will generate a first certicate where heure de sortie is  generation time and reason 1
// Followed by a second certicate where heure de sortie is generation time and reason 2
var profile1 = 
	{    
        "address": "8 rue des bains",
	"birthday": "24/11/1967",
	"city": "Antibes",
	"datesortie": today_str,
	"firstname": "Sylvain",
	"heuresortie": time_str_1,
	"lastname": "Yolo",
	"placeofbirth": "Paris",
	"zipcode": "06600"
	}  
	

// const reason1 =  "travail"
// const reason1 =  "achats"
// const reason1 =  "sante"
// const reason1 =  "famille"
// const reason1 =  "handicap"
const reason1 =  "sport_animaux"
// const reason1 =  "convocation"
// const reason1 =  "missions"
// const reason1 =  "enfants"


// const reason2 =  "travail"
const reason2 =  "achats"
// const reason2 =  "sante"
// const reason2 =  "famille"
// const reason2 =  "handicap"
// const reason2 =  "sport_animaux"
// const reason2 =  "convocation"
// const reason2 =  "missions"
// const reason2 =  "enfants"

/***** Fill your data here *****/

var profile2 = profile1
var profile2 = Object.assign({}, profile1); // deep copy
profile2["heuresortie"] = time_str_2
 

generatePdf(profile1, reason1, pdfBase)
// https://stackoverflow.com/questions/18239430/cannot-set-property-innerhtml-of-null
// https://stackoverflow.com/questions/37951999/error-message-innerhtml-is-not-a-function
var node = document.getElementById('status');
node.innerHTML = '<p>Certificate 1 generated</p>';

generatePdf(profile2, reason2, pdfBase)
node.innerHTML = '<p>Certificate 1 and 2 generated. Browser can be close<br>Thanks for using</p>';

// set downloadBlob in generatePdf otheriwse issue with async, it download before generation endee

// 
function getParameterByName(name, url = window.location.href) {
    console.log(url)
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}   
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var foo = getParameterByName('foo'); // "lorem"
node.innerHTML = foo;


// http://localhost:1234/?address=8 rue des bains&birthday=24/11/1989&city=Antibes&datesortie=31/10/2020&firstname=Sylvain&heuresortie=02:05&lastname=Coulombel&placeofbirth=vsg&zipcode=06600

var address = getParameterByName('address');
var birthday = getParameterByName('birthday');
var city = getParameterByName('city');
var datesortie = getParameterByName('datesortie');
var firstname = getParameterByName('firstname');
var heuresortie = getParameterByName('heuresortie');
var lastname = getParameterByName('lastname');
var placeofbirth = getParameterByName('placeofbirth');
var zipcode = getParameterByName('zipcode');


var profile = 
	{    
        "address": address,
	"birthday": birthday,
	"city": city,
	"datesortie": datesortie,
	"firstname": firstname,
	"heuresortie": heuresortie,
	"lastname": lastname,
	"placeofbirth": placeofbirth,
	"zipcode": zipcode
	}  
	
node.innerHTML = JSON.stringify(profile)


generatePdf(profile, reason1, pdfBase)
