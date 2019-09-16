function showHelpSection(section) {
    var help = $("#help");
    var newSection = help.find("#help-" + section);
    help.find(".help-section").not(newSection).removeClass("active");
    newSection.addClass("active");
}

$(document).ready(function(){
  // Update help section when setup stepper changes
  $("#steps").on("stepper:selection-changed", function(event, selected) {
    showHelpSection(selected);
  });
  
  // Help button toggles help content
  $("#help-button").on("click", function(event) {
    $("#page").toggleClass("help-on");
    $(window).trigger("resize"); // Force shiny to resize plots
  });
  
  $('a[data-toggle="tab"]').on("show.bs.tab", function(event) {
    if ($(event.target).attr("id") == "nav-results-tab") {
      showHelpSection("results");
    } else {
      showHelpSection($("#nav-setup ul.stepper > li.active").attr("id"));
    }
  });
});

Shiny.addCustomMessageHandler("activate_tab", function(message) {
  $("#" + message.tab).tab("show");
});

Shiny.addCustomMessageHandler("update_analysis_progress", function(message) {
  // In here, message.array is a dict whose keys are unique IDs for progress items, and whose values are dict(name, done)
  // For each item, we find an existing progress item with that key, creating if necessary, then update the name and the doneness
  for (var id in message.items) {
    var item = message.items[id];
    id = "progress-" + id;
    var itemElt = $("#" + id);
    if (!itemElt.length) {
      // Item doesn't exist, create
      itemElt = $("<li class='progress-item list-group-item d-flex justify-content-between align-items-center' />").attr("id", id).append(
        "<span class='name'/><span class='badge badge-primary badge-pill'>&#x2713;</span>"
      ).appendTo($("#analysis-progress"));
    }

    // Item exists, update name and doneness
    if ('name' in item) {
      itemElt.find(".name").text(item.name);
    }
    if ('done' in item) {
      itemElt.toggleClass('done', item.done);
    }
  }
});

