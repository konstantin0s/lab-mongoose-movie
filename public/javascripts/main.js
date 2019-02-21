
$(document).ready(function() {
  $('.delete-celebrity').on('click', function(e) {
   $target = $(e.target);
   const id = $target.attr('data-id');
   $.ajax({
     type: 'DELETE',
     url: '/celeb/'+id,
     success: function(response) {
       alert('Deleting celebrity');
       window.location.href='/';
     },
     error: function(err) {
       console.log(err);
     }
   });
 });
});
