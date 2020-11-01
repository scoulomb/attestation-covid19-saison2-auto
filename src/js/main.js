import { generatePdf } from './pdf-util'
import pdfBase from '../certificate.pdf'

console.log("Main")
var valid_link = "https://covid19.coulombel.site/?address=15 rue d\'Antibes&birthday=20/03/1882&city=Antibes&firstname=Rene&minutesoffset=5&lastname=Coty&placeofbirth=Le Havre&zipcode=06600&reason=sport_animaux" 

// https://stackoverflow.com/questions/18239430/cannot-set-property-innerhtml-of-null
// https://stackoverflow.com/questions/37951999/error-message-innerhtml-is-not-a-function
var status = document.getElementById('status')
status.innerHTML = '<p>Started</p>'
var errors = document.getElementById('errors')
var help = document.getElementById('help')
help.innerHTML = "<p>Another example of valid usage to copy/past in your browser <br> <p> <a href=\"" + valid_link + "\">" + valid_link + "</a><br><br> and adapt with your profile. See <a href=\"https://github.com/scoulomb/attestation-covid19-saison2-auto/blob/main/README.md\">Specification</a> for more details </p>"
var userdata = document.getElementById('userdata') // cal element profile is not working so call it userdata

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url = window.location.href) {
    console.log(url)
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}   


function make_date_str(date) {

  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();
  var date_str = dd + '/' + mm + '/' + yyyy;
  return date_str
}

function make_time_str(date) { 
  return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0')
}

function process() {

  var inputElementKeys = ['address', 'birthday', 'city', 'firstname', 'minutesoffset', 'lastname', 'placeofbirth', 'zipcode', 'reason'] 
  var  inputMap = new Map();

  // Fill input map and check all elements are present
  inputElementKeys.forEach(key => inputMap.set(key, getParameterByName(key)));

  var nullKeys = [] 
  for (const  [key, value] of inputMap.entries()) {
    console.log(value);
  
    if(value===null){
       nullKeys.push(key)
    }
  }
  
  if (nullKeys.length > 0)
  {
       help.innerHTML = ""
       status.innerHTML = '<p style="color:#FF0000"; ><b>User errors</b></p>';
       errors.innerHTML =  "<p> Mandatory keys: [" +   nullKeys.join(", ")   + "] are missing. </p> <br>" +
       "<p> An exampe of valid usage is </p>" +
       "<p> <a href=\"" +valid_link + "\">" + valid_link +  "</a></p>"
       return;    
  }


  // Check reason is valid otherwise PDF generation is failing
  var accepted_reasons = [
    "travail",
    "achats",
    "sante",
    "famille",
    "handicap",
    "sport_animaux",
    "convocation",
    "missions",
    "enfants",
  ]

  console.log(inputMap.get("reason"))
  var accepted = accepted_reasons.includes(inputMap.get("reason"));
  if(! accepted) {    
    status.innerHTML = "<p> Reason not accepted </p>"
    errors.innerHTML =  "<p> Valid reasons are: " + accepted_reasons.join(", ") + "</p>"
    return;
  }

  // Process
  
  /// Compute date offset 
  var now = new Date ()
  console.log("now: " + now)
  var now_with_offset = new Date (now);
  now_with_offset.setMinutes ( now.getMinutes() + parseInt(inputMap.get("minutesoffset")));
  console.log("now with offset:" + now_with_offset) 

  var date_str = make_date_str(now_with_offset)
  var time_str = make_time_str(now_with_offset)
  
  /// Compute profile
  var profile = 
    {    
    "address": inputMap.get("address"),
    "birthday": inputMap.get("birthday"),
    "city": inputMap.get("city"),
    "datesortie": date_str,
    "firstname": inputMap.get("firstname"),
    "heuresortie": time_str,
    "lastname": inputMap.get("lastname"),
    "placeofbirth": inputMap.get("placeofbirth"),
    "zipcode": inputMap.get("zipcode")
    }
  status.innerHTML = JSON.stringify(profile)
  
  /// Generate pdf
  generatePdf(profile, inputMap.get("reason"), pdfBase)
  // set downloadBlob in generatePdf otheriwse issue with async, it download before generation ended
  status.innerHTML = '<p>Certificate generation completed</p>'
  userdata.innerHTML = '<p>Profile used for generation was:' + JSON.stringify(profile)  + '<p>'

}

process()
