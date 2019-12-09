$(document).ready(function() {
  const skillsAddDynamic = function() {
    var skills_max_fields = 10; //maximum input boxes allowed
    var skills_wrapper = $('.skills_input_fields_wrap'); //Fields wrapper
    var skills_add_button = $('.add_skills_button'); //Add button ID
    var x = 1; //initlal text box count

    $(skills_add_button).click(function(e) {
      //on add input button click
      e.preventDefault();
      if (x < skills_max_fields) {
        //max input box allowed
        x++; //text box increment
        $(skills_wrapper).append(
          '<div class="skills-entry col-md-12"><input type="text" name="filterskill" class="form-control" id="search-skills" placeholder="Enter Skill"/><button class="remove_skills btn btn-danger"><i class="fa fa-minus"></i></button></div>'
        );

        $(skills_wrapper)
          .find('input[type=text]:last')
          .autocomplete({
            source: function(req, res) {
              $.ajax({
                url: '/api/candidate/list/autocomplete/skills',
                dataType: 'jsonp',
                type: 'GET',
                data: req,
                success: function(data) {
                  res(data);
                  console.log('success entered');
                },
                error: function(err) {
                  console.log(err.status);
                  console.log('error entered');
                }
              });
            },

            minLength: 1,
            select: function(event, ui) {
              if (ui.items) {
                $('#search-position').text(ui.item.label);
              }
            }
          });
        //add input box
      }
    });

    $(skills_wrapper).on('click', '.remove_skills', function(e) {
      //user click on remove text
      e.preventDefault();
      $(this)
        .parent('div')
        .remove();
      x--;
    });
  };

  skillsAddDynamic();

  // var json = {ab:"nnn"}
  // Data Table


  var d_table = $('#list-candidates').DataTable({
        paging: true,
        serverSide: true,
        dataType: "jsonp",
        ajax: {
          url: '/api/candidate/search',
          type: 'POST',
          data : function(d){
             var da = $("#EmployeeForm").serializeArray();
             d.filterposition = da[0]['value']

             //Extraccting skills into array
             skill_arr = []
             var i = 1;
             while(1){
               if (da[i]['name']=='filterskill'){
                 skill_arr.push(da[i]['value'])
                 i = i + 1;
               }
               else
                  break;
             }
             d.filterskill = skill_arr
             d.filterExpMin = da[i]['value']
             d.filterExpMax = da[i+1]['value']
             d.filterSalMin = da[i+2]['value']
             d.filterSalMax = da[i+3]['value']
             d.filtername = da[i+4]['value']
             d.filterqualification = da[i+5]['value']
             d.selectStatus = da[i+6]['value']
          },
          success : function(res){
            console.log(res)
            $("#tbodyid").empty();
            if (res['error'] !=''){
              $("#list-candidates").find('tbody').append('<tr><td colspan="6">No Record Found</td></tr>')
            }
            else{
              for (record of res['records']) {
                var markup = "<tr><td>" + record.name + "</td><td>" + record.email + "</td><td>" + record.date + "</td><td>" + record.position + "</td><td>" + record.experience + "</td></tr>";
                $("table tbody").append(markup);
            }
          }
        }
      }
    });

  $('#EmployeeForm').submit( function(evt) {
        evt.preventDefault();
        d_table.ajax.reload();
    });

  // Position Autocomplete
  $('#search-position').autocomplete({
    source: function(req, res) {
      $.ajax({
        url: '/api/candidate/list/autocomplete/position',
        dataType: 'jsonp',
        type: 'GET',
        data: req,
        success: function(data) {
          res(data);
        },
        error: function(err) {
          console.log(err.status);
        }
      });
    },

    minLength: 1,
    select: function(event, ui) {
      if (ui.items) {
        $('#search-position').text(ui.item.label);
      }
    }
  });

  // Skills Autocomplete
  $('#search-skills').autocomplete({
    source: function(req, res) {
      $.ajax({
        url: '/api/candidate/list/autocomplete/skills',
        dataType: 'jsonp',
        type: 'GET',
        data: req,
        success: function(data) {
          res(data);
        },
        error: function(err) {
          console.log(err.status);
        }
      });
    },

    minLength: 1,
    select: function(event, ui) {
      if (ui.items) {
        $('#search-position').text(ui.item.label);
      }
    }
  });
  $('#search-qualification').autocomplete({
    source: function(req, res) {
      $.ajax({
        url: '/api/candidate/list/autocomplete/qualification',
        dataType: 'jsonp',
        type: 'GET',
        data: req,
        success: function(data) {
          res(data);
        },
        error: function(err) {
          console.log(err.status);
        }
      });
    },

    minLength: 1,
    select: function(event, ui) {
      if (ui.items) {
        $('#search-qualification').text(ui.item.label);
      }
    }
  });
});
