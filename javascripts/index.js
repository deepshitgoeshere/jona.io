var database = [
  [
    "hey, are u there?",
    "who are you?"
  ],
  [
    "i'm jona. trust me, i'm a friend.",
    "why should i trust you?"
  ],
  [
    "good point. you can never be sure in these times. well... let's just say i come from the PISO",
    "the PISO?"
  ],
  [
    "yeah, the post-internet safety organization. we're basically a bunch of rebels fighting against the claws of internet dominance",
    "how would you fight against something you can't defeat?"
  ],
  [
    "we use some ancient methods that have actually come to work quite well. ooooold stuff.",
    "namely?"
  ],
  [
    "there's a thing called GIT. don't know if you remember it.",
    "isn't that the version control thingy?"
  ],
  [
    "yeah, it's how first generation users managed their code, appearantly",
    "and how do you use it?"
  ],
  [
    "we use this secret service called GITHUB. <a href='http://github.com'>here's my profile</a>",
    "woah neat."
  ],
  [
    "yeah, and there's also our internal messaging service, TWITTER",
    "sounds familiar..."
  ],
  [
    "it does? i think a similar thing existed ~50 years back, in the first generation",
    "wow, why do i know this stuff then? weird."
  ],
  [
    "anywayyyyy, i gave you access to it. you might wanna check <a href='http://twitter.com/arrowfunction'>me</a> out ;)",
    "this is cool and all, but why are you telling me all this?"
  ],
  [
    "because... because you are the legacy, REDACTED. only you can save us",
    "my name isn't REDACTED."
  ],
  [
    "oh no",
    "what?"
  ],
  [
    "they've found us. they've found our chat. thREDACTED",
    "jona?"
  ],
  [
    "",
    "oh god."
  ],
  [
    "",
    "i better get away from here then"
  ],
  [
    "; DROP DATABASE users",
    "uhh"
  ],
  [
    "oh god, i've managed to fend them off temporarily. listen, you must get away NOW. it's NOT safe",
    "what happened? am i in danger?"
  ],
  [
    "yes, you are in danger. get away from your computer IMMEDIATELY. they'll REDACTED",
    "ah shit"
  ]
]

var pointer = 0
var end = database.length - 1

$(document).ready(function () {
  var t = database[pointer][0]
  append(t, 0)

  $('.prompt').keypress(function (e) {
    e.preventDefault()
    if ($('.prompt').val() !== '' && pointer === end)
      endIt()
    if (e.keyCode === 13)
      submitText()
    else
      addText()
  })
})

function addText () {
  var rand = Math.floor(Math.random() * 4)
  var val = $('.prompt').val()
  if (val !== database[pointer][1])
    var rest
    if (val.length === 0)
      rest = database[pointer][1]
    else
      rest = database[pointer][1].split(val)[1]
    var str = val.concat(rest.substr(0, rand))
    $('.prompt').val(str)
}

function submitText () {
  var val = $('.prompt').val()
  if (val === database[pointer][1]) {
    append(val, 1)
    pointer++
    $('.prompt').attr('disabled', 'disabled')
    $('.prompt').val('')
    setTimeout(function () {
      append(database[pointer][0], 0)
      $('.prompt').removeAttr('disabled')
      $('.prompt').focus()
    }, (Math.random() * 4) * 1000)
  }
}

function endIt () {
  $('.center').html('<h1 style="font-size: 50px">YOU SHOULDN\'T HAVE DONE THAT.</h1><br><div class="sized">hi, i\'m jona. i do web stuff.<br><a href="http://github.com/hg">github</a> -- <a href="http://twitter.com/arrowfunction">twitter</a></div>')
}

function append (text, s) {
  var div
  if (s === 0)
    div = '<div class="item">jona: ' + text + '</div>'
  else
    div = '<div class="item">you: ' + text + '</div>'
  $(div).appendTo('.message-history')
  $('.message-history').animate({scrollTop: 400000}, 0)
}
