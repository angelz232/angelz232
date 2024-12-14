var textarea = $('.term');

var i = 0;
var count = 0;

var start = 'deadshot.org'
var data = [
  './deadshot.org',
  'Richtofen',
  '*********',
  'Yes\n',
  'Richtofen',
  'Richtofen',
  'im@trolli.ng\n\n',
]

var info = [
  "Please state the user you would like to add > ",
  "Please set the password for 'Richtofen' > ",
  "Shall we create a home directory for 'Richtofen' > ",
  "Directory Created, time for your socials!\n\nPlease state your Doxbin username, if none put 'N/A' > ",
  "Please state your Telegram @, if none put 'N/A' > ",
  "Please state your Email, if none put 'N/A' > ",
];

runner(start)
 
function runner(text) {
  if (text) textarea.append(`<span style="color: #7CFC00;">` + text.charAt(i) + `</span>`)

  i++;
  setTimeout(
    function() {
      if (i < text.length) {
        runner(text);
      } else {
        // textarea.append("</span>")
        textarea.append("<br>")
        i = 0;
        textarea.append(info[count])
        count++;
        runner(data[count])
        if (count >= data.length) {
          setTimeout(function() {feedbacker();}, 650);
        }
      }
    }, Math.floor(Math.random() * 80) + 55)
}

var count = 0;
var time = 1;

function feedbacker() {
  textarea.append("[" + count / 1000 + "] " + output[i] + "<br>");
  if (time % 2 == 0) {
    i++;
    textarea.append("[" + count / 1000 + "] " + output[i] + "<br>");
  }
  if (time == 3) {
    i++;
    textarea.append("[" + count / 1000 + "] " + output[i] + "<br>");
    i++;
    textarea.append("[" + count / 1000 + "] " + output[i] + "<br>");
    i++;
    textarea.append("[" + count / 1000 + "] " + output[i] + "<br>");
  }
  window.scrollTo(0, document.body.scrollHeight);  
  i++;
  time = Math.floor(Math.random() * 4) + 1;
  count += time;
  setTimeout(
    function() {
      if (i < output.length - 2)
        feedbacker();
      else {
        textarea.append("<br>Initialising...<br>");
        setTimeout(function() {$(".load").fadeOut(2000);}, 1000);
      }
    },time);
}

var output = [
  "\nInformation complete! Initializing database.",
  "debug: Creating user account 'Richtofen'",
  "debug: Setting user account password",
  "debug: Creating user home directory, /home/Richtofen",
  "debug: Granting sudo privileges to user 'Richtofen'",
  "debug: Setting github account name 'sxcvsdfwgsdfgsd'",
  "debug: Setting Discord username 'richtofen77'",
  "debug: Setting email address 'im@trolli.ng'",
  "debug: Account initialized!"
];
