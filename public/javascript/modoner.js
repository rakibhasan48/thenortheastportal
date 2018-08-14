
var index = 0;

function removeClassCarousel(){
  var currentClass = '#'+ index;
  var currentDot = '#dot' + index;
  $(currentClass).removeClass('active');  
  // $(currentDot).removeClass('greenish');
}

function addClassCarousel(i){
  var nextClass = '#' + i;
  var nextDot = '#dot' + i;
  $(nextClass).addClass('active animated fadeIn');
  var bg = 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("../assets/state-'+i+'.jpg")';
  $('#carousel').fadeOut(350, function(){
    $(this).css('background-image', bg);
    $(this).fadeIn(350);  
  });

  // $(nextDot).addClass('greenish');   
}

function plus(i){
  // console.log('clicked' + i); 

  removeClassCarousel();

  if(i > 0){
    if(index >= 0 && index <8){
      index+=i;
    }else{
      index = 0;
    }  
  }else{
    if(index > 0)
      index--;
    else
      index = 8;  
  }
  
  addClassCarousel(index);

}

function changeSlides(){
  plus(1);
}

function currentSlide(event, n){
  var target = event.srcElement || event.target;
  removeClassCarousel(index);
  addClassCarousel(n);
  index = n;
  var c = $('.dots').find('.greenish')[0];
  console.log(c);
  $(c).css('background-color', '#605c5c');
  $(c).removeClass('greenish');

  $(target).addClass('greenish');

  $(target).css('background-color', '#18cfab');
}


setInterval(changeSlides, 5000);


function toggleHam(){
  if($('nav > li:hidden').length < 1){
    $('nav > li.overlay').hide('slow', function(){
      $('nav > li.overlay').toggleClass('overlay');  
    });
    
  }else{

    $('nav > li:hidden > .dropdown_content').css({
      "position" : "relative",
      "text-align" : "right"
    });
    $('nav > li:hidden').toggleClass('overlay').show('slow');
    $('nav li:nth-last-child(2)').css('border-radius', '0 0 1rem 1rem');
    $('nav li:nth-child(1)').css('padding-top', '.2rem');
  }
  // console.log($('nav > li:hidden'));
}

$('.dropdown_main').click(function(){
  
  var $btn = $(this);
  var count = ($btn.data("click_count") || 0) + 1;
  $btn.data("click_count", count);

  if(count > 1){
    if($(this).children('.dropdown_content').is(':visible')){
      $(this).children('.dropdown_content').hide('slow');  
    }else if($(this).children('.dropdown_content').is(':hidden')){
      $(this).children('.dropdown_content').show('slow');  
    }
  }
})


$(".meter > span").each(function() {
  var w = this.style.width;
  $(this)
    .data("origWidth", w)
    .width(0)
    .animate({
      width: $(this).data("origWidth") // or + "%" if fluid
    }, 1200);
});

  // function initMap(){
  // var subhaDam = {lat: 27.5528864, lng: 94.2593899};
  //   var map = new google.maps.Map(document.getElementById('map'),{
  //   zoom: 16,
  //   center: subhaDam
  //   });
    
  //   var marker = new google.maps.Marker({
  //   position: subhaDam,
  //   map: map
  //   });
  // }

  $('.reply_btn').click(function(){
    $(this).parent().find('.reply_box').toggle(500, function(){
      $(this).toggleClass('hidden');
    })
  })

// var frm = $('#comment-form');

// frm.submit(function(e){
//   e.preventDefault();

//   $.ajax({
//       type: frm.attr('method'),
//       url: frm.attr('action'),
//       data: frm.serialize(),
//       success: function (data) {
//           console.log('Submission was successful.');
//           console.log(data);

//           // new EJS({
//           //     url: '/projects/show.ejs'
//           // }).update(
//           //     document.querySelector('.comment-display'),
//           //     null
//           // );
//       },
//       error: function (data) {
//           console.log('An error occurred.');
//           console.log(data);
//       },
//   });

// })


// $('.comment_delete_form').submit(function(e){

//   e.preventDefault();
//   // console.log(e);

//   $.ajax({
//     type: $('.comment_delete_form').attr('method'),
//     url: $('.comment_delete_form').attr('action'),
//     data: $('.comment_delete_form').serialize(), 
//     success : function(data){
//       console.log(data);
//     },
//     error : function(e){
//       console.log("Error Occured!");
//     } 
//   })

// })

// function del(){
//   $('#comment_delete_form_2').submit(function(e){

//     e.preventDefault();
//     // console.log(e);
//     var tar = $(this);
//     console.log($(this));

//     $.ajax({
//       type: $('#comment_delete_form_2').attr('method'),
//       url: $('#comment_delete_form_2').attr('action'),
//       data: $('#comment_delete_form_2').serialize(), 
//       success : function(data){
//         console.log(data);
//         // console.log($(e.originalEvent.path[2]));
//         // $(tar).parents(".col-md-12").find(".comment-hr").hide();
//         $(tar).parents(".col-md-12").hide();
        
//         // console.log($(tar).parents());
//       },
//       error : function(e){
//         console.log("Error Occured!");
//       } 
//     })

//   })
// }

$('#new_project').submit(function(e){

  $('.container-loading').show();
  
})

$('#edit_project').submit(function(e){

  $('.container-loading').show();
  
})

$('.reply-btn').on('click', function(event){

  // var reply_form = $('#reply_form');
  event.preventDefault();
  // $(this).closest("form").preventDefault();
    // e.preventDefault();
    // // console.log(e);
    var reply_form = $(this).closest("form");
    var target = $(this);
    var txt = $(reply_form).find("textarea").val(); 
    
    $.ajax({
      type: $(reply_form).attr('method'),
      url: $(reply_form).attr('action'),
      data: $(reply_form).serialize(), 
      success : function(data){
        console.log(txt);
        // console.log($(target).parents(".col-md-12").find(".reply_text"));
        $(target).parents(".col-md-12").find(".reply_text").text(txt);
        $(reply_form).find("textarea").val(""); 
      },
      error : function(e){
        console.log("Error Occured!");
      } 
    })  
});

$('#generateReport').on('click', function(event){
  event.preventDefault();

  $.ajax({
    type : "GET",
    url : $(this).attr('href'),
    success : function(data){
      //console.log(data);
      $('.container-flash').prepend(`<div class="flash-msg success-msg">
          Report generated successfully! Please check your mail.
          <i class="fa fa-times flash-msg-close"></i>
        </div>`);
    },
    error : function(e){
      $('.container-flash').prepend(`<div class="flash-msg error-msg">
          Could not generate report! Try again later.
          <i class="fa fa-times flash-msg-close"></i>
        </div>`)
    }

  })
})


$('.container-flash').on('click', '.flash-msg-close', function(event){
  $(this).parent().remove();
})


// Form Validation

$().ready(function(){

  $('.container-loading').hide();

  $(document).ajaxStart(function() {
      $('.container-loading').show();

  });

  $(document).ajaxStop(function() {
      $('.container-loading').hide();
  });


  const pat = /^[_.A-z0-9.]*[._A-z0-9.]*$/g;
  const patName = /^[A-Za-z]+$/;

  jQuery.validator.addMethod("specialChar", function(val, element){
    if(val.match(pat) !== null){
      return true;
    }else{
      return false;
    }
  }, "No spaces and only '.' and '_' are allowed in username");

  jQuery.validator.addMethod("valid_name", function(val, element){
    // console.log(pat2.test(val));
    return patName.test(val);
  }, "Names can contain only alphabets");


  
  $('#public_register').validate({
    rules:{
      fName: {
        required: true,
        digits: false,
        valid_name: true
      },
      lName: {
        required: true,
        digits: false,
        valid_name: true
      },
      username: {
        specialChar: true,
        required: true,
        rangelength: [2,15],
        
      },
      email: "required",
      password: {
        required: true,
        rangelength: [5,50],
      },
      password_validation: {
        required: true,
        equalTo: "#password"
      }
    },
    messages:{
      fName: "Please enter your first name",
      lName : "Please enter your last name",
      username: {
        required: "Please enter your username",
        rangelength : "Enter a username between 2 and 15 characters"
      },
      email : "Please enter a valid email",
      password:{
        required: "Please enter a password",
        rangelength: "Please enter a password between 5 to 50 characters"
      },
      password_validation:{
        required: "Please confirm your password",
        equalTo: "Password did not match"
      }
    }
  })


  $('#gov_register').validate({
    rules: {
      departmentName: {
          required: true,
          digits: false,
        },
        username:{
          required: true,
          rangelength: [2,15],
          specialChar: true
        },
        email: "required",
        password: {
            required: true,
            rangelength: [5,50],
        },
        password_validation: {
          required: true,
          equalTo: "#password"
        },
        ministryKey: {
          required: true,
        }
      },
      messages: {
        departmentName: "Please enter your department name",
        username: {
          required: "Please enter your username",
          rangelength : "Enter a username between 2 and 15 characters"
        },
        email : "Please enter a valid email",
        password:{
          required: "Please enter a password",
          rangelength: "Please enter a password between 5 to 50 characters"
        },
        password_validation:{
          required: "Please confirm your password",
          equalTo: "Password did not match"
        },
        ministryKey: {
          required: "Please enter your ministry key"
        }
      }
  });

  $('#new_project').validate({
    rules:{
      title:{
        required: true,
        digits: false
      },
      ministry: 'required',
      image_file: 'required',
      head:{
        required: true,
        digits: false
      },
      budget: {
        required: true,
        digits: true
      },
      start_date:{
        required: true,
        date: true
      },
      end_date:{
        required: true,
        date: true
      },
      description: {
        required : true,
        rangelength: [100,10000]
      }
    },
    messages:{
      title: "Please enter the project title",
      ministry: "Please enter the ministry name",
      image_file: "Please select an image to upload",
      head: "Please enter who the project is headed by",
      budget: "Please enter the budget of the project",
      start_date: "Please enter the date of commencement of the project",
      end_date: "Please enter the estimated date of completion",
      description: "Please enter a short description of the project between 100 to 1000 characters"
    }
  });

  $('#login_user').validate({
    rules:{
      username: {
        required: true,
        specialChar: true
      },
      password: 'required'
    },
    messages:{
      username: {
          required: "Please enter your username"
        },
      password:{
        required: "Please enter a password"
      }
    }
  })

  $('#login_gov').validate({
    rules:{
      username: {
        required: true,
        specialChar: true
      },
      password: 'required'
    },
    messages:{
      username: {
          required: "Please enter your username"
        },
      password:{
        required: "Please enter a password"
      }
    }
  })

  $('#edit_project').validate({
    rules:{
      'project[title]' : {
        required : true
      },
      // 'project[image_file]':{
      //   required : true
      // },
      'project[head]' : {
        required : true,
        digits : false,
        number : false
      },
      'project[budget]' : {
        required : true,
        digits : true
      },
      'project[start_date]' : {
        required : true,
        date : true
      },
      'project[end_date]' : {
        required : true,
        date : true
      },
      'project[description]' : {
        required : true,
        rangelength : [100, 1000]
      }
    },
    messages:{
      "project[title]": "Please enter the project title",
      "project[ministry]": "Please enter the ministry name",
      "project[image_file]": "Please select an image to upload",
      "project[head]": "Please enter who the project is headed by",
      "project[budget]": "Please enter the budget of the project",
      "project[start_date]": "Please enter the date of commencement of the project",
      "project[end_date]": "Please enter the estimated date of completion",
      "project[description]": "Please enter a short description of the project between 100 to 1000 characters"  
    }
  });

  $('#budget-form').validate({
    rules : {
      ministry : 'required',
      total : {
        required: true,
        digits : true
      },
      year : 'required',
      amountSpent : {
        required : true,
        digits : true
      }
    }, 
    messages : {
      ministry : "Please enter the ministry name",
      total : "Please enter total budget",
      year : "Please enter fiscal year",
      amountSpent : "Please enter the portion of the budget that has been spent",
    }
  })

  $('#suggestion-form').validate({
    rules: {
      "suggestion[title]" : {
        required : true
      },
      "suggestion[text]" : {
        required : true,
        rangelength : [50, 1000]
      },
      "suggestion[ministry]" : {
        required : true
      }
    }, 
    messages : {
      "suggestion[title]" : "Please enter the title",
      "suggestion[text]" : "Please enter a short description of the project between 50 to 1000 characters",
      "suggestion[ministry]" : "Please enter the ministry your suggestion relates to"
    }
  });

  $('#show_budget_form').validate({
    rules : {
      year : "required",
      ministry : "required"
    }, 
    messages : {
      year : "Please enter fiscal year",
      ministry : "Please enter the ministry name"
    }
  });

  $('#forgot_password').validate({
    rules:{
      email : "required"
    },
    messages : {
      email : "Please enter your email"
    }
  });

  $('#update_password').validate({
    rules : {
      password: {
        required: true,
        rangelength: [5,50],
      },
      password_match: {
        required: true,
        equalTo: "#password"
      }
    },
    messages : {
      password : "Please enter the new password",
      password_match : {
        required : "Please re-enter the paswword",
        equalTo : "Passwords don't match!"
      }
    }
  });

  $('#comment-form').validate({
    rules : {
      "comment[text]" : "required"
    },
    messages : {
      "comment[text]" : "Please wtite something first"
    }
  });

  $('#add_key').validate({
    rules : {
      department : "required",
      key : {
        required : true,
        rangelength : [5,50]
      },
      key_match : {
        required : true,
        equalTo : "#key"
      }
    },
    messages : {
      department : "Please enter a department name",
      key : "Please enter the key (between 5 and 50 characters)",
      key_match : "Key fields don't match"
    }
  });

  $('#sort_ministry').validate({
    rules : {
      ministry : "required"
    },
    messages : {
      ministry : "Enter a option"
    }
  });


})


