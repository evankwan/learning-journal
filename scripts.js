const app = {}; // namespace

app.totalHours = 0; // global variable to pull logged hours for a skill
app.skills = []; // array of logged skills
app.formEdit = false; // flag for form if user is editing
// declare all namespace properties variables used for editing
app.editDate, app.editSkill, app.editTopic, app.editHours, app.editDesc;
// declare all namespace properties used for storing the reference to the edit cells
app.dateRef, app.skillRef, app.topicRef, app.hoursRef, app.descRef;
// declare the namespace properties used for editing the hours log
app.hoursLog, app.editHoursClass, app.editSkillClass, app.resetHours;
// declare dark/light mode variable
app.darkMode = true;
// flag variable for window sizing
app.mobileSize = false;

// get the values from the form and post to the page
app.getEntry = function() {
  $('form').on('submit', function(e) {
    e.preventDefault();

    // store values in variables
    app.dateEntry = $('#date').val();
    app.skillEntry = $('#skill').val();
    app.topicEntry = $('#topic').val();
    app.hoursEntry = parseInt($('#hours').val());
    app.descEntry = $('#desc').val();

    // erase form inputs
    $('#date').val('').css('box-shadow', 'none');
    $('#skill').val('').css('box-shadow', 'none');
    $('#topic').val('').css('box-shadow', 'none');
    $('#hours').val('').css('box-shadow', 'none');
    $('#desc').val('').css('box-shadow', 'none');
 
    // add totalled hours to page
    app.addHours();
    // add journal entry to page
    app.addEntry();
    
    // revert back to false for formEdit flag
    app.formEdit = false;
  })
}

app.addHours = function() {
  // normalizing input skill for capitalization
  app.skillClass = app.skillEntry.toLowerCase();

  // logic to determine how to add hours
  // first hours logged
  if (app.skills.length === 0) {
    if (app.formEdit === false) {
      app.skills.push(app.skillEntry);
      $('.hours-log').append(`
        <tr>
          <th scope='row' class='${app.skillClass}'>${app.skillEntry}: </th>
          <td class='${app.skillClass}-hours'>${app.hoursEntry}</td>
        </tr>`
      );
    } else {
      $(`.${app.editHoursClass}`).remove();
      $(`.${app.editSkill.toLowerCase()}`).remove();

      // add new skill to array
      app.skills.push(app.skillEntry);
      
      // add skill and hours to page
      $('.hours-log').append(`
        <tr>
          <th scope='row' class='${app.skillClass}'>${app.skillEntry}: </th>
          <td class='${app.skillClass}-hours'>${app.hoursEntry}</td>
        </tr>`
      );
    }
    
  } else { // all entries after the first
    // determine if hours for this skill have been logged
    for (let i = 0; i < app.skills.length; i++) {
      // if skill has been logged
      if (app.skillEntry.toLowerCase() === app.skills[i].toLowerCase()) {
        // if we are editing an existing entry
        if (app.formEdit === true) {
          // pulling the total hours from the page for the skill
          let hours = parseInt($(`.${app.skillClass}-hours`).text());
          // subtracting the previous value that we are changing
          hours -= $(app.hoursRef).text();
          // adding the updated value
          hours += app.hoursEntry;
          // update the page
          $(`.${app.skillClass}-hours`).text(hours);
        } else { // if we are not editing an existing entry
          // get hours from page
          let hours = parseInt($(`.${app.skillClass}-hours`).text());
          // add hours from page to hours entered
          hours += app.hoursEntry;
          // add hours to page
          $(`.${app.skillClass}-hours`).text(hours);
          // cancel rest of loop
          break;
        }
      } else if (i + 1 <= app.skills.length) { // if skill has not been logged
        if (app.formEdit === true) { // if we are editing an existing entry and skill has changed
          // remove the previous skill and hours from log
          $(`.${app.editHoursClass}`).remove();
          $(`.${app.editSkill.toLowerCase()}`).remove();

          // add new skill to array
          app.skills.push(app.skillEntry);
          
          // add skill and hours to page
          $('.hours-log').append(`
            <tr>
              <th scope='row' class='${app.skillClass}'>${app.skillEntry}: </th>
              <td class='${app.skillClass}-hours'>${app.hoursEntry}</td>
            </tr>`
          );
          break;
        } else {
          // add skill to array
          app.skills.push(app.skillEntry);
          // add skill and hours to page
          $('.hours-log').append(`
            <tr>
              <th scope='row' class='${app.skillClass}'>${app.skillEntry}: </th>
              <td class='${app.skillClass}-hours'>${app.hoursEntry}</td>
            </tr>`
          );
          break;
        }      
      }
    }
  }
}


app.addEntry = function() {
  if (app.formEdit === true) {
    // update edit symbol
    $('.edit').html('<i class="far fa-edit"></i>').css('color', '#ea593e');
    // update existing tr with new data
    app.dateRef.text(`${app.dateEntry}`);
    app.skillRef.text(`${app.skillEntry}`);
    app.topicRef.text(`${app.topicEntry}`);
    app.hoursRef.text(`${app.hoursEntry}`);
    app.descRef.text(`${app.descEntry}`);
  } else {
    // add journal entry to page
    $(".journal").prepend(`
      <tr>
        <td class='edit'><i class="far fa-edit"></i></td>
        <td class='dateCell'>${app.dateEntry}</td>
        <td class='skillCell'>${app.skillEntry}</td>
        <td class='topicCell'>${app.topicEntry}</td>
        <td class='hoursCell'>${app.hoursEntry}</td>
        <td class='descCell'>${app.descEntry}</td>
      </tr>`
    );
  }
}

app.editEntry = function() {
  // event listener for the journal table
  $('.journal').on('click', '.edit', function() {
    // logic for if we are not currently editing an entry
    if (app.formEdit === false) {
      // visual cues for the user to see if they are editing
      $('.edit').html('<i class="far fa-edit"></i>').css('color', '#ea593e');
      $(this).html('<i class="fas fa-edit"></i>').css('color', '#3e97ea');
      
      // set the edit flag as true
      app.formEdit = true;
      
      // reference the tr that holds the journal entry
      let editParent = this.parentElement;
      
      // create references
      app.dateRef = $(editParent).find('.dateCell');
      app.skillRef = $(editParent).find('.skillCell');
      app.topicRef = $(editParent).find('.topicCell');
      app.hoursRef = $(editParent).find('.hoursCell');
      app.descRef = $(editParent).find('.descCell');

      // get text from reference cells
      app.editDate = $(app.dateRef).text();
      app.editSkill = $(app.skillRef).text();
      app.editTopic = $(app.topicRef).text();
      app.editHours = $(app.hoursRef).text();
      app.editDesc = $(app.descRef).text();

      // get classes and value from hours log
      app.skillClass = app.editSkill.toLowerCase();
      app.editHoursClass = app.editSkill.toLowerCase() + '-hours';
      let hoursText = $(`.${app.editHoursClass}`).text();
      app.hoursLog = Number.parseInt(hoursText, 10);

      // remove skill from skills array if we are removing all the hours
      if (app.hoursLog == app.editHours) {
        for (let i = 0; i < app.skills.length; i++) {
          if (app.skills[i] == app.editSkill) {
            app.skills.splice(i, i + 1);
          }
        }
      }

      // add the reference values to the form and add visual cues for user
      $('#date').val(app.editDate).css('box-shadow', '0px 0px 5px 3px #3e97ea');
      $('#skill').val(app.editSkill).css('box-shadow', '0px 0px 5px 3px #3e97ea');
      $('#topic').val(app.editTopic).css('box-shadow', '0px 0px 5px 3px #3e97ea');
      $('#hours').val(app.editHours).css('box-shadow', '0px 0px 5px 3px #3e97ea');
      $('#desc').val(app.editDesc).css('box-shadow', '0px 0px 5px 3px #3e97ea');
    } else { // if we were already editing an entry
      // set the edit flag as false
      app.formEdit = false;

      // revert the visual cues for user
      $('.edit').html('<i class="far fa-edit"></i>').css('color', '#ea593e');
      $('#date').val('').css('box-shadow', 'none');
      $('#skill').val('').css('box-shadow', 'none');
      $('#topic').val('').css('box-shadow', 'none');
      $('#hours').val('').css('box-shadow', 'none');
      $('#desc').val('').css('box-shadow', 'none');
    }
  });
}

// edit table heading text if screen size is mobile
$(window).resize(function() {
  if ($(window).width() < 480) {
    $('.dateHead').html('<i class="far fa-calendar-alt"></i>');
    $('.skillHead').html('<i class="fas fa-brain"></i>');
    $('.topicHead').html('<i class="far fa-lightbulb"></i>');
    $('.hoursHead').html('<i class="fas fa-hourglass-half"></i>');
    $('.descHead').html('<i class="fas fa-tag"></i>');
    app.mobileSize = true;
  }
  // resize to normal after starting small
  if ($(window).width() >= 480) {
    if (app.mobileSize === true) { // done to only make change once instead of every time we resize the window
      $('.dateHead').html('Date');
      $('.skillHead').html('Skill');
      $('.topicHead').html('Topic');
      $('.hoursHead').html('Hours');
      $('.descHead').html('Description');
      app.mobileSize = false;
    }    
  }
});

// color scheme change
app.colorSwitch = function() {
  $('#dark-mode').on('click', function() {
    // logic to determine if we're in dark mode
    if (app.darkMode === true) {
      // convert to light more
      $('#dark-mode').html('Dark Mode <i class="fas fa-toggle-off"></i>');
      $('html').css({'color': 'rgba(40, 40, 40, 1)', 'background-color': 'whitesmoke'});
      $('h1').css('border-bottom', '1px solid rgba(40, 40, 40, 1)');
      $('form').css('border-bottom', '2px solid rgba(40, 40, 40, 1)');
      $('.journal-heading th').css('border-bottom', '1px solid rgba(40, 40, 40, 1)');
      $('.journal td').css('border-bottom', '1px solid rgba(40, 40, 40, 1)');
      $('button[type=submit]').css({'color': 'rgba(40, 40, 40, 1)', 'background-color': 'whitesmoke'});
      $('button[type=submit]:active').css('color', '#3e97ea');
      app.darkMode = false;
    } else {
      // convert to dark mode
      $('#dark-mode').html('Dark Mode <i class="fas fa-toggle-on"></i>');
      $('html').css({'color': 'whitesmoke', 'background-color': 'rgba(40, 40, 40, 1)'});
      $('h1').css('border-bottom', '1px solid whitesmoke');
      $('form').css('border-bottom', '3px solid whitesmoke');
      $('.journal-heading th').css('border-bottom', '1px solid whitesmoke');
      $('.journal td').css('border-bottom', '1px solid whitesmoke');
      $('button[type=submit]').css({'color': 'whitesmoke', 'background-color': 'rgba(40, 40, 40, 1)'});
      $('button[type=submit]:active').css('color', '#3e97ea');
      app.darkMode = true;
    }
  });
};

app.init = () => {
  app.getEntry();
  app.editEntry();
  app.colorSwitch();
};

$(document).ready(function() {
  app.init();
  if($(window).width() <= 480) {
    $('.dateHead').html('<i class="far fa-calendar-alt"></i>');
    $('.skillHead').html('<i class="fas fa-brain"></i>');
    $('.topicHead').html('<i class="far fa-lightbulb"></i>');
    $('.hoursHead').html('<i class="fas fa-hourglass-half"></i>');
    $('.descHead').html('<i class="fas fa-tag"></i>');
    app.mobileSize = true;
  }
});